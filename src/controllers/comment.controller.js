import mongoose from "mongoose"
import {Comment} from "../models/comment.model.js"
import {Video} from "../models/videos.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query
})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    const {videoId} = req.params
    const {content} = req.body
    if(!content){
        throw new ApiError(400 , "content is required")
    }
    const video = await Video.findById(videoId);
    if(!video){
        throw new ApiError(404 , "video does not exist")
    }

    const comment = await Comment.create({
        content , 
        video: videoId,
        owner : req.user?._id 
    })

    if(!comment){
        throw new ApiError(500 , "failed to add comment , please try again")
    }

    return res.status(201).json(new ApiResponse(200 , comment , "comment added successfully"))
})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    const {commentId} = req.params
    const {content} = req.body

    const comment = await Comment.findById(commentId)

    if(!comment){
        throw new ApiError(404 , "comments not exist for updation")
    }

    if(!content){
        throw new ApiError(400 , "content is required")
    }

    if(comment.owner.to_string() !== req.user?._id.to_string()){
        throw new ApiError(400 , "unauthorized request")
    }

    const updatedComment = await Comment.findByIdAndUpdate(
        commentId , 
        { content : content} ,
        { new : true }
    )

    if(!updatedComment){
        throw new ApiError(500 , "Failed to update comment")
    }

    return res.status(201).json(new ApiResponse(200 , updatedComment , "comment updated successfully"))
    
})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
    const {commentId} = req.params

    const comment = await Comment.findById(commentId)
    if(!comment){
        throw new ApiError(404 , "comments not exist for updation")
    }

    if(comment.owner.to_string() !== req.user?._id.to_string()){
        throw new ApiError(400 , "unauthorized request")
    }

    await Comment.findByIdAndDelete(commentId)

    return res.status(201).json(new ApiResponse(200 , _ , "comment deleted successfully"))
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }