import mongoose, { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweet.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createTweet = asyncHandler(async (req, res) => {

  const { content } = req.body;

  if (!content) {
    throw new ApiError(400, "Content is required");
  }
  // let user;

  // if (mongoose.isValidObjectId(owner)) {
  //   user = await User.findById(owner).select("-password -refreshToken");
  // } else {
  //   // Try finding by username
  //   user = await User.findOne({ username: owner }).select("-password -refreshToken");
  // }

  // if (!user) {
  //   throw new ApiError(404, "User not found");
  // }

  // const user = await User.findOne({ username: owner }).select("-password -refreshToken");
  // if (!user) {
  //    throw new ApiError(404, "User not found");
  // }
  try {
    const tweet = await Tweet.create({
      content,
      owner: req.user._id,
    });
    return res
      .status(201)
      .json(new ApiResponse(200, tweet, "Tweet created successfully"));
  } catch (error) {
    console.error("Error creating tweet", error);
    throw new ApiError(500, "An error occurred while creating tweet");
  }
});

const getUserTweets = asyncHandler(async (req, res) => {
  const user = req.user._id;

  const tweets = await Tweet.find({ owner: user }).sort({ createdAt: -1 });
  
  return res
    .status(200)
    .json(new ApiResponse(200, tweets, "Tweets fetched successfully"));
});

const updateTweet = asyncHandler(async (req, res) => {
  try {
    const user = req.user._id;
    const { tweetId } = req.params; // Assuming tweetId is passed as a URL parameter
    const { content } = req.body;

    if (!content) {
      throw new ApiError(400, "Content is required to update the tweet");
    }

    const tweet = await Tweet.findOneAndUpdate(
      { 
        _id: tweetId, 
        owner: user 
      }, // Ensure user owns the tweet
      {
         $set: { 
          content 
        }
        },
      { new: true }
    );

    if (!tweet) {
      throw new ApiError(404, "Tweet not found or you're not authorized");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, tweet, "Tweet updated successfully"));
  } catch (error) {
    console.error("Error updating tweet", error);
    throw new ApiError(500, "An error occurred while updating tweet");
  }

  //TODO: update tweet
});

const deleteTweet = asyncHandler(async (req, res) => {
  try {
    const user = req.user._id;
    const { tweetId } = req.params; // Assuming tweetId is passed as a URL parameter

    

    const tweet = await Tweet.findOneAndDelete(
      { 
        _id: tweetId, 
        owner: user 
      }, 
     
    );

    if (!tweet) {
      throw new ApiError(404, "Tweet not found or you're not authorized");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Tweet deleted successfully"));
  } catch (error) {
    console.error("Error deleting tweet", error.massage);
    throw new ApiError(500, "An error occurred while deleting tweet");
  }
  //TODO: delete tweet
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };
