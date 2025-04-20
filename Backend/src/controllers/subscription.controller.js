import mongoose, { isValidObjectId } from "mongoose";
import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  const subscriberId = req.user._id;

  if (!isValidObjectId(channelId)) {
    throw new ApiError(400, "Invalid channel ID");
  }

  if (subscriberId.toString() === channelId.toString()) {
    throw new ApiError(400, "You can't subscribe to your channel");
  }

  const existingSubscription = await Subscription.findOne({
    channel: channelId,
    subscriber: subscriberId,
  });

  if (existingSubscription) {
    await Subscription.findByIdAndDelete(existingSubscription._id);
    return res
      .status(200)
      .json(new ApiResponse(200, null, "Subscription removed"));
  }

  await Subscription.create({
    channel: channelId,
    subscriber: subscriberId,
  });

  return res.status(200).json(new ApiResponse(200, null, "Subscription added"));
});

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  if (!isValidObjectId(channelId)) {
    throw new ApiError(400, "Invalid channel ID");
  }

  const subscribers = await Subscription.aggregate([
    {
      $match: {
        channel: new mongoose.Types.ObjectId(channelId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "subscriber",
        foreignField: "_id",
        as: "subscriberDetails",
      },
    },
    {
      $unwind: "$subscriberDetails",
    },
    {
      $project: {
        _id: "$subscriberDetails._id",
        username: "$subscriberDetails.username",
        email: "$subscriberDetails.email",
        subscribedAt: "$createdAt",
      },
    },
  ]);

  if (!subscribers.length) {
    throw new ApiError(404, "No subscribers found for this channel");
  }

  return res.status(200).json(new ApiResponse(200, subscribers, null));
});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;

  if (!isValidObjectId(subscriberId)) {
    throw new ApiError(400, "Invalid subscriber ID");
  }

  const channel = await Subscription.aggregate([
    {
      $match: {
        subscriber: new mongoose.Types.ObjectId(subscriberId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "channel",
        foreignField: "_id",
        as: "channelDetails",
      },
    },
    {
      $unwind: "$channelDetails",
    },
    {
      $project: {
        _id: "$channelDetails._id",
        name: "$channelDetails.name",
        email: "$channelDetails.email",
        createdAt: "$createdAt",
      },
    },
    {
      $sort: { createdAt: -1 },
    },
  ]);

  if (!channel.length) {
    throw new ApiError(404, "No channels found for this subscriber");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, channel, "Subscribed channels fetched successfully")
    );
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
