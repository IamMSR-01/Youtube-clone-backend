import mongoose from "mongoose";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getVideoComments = asyncHandler(async (req, res) => {
  //TODO: get all comments for a video
  const { videoId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(404, "Invalid video ID");
  }

  const pageNumber = parseInt(page);
  const limitNumber = parseInt(limit);

  if (
    isNaN(pageNumber) ||
    isNaN(limitNumber) ||
    pageNumber <= 0 ||
    limitNumber <= 0
  ) {
    throw new ApiError(400, "Invalid page or limit");
  }

  const comments = await Comment.aggregate([
    {
      $match: {
        video: mongoose.Types.ObjectId(videoId),
      },
    },
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
        content: 1,
        createdAt: 1,
        owner: {
          _id: { $arrayElemAt: ["$ownerDetails._id", 0] },
          username: { $arrayElemAt: ["$ownerDetails.username", 0] },
          email: { $arrayElemAt: ["$ownerDetails.email", 0] },
        },
      },
    },
    {
      $sort: {
        createdAt: -1,
      },
    },
    {
      $skip: (pageNumber - 1) * limitNumber,
    },
    {
      $limit: limitNumber,
    },
  ]);

  if (!comments) {
    throw new ApiError(404, "Comments not found");
  }

  const totalComments = await Comment.countDocuments({
    video: mongoose.Types.ObjectId(videoId),
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        comments,
        totalComments,
        currentPage: pageNumber,
        totalPages: Math.ceil(totalComments / limitNumber),
      },
      "Comments retrieved successfully"
    )
  );
});

const addComment = asyncHandler(async (req, res) => {
  // TODO: add a comment to a video
  const { videoId } = req.params;
  const { content } = req.body;
  const userId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(404, "Invalid video ID");
  }

  if (!content || content.trim() === "") {
    throw new ApiError(400, "Comment content is required");
  }

  const comment = await Comment.create({
    content,
    owner: userId,
    video: videoId,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, comment, "Comment added successfully"));
});

const updateComment = asyncHandler(async (req, res) => {
  // TODO: update a comment
  const { commentId } = req.params;
  const { content } = req.body;
  const userId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(commentId)) {
    throw new ApiError(404, "Invalid comment ID");
  }

  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  if (comment.owner.toString() !== userId.toString()) {
    throw new ApiError(403, "Unauthorized to update this comment");
  }

  comment.content = content || comment.content;
  await comment.save();
  return res
    .status(200)
    .json(new ApiResponse(200, comment, "Comment updated successfully"));
});

const deleteComment = asyncHandler(async (req, res) => {
  // TODO: delete a comment
  const { commentId } = req.params;
  const userId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(commentId)) {
    throw new ApiError(404, "Invalid comment ID");
  }

  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  if (comment.owner.toString() !== userId.toString()) {
    throw new ApiError(403, "Unauthorized to delete this comment");
  }

  await Comment.findByIdAndDelete(commentId);
  return res
    .status(200)
    .json(new ApiResponse(200, null, "Comment deleted successfully"));
});

export { getVideoComments, addComment, updateComment, deleteComment };
