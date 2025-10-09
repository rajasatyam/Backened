import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/users.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const registerUser = asyncHandler (async (req , res) => {
    const {fullname , email , username , password } = req.body;
    console.log("FILES:", req.files);

    console.log(email , password); 
    if(
        [fullname,email,username,password].some((field) =>
        field?.trim() === "") // check if the field is empty or not 
    ){
        throw new ApiError(400 , " All fields are required")
    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if(existedUser){; 
        throw new ApiError(409,"USer with email or username already");
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if(!avatarLocalPath){
        throw new ApiError(400 , "Avatar file is required");
    }
    console.log("Avatar local path:", avatarLocalPath);
    console.log("Cover image path:", coverImageLocalPath);


    const avatar = await uploadOnCloudinary(avatarLocalPath);
    console.log(avatar,'see avatar')
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if(!avatar){
        throw new ApiError(500, "Failed to upload avatar to Cloudinary");
    }

    const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "" ,
        email,
        password,
        username: username.toLowerCase(),
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    
    if(!createdUser){
        throw new ApiError(500 , "Something went wrong while registering the user")
    };

    return res.status(201).json(
        new ApiResponse(200 , createdUser , "User registered Successfully")
    );

})

export {registerUser};