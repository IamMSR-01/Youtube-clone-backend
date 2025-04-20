import mongoose, { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweet.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createTweet = asyncHandler(async (req, res) => {
  //TODO: create tweet
  const { content } = req.body;
  const userId = req.user._id;

  if (!content || content.trim() === "") {
    throw new ApiError(400, "Content is required");
  }

  const tweet = await Tweet.create({
    content,
    user: userId,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, { tweet }, "Tweet created successfully"));
});

const getUserTweets = asyncHandler(async (req, res) => {
  // TODO: get user tweets
  const { userId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  if (!isValidObjectId(userId)) {
    throw new ApiError(400, "Invalid user ID");
  }
  const pageNumber = parseInt(page);
  const limitNumber = parseInt(limit);

  if (
    isNaN(pageNumber) ||
    isNaN(limitNumber) ||
    pageNumber < 1 ||
    limitNumber < 1
  ) {
    throw new ApiError(400, "Invalid page or limit");
  }

  const tweets = await Tweet.find({ owner: userId })
    .skip((pageNumber - 1) * limitNumber)
    .limit(limitNumber)
    .sort({ createdAt: -1 });

  const totalTweets = await Tweet.countDocuments({ owner: userId });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        tweets,
        totalTweets,
        currentPage: pageNumber,
        totalPages: Math.ceil(totalTweets / limitNumber),
      },
      "Tweets fetched successfully"
    )
  );
});

const updateTweet = asyncHandler(async (req, res) => {
  //TODO: update tweet
  const { tweetId } = req.params;
  const userId = req.user._id;
  const { content } = req.body;

  if (!isValidObjectId(tweetId) || !userId) {
    throw new ApiError(400, "Invalid tweet ID or user ID");
  }

  const tweet = await Tweet.findById(tweetId);
  if (!tweet) {
    throw new ApiError(404, "Tweet not found");
  }

  if (tweet.user.toString() !== userId.toString()) {
    throw new ApiError(403, "Unauthorized to update this tweet");
  }

  tweet.content = content || tweet.content;
  await tweet.save();

  return res
    .status(200)
    .json(new ApiResponse(200, { tweet }, "Tweet updated successfully"));
});

const deleteTweet = asyncHandler(async (req, res) => {
  //TODO: delete tweet
  const { tweetId } = req.params;
  const userId = req.user._id;

  if (!isValidObjectId(tweetId) || !userId) {
    throw new ApiError(400, "Invalid tweet ID or user ID");
  }

  const tweet = await Tweet.findById(tweetId);
  if (!tweet) {
    throw new ApiError(404, "Tweet not found");
  }

  if (tweet.user.toString() !== userId.toString()) {
    throw new ApiError(403, "Unauthorized to delete this tweet");
  }

  await Tweet.findByIdAndDelete(tweetId);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Tweet deleted successfully"));
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };
