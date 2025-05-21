import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiRespones } from "../utils/ApiResponse.js"

const registerUser = asyncHandler( async ( req , res) => {
    // res.status(200).json({
    //     massage: "ok"
    // })

    //get user details from frontend
    //validation - not null/ empty
    //check if user already exists: username email
    // check for images or avatar
    // upload them to cloudinary , avatar
    //create user object - create entry in db 
    // remove password and refresh token field from response
    // check for user creation
    //return response


    const {fullName , email , username , password} = req.body
    console.log("email: ", email,
        fullName , email , username , password
    )

    if (
        [fullName, email, username, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400 , "All fields are required")
    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (existedUser) {
        throw new ApiError(409, "User with email or username is already exist")
    }
 
    const avatarLocalPath = req.files?.avatar[0]?.path;

    const CoverImageLocalPath = req.files?.coverImage[0]?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400 , "Avatar file is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(CoverImageLocalPath)
     
     if (!avatar) {
        throw new ApiError(400 , "Avatar file is required 1")
    }
    

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    const createdUser = await User.findById(User._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500, "Something went Wrong while registering the user")  
    }

    return res.status(201).json(
        new ApiRespones(200, createdUser, "User Registered successfully")
    )

    // if (fullName  === "") {
    //     throw new ApiError(400 , "fullname is required")
    // }











})

export { registerUser }