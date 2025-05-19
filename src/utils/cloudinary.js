import { v2 as cloudinary } from "cloudinary";
import { response } from "express";
import fs from "fs";

// Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
    });



    const uploadONcloudinary = async (localFilesPath) => {
        try {
            if (!localFilesPath) return null
            //upload the file to the cloudinary
            cloudinary.uploader.upload(localFilesPath, {
                resource_type: "auto"
            })
            // files has uploded successfull
            console.log("file is uploaded on cloudinary", response.url);
            return response;

        } catch (error) {
           fs.unlinkSync(localFilesPath) //reomve the locally saved temporary files as the upload operation got failed
           return null;
        }
    }

export { uploadONcloudinary }