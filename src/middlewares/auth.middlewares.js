import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/users.model.js";


export const verifyJWT = asyncHandler(async (req, _, next) => {
  try {
    // Logging for debugging
    // console.log("Cookies:", req.cookies);
    // console.log("Authorization Header:", req.header("Authorization"));

    let token = req.cookies?.accessToken;

    if (!token && req.header("Authorization")) {
      const authHeader = req.header("Authorization");
      if (authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
      }
    }

    console.log("TOKEN RECEIVED:", token);

    if (!token) {
      throw new ApiError(401, "Unauthorized Request - Token missing");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken?._id)
      .select("-password -refreshToken");

    if (!user) {
      throw new ApiError(401, "Invalid Access Token - User not found");
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("JWT VERIFY ERROR:", error.message);
    throw new ApiError(401, error?.message || "Invalid Access Token");
  }
});
