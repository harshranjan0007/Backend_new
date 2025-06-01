import mongoose from "mongoose"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { User } from "../models/user.model.js"

const getVideoComments = asyncHandler(async (req, res) => {
    // const user = req.user._id;

    //   const comment = await Comment.find({ owner: user }).sort({ createdAt: -1 });

    //   return res
    // .status(200)
    // .json(new ApiResponse(200, Comment, "Tweets fetched successfully"));
    

    // try {
        
    //   } catch (error) {
    //     console.error("Error getting comment", error);
    //     throw new ApiError(500, "An error occurred while getting comment");
    //   }
    
    const user = req.user._id;
        const { videoId } = req.params; // Assuming tweetId is passed as a URL parameter
        // const { videoComments } = req.body;
        const {page = 1, limit = 10} = req.query
         

    
        // if (!videoComments) {
        //   throw new ApiError(400, "comment not found for video");
        // }
         const options = { page, limit };

        const comment = await Comment.findById(
          { 
            _id: videoId, 
            owner: user ,
            options,
          }, // Ensure user owns the tweet
         
          
        );
    
        if (!comment) {
          throw new ApiError(404, "commnet not found or you're not authorized");
        }
    
        return res
          .status(200)
          .json(new ApiResponse(200, comment, "getting comment successfully"));


    //TODO: get all comments for a video
    // const {videoId} = req.params
    // const {page = 1, limit = 10} = req.query

})

const addComment = asyncHandler(async (req, res) => {
    

  try {
    const { videoId } = req.params; // Assuming tweetId is passed as a URL parameter
    const { content } = req.body;

  if (!content) {
    throw new ApiError(400, "Content is required");
  }
      const comment = await Comment.create({
        content,
      owner: req.user?._id, // User who made the comment
      video: videoId, 


      });
      return res
        .status(201)
        .json(new ApiResponse(200, comment, "comment created successfully"));
    } catch (error) {
      console.error("Error creating comment", error);
      throw new ApiError(500, "An error occurred while creating comment");
    }


    // TODO: add a comment to a video
})

const updateComment = asyncHandler(async (req, res) => {
    try {
        const { commentId } = req.params; // Assuming tweetId is passed as a URL parameter
        const { content } = req.body;
    
        if (!content) {
          throw new ApiError(400, "Content is required to update the tweet");
        }
    
        const updateComment = await Comment.findOneAndUpdate(
          { 
            _id:commentId,
            owner: req.user._id
          }, // Ensure user owns the tweet
          {
             $set: { 
              content 
            }
            },
          { new: true }
        );
    
        if (!updateComment) {
          throw new ApiError(404, "comment not found or you're not authorized");
        }
    
        return res
          .status(200)
          .json(new ApiResponse(200, updateComment, "comment updated successfully"));
      } catch (error) {
        console.error("Error updating commnet", error);
        throw new ApiError(500, "An error occurred while updating comment");
      }
    



    // TODO: update a comment
})

const deleteComment = asyncHandler(async (req, res) => {
  try {
      const { commentId } = req.params;
  
      const comment = await Comment.findByIdAndDelete({
        
          _id: commentId, 
          owner: req.user?._id 
        
      })
  
      
      if (!comment) {
        throw new ApiError(404, "comment not found or you're not authorized");
      }
  
      return res
        .status(200)
        .json(new ApiResponse(200, null, "comment deleted successfully"));
    
  } catch (error) {
    console.error("Error deleting comment", error.massage);
      throw new ApiError(500, "An error occurred while deleting comment");
  }
    // TODO: delete a comment
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }