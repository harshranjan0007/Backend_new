import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

// const getAllVideos = asyncHandler(async (req, res) => {
//     const { page = parseInt || 1, limit = parseInt || 10, query = "", sortBy = "createdAt", sortType = "desc" || "asc" ? 1 : -1, userId = req.user._id } = req.query;

//   const matchStage = {
//     $match: {
//       owner: new mongoose.Types.ObjectId(userId),
//       title: { $regex: query || "", $options: "i" }
//     }
//   };

//   const sortStage = {
//     $sort: {
//       [sortBy]: sortType
//     }
//   };

//   const aggregatePipeline = [matchStage, sortStage];

//   const options = {
//     page,
//     limit
//   };

//   const result = await Video.aggregatePaginate(
//     Video.aggregate(aggregatePipeline),
//     options
//   );

//   return res.status(200).json(
//     new ApiResponse(200, {
//       videos: result.docs,
//       total: result.totalDocs,
//       page: result.page,
//       totalPages: result.totalPages,
//       hasNextPage: result.hasNextPage,
//       hasPrevPage: result.hasPrevPage
//     }, "Videos fetched successfully")
//   );
// });

//TODO: get all videos based on query, sort, pagination

const getAllVideos = asyncHandler(async (req, res) => {
  let {
    page = "1",
    limit = "10",
    query = "",
    sortBy = "createdAt",
    sortType = "desc",
  } = req.query;

  page = parseInt(page);
  limit = parseInt(limit);

  const sortOrder = sortType === "asc" ? 1 : -1;

  const userId = req.user._id;

  const matchStage = {
    $match: {
      owner: new mongoose.Types.ObjectId(userId),
      title: { $regex: query, $options: "i" },
    },
  };

  const sortStage = {
    $sort: {
      [sortBy]: sortOrder,
    },
  };

  const aggregatePipeline = [matchStage, sortStage];

  const options = { page, limit };

  const result = await Video.aggregatePaginate(
    Video.aggregate(aggregatePipeline),
    options
  );

  return res.status(200).json(
    new ApiResponse(
      200,  
      {
        videos: result.docs,
        total: result.totalDocs,
        page: result.page,
        totalPages: result.totalPages,
        hasNextPage: result.hasNextPage,
        hasPrevPage: result.hasPrevPage,
      },
      "Videos fetched successfully"
    )
  );
});

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description, duration } = req.body;
  const videoLocalPath = req.files?.videoFile?.[0]?.path;
  const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;

  if (!videoLocalPath) {
    throw new ApiError(400, "Video file is required");
  }
  if (!thumbnailLocalPath) {
    throw new ApiError(400, "thumnail is required");
  }

  const videoFile = await uploadOnCloudinary(videoLocalPath);
  const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

  if (!videoFile) {
    throw new ApiError(400, "Video file upload failed");
  }

  if (!thumbnail) {
    throw new ApiError(400, "Thumbnail upload failed");
  }

  const video = await Video.create({
    owner: req.user?._id,
    videoFile: videoFile.url,
    thumbnail: thumbnail.url,
    title,
    description,
    duration,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, video, "video publish successfully"));

  // TODO: get video, upload to cloudinary, create video
});

const getVideoById = asyncHandler(async (req, res) => {

  try {
    const { videoId } = req.params; // Assuming tweetId is passed as a URL parameter

    if (!videoId) {
      throw new ApiError(400, "Video ID is required to update the tweet");
    }

    const video = await Video.findById({
      owner: req.user?._id,
      _id: videoId,
    });
    if (!video) {
      throw new ApiError(404, "Video not found or you're not authorized");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, video, "get video by Id successfully"));
  } catch (error) {
    console.error("Error finding video", error);
    throw new ApiError(500, "An error occurred while finding video");
  }
  //TODO: get video by id
});

const updateVideo = asyncHandler(async (req, res) => {
try {
   const { title, description, duration } = req.body;

  const thumbnailLocalPath = req.file?.path;

  if (!thumbnailLocalPath) {
    throw new ApiError(400, "thumnail is required");
  }

  const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

 

  if (!thumbnail) {
    throw new ApiError(400, "Thumbnail upload failed");
  }
    const { videoId } = req.params;

    if (!videoId) {
      throw new ApiError(400, "video ID is required to update the tweet");
    }
   

    const video = await Video.findOneAndUpdate(
          { 
            owner: req.user?._id,
            _id: videoId,
          }, // Ensure user owns the tweet
          {
             $set: { 
                  thumbnail: thumbnail.url,
                  title,
    description,
    duration,


            }
            },
          { new: true }
        );

        return res
    .status(200)
    .json(new ApiResponse(200, video, "Update video upload successfully"));
  
} catch (error) {
  console.error("Error updating video", error);
    throw new ApiError(500, "An error occurred while updating video");
  
}  
  //TODO: update video details like title, description, thumbnail
});

const deleteVideo = asyncHandler(async (req, res) => {
try {
    const { videoId } = req.params;

    const video = await Video.findByIdAndDelete({
      
        _id: videoId, 
        owner: req.user?._id 
      
    })

    
    if (!video) {
      throw new ApiError(404, "Video not found or you're not authorized");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Video deleted successfully"));
  
} catch (error) {
  console.error("Error deleting video", error.massage);
    throw new ApiError(500, "An error occurred while deleting Video");
  
}  //TODO: delete video
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

    const video = await Video.findById(videoId);

    if (!video) {
      throw new ApiError(404, "Video not found or you're not authorized");
    }

      video.isPublished = !video.isPublished;

        await video.save();

        res.status(200)
              .json(new ApiResponse(200, null,{
    message: `Video ${video.isPublished ? 'published' : 'unpublished'} successfully`,
 video: {
    video,
    _id: video._id,
    title: video.title,
    isPublished: video.isPublished,
    updatedAt: video.updatedAt,}  }));




});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
