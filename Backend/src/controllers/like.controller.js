import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const userId = req.user._id;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

  const existingLike = await Like.findOne({
    video: videoId,
    likedBy: userId,
  });

  if (existingLike) {
    await Like.findByIdAndDelete(existingLike._id);
    return res.status(200).json(new ApiResponse(200, null, "Like removed"));
  }

  await Like.create({
    video: videoId,
    likedBy: userId,
  });

  return res.status(200).json(new ApiResponse(200, null, "Like added"));
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const userId = req.user._id;

  if (!isValidObjectId(commentId)) {
    throw new ApiError(400, "Invalid or missing comment");
  }

  const existingLike = await Like.findOne({
    comment: commentId,
    likedBy: userId,
  });
  if (existingLike) {
    await Like.findByIdAndDelete(existingLike._id);
    return res.status(200).json(new ApiResponse(200, null, "Like removed"));
  }

  await Like.create({
    comment: commentId,
    likedBy: userId,
  });

  return res.status(200).json(new ApiResponse(200, null, "Like added"));
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  const userId = req.user._id;

  if (!isValidObjectId(tweetId)) {
    throw new ApiError(400, "Invalid tweet ID");
  }

  const existingLike = await Like.findOne({
    tweet: tweetId,
    likedBy: userId,
  });
  if (existingLike) {
    await Like.findByIdAndDelete(existingLike._id);
    return res.status(200).json(new ApiResponse(200, null, "Like removed"));
  }

  await Like.create({
    tweet: tweetId,
    likedBy: userId,
  });

  return res.status(200).json(new ApiResponse(200, null, "Like added"));
});

const getLikedVideos = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const likedVideos = await Like.aggregate([
    {
      $match: {
        likedBy: new mongoose.Types.ObjectId(userId),
        video: { $ne: null },
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
      $project: {
        _id: 0,
        video: "$videoDetails._id",
        title: "$videoDetails.title",
        thumbnail: "$videoDetails.thumbnail",
        views: "$videoDetails.views",
        likedAt: "$createdAt",
      },
    },
    {
      $sort: { likedAt: -1 },
    },
  ]);

  if (!likedVideos.length) {
    throw new ApiError(404, "No liked videos found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, likedVideos, "Liked videos fetched successfully")
    );
});

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };
