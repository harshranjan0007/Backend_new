import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  const userId = req.user?._id;

  if (!channelId) {
    throw new ApiError(400, "channelId is required");
  }
  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  // Check if already subscribed
  const existing = await Subscription.findOne({ subscriber: userId, channel: channelId });

  if (existing) {
    await existing.deleteOne();
    return res
      .status(200)
      .json(new ApiResponse(200, null, "Unsubscribed successfully"));
  }

  // Create a new subscription
  const subscription = await Subscription.create({
    subscriber: userId,
    channel: channelId
  });

  return res
    .status(201)
    .json(new ApiResponse(201, subscription, "Subscribed successfully"));
});



// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  try {
        // const { channelId } = req.params;
          const userId = req.user?._id;


      if (!userId) {
        throw new ApiError(400, "channel id is required");
      }
  
      const userChannelSubscribers = await Subscription.find({
        // channel: channelId,
          subscriber: userId

      });
      return res
        .status(201)
        .json(
          new ApiResponse(200, userChannelSubscribers, " Gat User Channel Subscribers by id successfully")
        );
    } catch (error) {
      console.error("Error while getting User Channel Subscribers by id", error);
      throw new ApiError(500, "An error occurred while getting  User Channel Subscribers by id");
    }
});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;
   try {
        const { channelId } = req.params;


      if (!channelId) {
        throw new ApiError(400, "channel id is required");
      }
  
      const userChannelSubscribers = await Subscription.find({
        channel: channelId,

      });
      return res
        .status(201)
        .json(
          new ApiResponse(200, userChannelSubscribers, "get Subscribed Channels by id successfully")
        );
    } catch (error) {
      console.error("Error while getting Subscribed Channels by id", error);
      throw new ApiError(500, "An error occurred while getting  Subscribed Channels by id");
    }
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
