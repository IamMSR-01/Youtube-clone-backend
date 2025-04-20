import mongoose from "mongoose";
import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";

// Get all videos with pagination, sorting, and search functionality.
const getAllVideos = asyncHandler(async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      query,
      sortBy = "createdAt",
      sortType = "desc",
      userId,
    } = req.query;

    // Convert pagination parameters to integers
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);

    // Validate pagination parameters
    if (
      isNaN(pageNumber) ||
      isNaN(limitNumber) ||
      pageNumber <= 0 ||
      limitNumber <= 0
    ) {
      throw new ApiError(400, "Invalid page or limit parameters");
    }

    // Define aggregation pipeline for filtering, sorting, and pagination
    const pipeline = [];

    // Search videos by title if query is provided
    if (query) {
      pipeline.push({
        $match: {
          title: { $regex: query, $options: "i" }, // Case-insensitive search
        },
      });
    }

    // Filter videos by user ID if provided
    if (userId) {
      pipeline.push({
        $match: {
          owner: userId,
        },
      });
    }

    // Join user details using $lookup
    pipeline.push({
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "ownerDetails",
      },
    });

    // Project only required fields
    pipeline.push({
      $project: {
        video: 1,
        thumbnail: 1,
        title: 1,
        description: 1,
        duration: 1,
        views: 1,
        isPublished: 1,
        createdAt: 1,
        owner: {
          _id: { $arrayElemAt: ["$ownerDetails._id", 0] },
          username: { $arrayElemAt: ["$ownerDetails.username", 0] },
          email: { $arrayElemAt: ["$ownerDetails.email", 0] },
        },
      },
    });

    // Apply sorting
    const sortOptions = {};
    sortOptions[sortBy] = sortType === "desc" ? -1 : 1;
    pipeline.push({ $sort: sortOptions });

    // Apply pagination
    pipeline.push({ $skip: (pageNumber - 1) * limitNumber });
    pipeline.push({ $limit: limitNumber });

    // Execute aggregation pipeline
    const videos = await Video.aggregate(pipeline);

    // Count total videos for pagination info
    const totalVideosPipeline = [...pipeline];
    totalVideosPipeline.push({ $count: "totalVideos" });
    const totalCountResult = await Video.aggregate(totalVideosPipeline);
    const totalVideos = totalCountResult[0]?.totalVideos || 0;

    if (!videos.length) {
      throw new ApiError(404, "No videos found");
    }

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          totalVideos,
          currentPage: pageNumber,
          totalPages: Math.ceil(totalVideos / limitNumber),
          videos,
        },
        "Videos fetched successfully"
      )
    );
  } catch (error) {
    throw new ApiError(
      error.statusCode || 500,
      error.message || "Internal Server Error"
    );
  }
});

// Upload and publish a new video.
const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  // Validate required fields
  if (!title || !description) {
    throw new ApiError(400, "Title and description are required");
  }

  // Validate file upload
  if (!req.files || !req.files.video || !req.files.thumbnail) {
    throw new ApiError(400, "Video and thumbnail are required");
  }

  // Extract local file paths
  const videoLocalPath = req.files.video[0].path;
  const thumbnailLocalPath = req.files.thumbnail[0].path;

  // Upload files to Cloudinary
  const videoUpload = await uploadOnCloudinary(videoLocalPath, "videos");
  const thumbnailUpload = await uploadOnCloudinary(
    thumbnailLocalPath,
    "thumbnails"
  );

  if (!videoUpload?.url || !thumbnailUpload?.url) {
    throw new ApiError(400, "Error while uploading video or thumbnail");
  }

  // Create video entry in database
  const video = await Video.create({
    title,
    description,
    video: videoUpload.url,
    thumbnail: thumbnailUpload.url,
    owner: req.user._id,
    views: 0,
    isPublished: false,
    duration: req.body.duration || 0,
  });

  if (!video) {
    throw new ApiError(400, "Error while uploading video");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, { video }, "Video published successfully"));
});

// Fetch a video by ID and increment view count.
const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

  const video = await Video.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(videoId) } },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "ownerDetails",
      },
    },
    {
      $project: {
        video: 1,
        thumbnail: 1,
        title: 1,
        description: 1,
        duration: 1,
        views: 1,
        isPublished: 1,
        createdAt: 1,
        owner: {
          _id: { $arrayElemAt: ["$ownerDetails._id", 0] },
          username: { $arrayElemAt: ["$ownerDetails.username", 0] },
          email: { $arrayElemAt: ["$ownerDetails.email", 0] },
        },
      },
    },
  ]);

  if (!video.length) {
    throw new ApiError(404, "Video not found");
  }

  await Video.findByIdAndUpdate(videoId, { $inc: { views: 1 } });

  return res
    .status(200)
    .json(new ApiResponse(200, video[0], "Video fetched successfully"));
});

// Delete a video by ID.
const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const userId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(404, "Invalid video ID");
  }

  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }
  if (video.owner.toString() !== userId.toString()) {
    throw new ApiError(403, "Unauthorized to delete this video");
  }

  // Delete video and thumbnail from Cloudinary
  await Promise.all([
    deleteFromCloudinary(video.video),
    deleteFromCloudinary(video.thumbnail),
  ]);

  // Delete video from database
  await Video.findByIdAndDelete(videoId);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Video deleted successfully"));
});

// Toggle video publish status.
const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  const userId = req.user._id;
  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(404, "Invalid video ID");
  }

  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }
  if (video.owner.toString() !== userId.toString()) {
    throw new ApiError(403, "Unauthorized to toggle publish status");
  }
  video.isPublished = !video.isPublished;
  await video.save();

  return res
    .status(200)
    .json(new ApiResponse(200, video, "Publish status toggled successfully"));
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { title, description } = req.body;
  const userId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(404, "Invalid video ID");
  }

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  if (video.owner.toString() !== userId.toString()) {
    throw new ApiError(403, "Unauthorized to update this video");
  }

  let updatedThumbnail = video.thumbnail;
  if (req.file) {
    const uploadedThumbnail = await uploadOnCloudinary(
      req.file.path,
      "thumbnails"
    );
    if (uploadedThumbnail?.url) {
      updatedThumbnail = uploadedThumbnail.url;
    }
  }

  video.title = title || video.title;
  video.description = description || video.description;
  video.thumbnail = updatedThumbnail || video.thumbnail;
  await video.save();

  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video updated successfully"));
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  deleteVideo,
  togglePublishStatus,
  updateVideo,
};
