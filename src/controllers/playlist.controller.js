import mongoose, { isValidObjectId } from "mongoose";
import { Playlist } from "../models/playlist.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createPlaylist = asyncHandler(async (req, res) => {
  try {
    const { name, description } = req.body;
    // const { videoId } = req.params; // Assuming tweetId is passed as a URL parameter

    if (!name) {
      throw new ApiError(400, "name is required");
    }
    if (!description) {
      throw new ApiError(400, "description is required");
    }
    const createPlaylist = await Playlist.create({
      name,
      description,
      owner: req.user?._id,
      //   _id: videoId,
    });
    return res
      .status(201)
      .json(
        new ApiResponse(200, createPlaylist, "PlayList created successfully")
      );
  } catch (error) {
    console.error("Error while creating PlayList", error);
    throw new ApiError(500, "An error occurred while creating PlayList");
  }

  //TODO: create playlist
});

const getUserPlaylists = asyncHandler(async (req, res) => {
  try {
    const { userId = req.user?._id } = req.params;

    if (!userId) {
      throw new ApiError(400, "userId is required");
    }

    const userPlaylists = await Playlist.find({
      owner: userId,
    });
    return res
      .status(201)
      .json(
        new ApiResponse(200, userPlaylists, "get user playlist  successfully")
      );
  } catch (error) {
    console.error("Error while getting user PlayList", error);
    throw new ApiError(500, "An error occurred while getting user PlayList");
  }

  //TODO: get user playlists
});

const getPlaylistById = asyncHandler(async (req, res) => {
  try {
    const { playlistId } = req.params;

    if (!playlistId) {
      throw new ApiError(400, "playlist id is required");
    }

    const PlaylistsById = await Playlist.find({
      _id: playlistId,
    });
    return res
      .status(201)
      .json(
        new ApiResponse(200, PlaylistsById, "get playlist by id successfully")
      );
  } catch (error) {
    console.error("Error while getting PlayList by id", error);
    throw new ApiError(500, "An error occurred while getting  PlayList by id");
  }
  //TODO: get playlist by id
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
  try {
    const { playlistId, videoId } = req.params;

    if (!playlistId) {
      throw new ApiError(400, "playlistId is required");
    }
    if (!videoId) {
      throw new ApiError(400, "videoId is required");
    }
    const addVideoToPlaylist = await Playlist.findByIdAndUpdate(
      {
        _id: playlistId,
        owner: req.user?._id, // User who made the comment
        videos: videoId,
      },
      { $addToSet: { videos: videoId } }, // $addToSet avoids duplicates
      { new: true }
    );

    if (!addVideoToPlaylist) {
      throw new ApiError(404, "Playlist not found or you're not authorized");
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          addVideoToPlaylist,
          "Video added to playlist successfully"
        )
      );
  } catch (error) {
    console.error("Error while adding video to playlist:", error);
    throw new ApiError(
      500,
      "An error occurred while adding the video to the playlist"
    );
  }
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  try {
    const { playlistId, videoId } = req.params;

    if (!playlistId) {
      throw new ApiError(400, "playlistId is required");
    }
    if (!videoId) {
      throw new ApiError(400, "videoId is required");
    }
    const deleteVideoFromPlaylist = await Playlist.findByIdAndDelete({
      _id: playlistId,
      owner: req.user?._id, // User who made the comment
      videos: videoId,
    });

    if (!deleteVideoFromPlaylist) {
      throw new ApiError(404, "Playlist not found or you're not authorized");
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          deleteVideoFromPlaylist,
          "Video deleted from playlist successfully"
        )
      );
  } catch (error) {
    console.error("Error while deleting video to playlist:", error);
    throw new ApiError(
      500,
      "An error occurred while deleting the video to the playlist"
    );
  }

  // TODO: remove video from playlist
});

const deletePlaylist = asyncHandler(async (req, res) => {
  try {
    const { playlistId } = req.params;

    if (!playlistId) {
      throw new ApiError(400, "playlistId is required");
    }

    const deletePlaylist = await Playlist.findByIdAndDelete({
      _id: playlistId,
      owner: req.user?._id, // User who made the comment
    });

    if (!deletePlaylist) {
      throw new ApiError(404, "Playlist not found or you're not authorized");
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, deletePlaylist, "playlist deleted successfully")
      );
  } catch (error) {
    console.error("Error while deleting playlist:", error);
    throw new ApiError(500, "An error occurred while deleting playlist");
  }

  // TODO: delete playlist
});

const updatePlaylist = asyncHandler(async (req, res) => {
  try {
    const { playlistId } = req.params;
    const { name, description } = req.body;

    if (!playlistId) {
      throw new ApiError(400, "play list is required to update the tweet");
    }
    if (!name) {
      throw new ApiError(400, "name is required to update the tweet");
    }
    if (!description) {
      throw new ApiError(400, "description is required to update the tweet");
    }

    const updatePlayList = await Playlist.findOneAndUpdate(
      {
        _id: playlistId,
        owner: req.user._id,
      }, // Ensure user owns the tweet
      {
        $set: {
          name,
          description,
        },
      },
      { new: true }
    );

    if (!updatePlayList) {
      throw new ApiError(404, "playList not found or you're not authorized");
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, updatePlayList, "play list updated successfully")
      );
  } catch (error) {
    console.error("Error updating play list", error);
    throw new ApiError(500, "An error occurred while updating play list");
  }

  //TODO: update playlist
});

export {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,
};
