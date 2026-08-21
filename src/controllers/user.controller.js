import asyncHandler from '../utils/asyncHandler.js'
import ApiError from '../utils/ApiError.js'
import ApiResponse from '../utils/ApiResponse.js'
import User from '../models/user.model.js'
import uploadOnCloudinary from '../utils/uploadOnCloudinary.js'

const register = asyncHandler(async (req, res) => {
    const { fullName, email, password, username } = req.body;

    if ([fullName, email, password, username].some((field) => !field || field.trim() === "")) {
        throw new ApiError(400, "All fields are required")
    };

    const existedUserByEmailOrUsername = await User.findOne({
        $or: [{ email }, { username }]
    })

    if (existedUserByEmailOrUsername) {
        if (existedUserByEmailOrUsername.email === email) {
            throw new ApiError(409, "User already exists with this email")
        }

        if (existedUserByEmailOrUsername.username) {
            throw new ApiError(409, "Username is already taken")
        }
    }

    const coverImageLocalPath = req.files?.coverImage[0];
    const avatarLocalPath = req.files?.avatar[0]
    let coverImage;
    let avatar;




    if (coverImageLocalPath.path) {
        if (coverImageLocalPath.mimetype !== 'image/jpeg') {
            throw new ApiError(400, "only image is required as coverImage")
        }

        coverImage = await uploadOnCloudinary(coverImageLocalPath.path)
        if (!coverImage) {
            throw new ApiError(500, "Something went wrong while uploading your image")
        }
    }

    if (avatarLocalPath.path) {
        if (avatarLocalPath.mimetype !== 'image/jpeg') {
            throw new ApiError(400, "only image is required as avatar")
        }
        avatar = await uploadOnCloudinary(avatarLocalPath.path)
        if (!avatar) {
            throw new ApiError(500, "Something went wrong while uploading your image")
        }
    }

    const user = await User.create({
        username,
        fullName,
        email,
        password,
        avatar: {
            url: avatar.secure_url || "",
            public_id: avatar.public_id || ""
        },
        coverImage: {
            url: coverImage.secure_url || "",
            public_id: coverImage.public_id || ""
        }

    })

    return res.status(201).json(
        new ApiResponse(201, user, "User registered successfully")
    )


})

export {
    register
}