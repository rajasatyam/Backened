import mongoose, { Schema } from "mongoose";

const likeSchema = new Schema(
    {
        video : {
            type: Schema.Types.ObjectId,
            ref: "Video"
        },
        likedBy : {
            type: Schema.Types.ObjectId,
            ref : "User"
        },
        comment : {
            type : Schema.Types.ObjectId,
            ref : "Comments"
        },
        tweet : {
            type : Schema.Types.ObjectId,
            ref : "Tweet"
        }
    },
    { timestamps : true}
)

export const Likes = mongoose.model("Likes" , likeSchema)