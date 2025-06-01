import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const userId = req.user?._id;

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  // Check if user already liked this video
  const existingLike = await Like.findOne({
    video: videoId,
    likedBy: userId
  });

  if (existingLike) {
    // Unlike (delete the like document)
    await existingLike.deleteOne();
    return res.status(200)
    .json(new ApiResponse(200, existingLike, "Video unliked successfully"));

  } else {
    // Like the video (create a new document)
    const newLike = await Like.create({
      video: videoId,
      likedBy: userId
    });

    return res.status(201).json({
      message: "Video liked successfully",
      like: newLike
    });
  }
});


const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params

  const userId = req.user?._id;

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  // Check if user already liked this video
  const existingcCommentLike = await Like.findOne({
    _id: commentId,
    likedBy: userId
  });

  if (existingcCommentLike) {
    // Unlike (delete the like document)
    await existingcCommentLike.deleteOne();
    return res.status(200).json({
      message: "comment unliked successfully"
    });
  } else {
    // Like the video (create a new document)
    const newLike = await Like.create({
      _id: commentId,
      likedBy: userId
    });

    return res.status(201).json({
      message: "comment liked successfully",
      like: newLike
    });
  }

    //TODO: toggle like on comment

})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
  const userId = req.user?._id;

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  // Check if user already liked this video
  const existingTweetLike = await Like.findOne({
    _id: tweetId,
    likedBy: userId
  });

  if (existingTweetLike) {
    // Unlike (delete the like document)
    await existingTweetLike.deleteOne();
    return res.status(200).json({
      message: "tweet unliked successfully"
    });
  } else {
    // Like the video (create a new document)
    const newLike = await Like.create({
      _id: tweetId,
      likedBy: userId
    });

    return res.status(201).json({
      message: "tweet liked successfully",
      like: newLike
    });
  }

    //TODO: toggle like on tweet
}
)

const getLikedVideos = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
    const { videoId } = req.params;


  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  const likedVideos = await Like.find({
    likedBy: userId,
    video: { $exists: true },

    
    isLike: true, // ✅ include only if you're using the `isLike` field
  }).populate("video");

  res.status(200).json({
    message: "Liked videos fetched successfully",
    likes: 
     {
    likedVideos,
    user: userId,
    
   },
  });
});


export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}