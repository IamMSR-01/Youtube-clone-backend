import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { Subscription } from "../models/subscription.model.js";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getChannelStats = asyncHandler(async (req, res) => {
  // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.

  const { channelId } = req.params;
  if (!isValidObjectId(channelId)) {
    throw new ApiError(404, "Invalid channel ID");
  }

  const [stats] = await Promise.all([
    Video.aggregate([
      {
        $match: {
          owner: new mongoose.Types.ObjectId(channelId),
        },
      },
      {
        $group: {
          _id: null,
          totalVideos: {
            $sum: 1,
          },
          totalViews: {
            $sum: "$views",
          },
          totalLikes: {
            $sum: {
              $size: "$likes",
            },
          },
        },
      },
    ]),
    Like.aggregate([
      {
        $match: {
          video: {
            $ne: null,
          },
        },
      },
      {
        $lookup: {
          from: "videos",
          localField: "video",
          foreignField: "_id",
          as: "videoDetails",
        },
      },
      {
        $unwind: "$videoDetails",
      },
      {
        $match: {
          "videoDetails.owner": new mongoose.Types.ObjectId(channelId),
        },
      },
      {
        $group: {
          _id: null,
          totalLikes: {
            $sum: 1,
          },
        },
      },
    ]),
    Subscription.countDocuments({
      channel: channelId,
    }),
  ]);

  const totalVideos = stats[0] ? stats[0].totalVideos : 0;
  const totalViews = stats[0] ? stats[0].totalViews : 0;
  const totalLikes = stats[1] ? stats[1].totalLikes : 0;
  const totalSubscribers = stats[2] || 0;

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        totalVideos,
        totalViews,
        totalLikes,
        totalSubscribers,
      },
      "Channel stats retrieved successfully"
    )
  );
});

const getChannelVideos = asyncHandler(async (req, res) => {
  // TODO: Get all the videos uploaded by the channel
  const { channelId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  if (!isValidObjectId(channelId)) {
    throw new ApiError(404, "Invalid channel ID");
  }

  const pageNumber = parseInt(page);
  const limitNumber = parseInt(limit);

  if (
    isNaN(pageNumber) ||
    isNaN(limitNumber) ||
    pageNumber <= 0 ||
    limitNumber <= 0
  ) {
    throw new ApiError(400, "Invalid page or limit parameters");
  }

  const videos = await Video.find({
    owner: channelId,
  })
    .select("title thumbnail views createdAt")
    .sort({ createdAt: -1 })
    .skip((pageNumber - 1) * limitNumber)
    .limit(limitNumber);

  if (!videos.length) {
    throw new ApiError(404, "No videos found for channel");
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        totalVideos: videos.length,
        currentPage: pageNumber,
        totalPages: Math.ceil(videos.length / limitNumber),

        videos,
      },
      "Channel videos retrieved successfully"
    )
  );
});

export { getChannelStats, getChannelVideos };
