// Archivo: config/cloudinary.js

import { v2 as cloudinary } from 'cloudinary';
import "dotenv/config";
const configureCloudinary = () => {

    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_NAME,
        api_key: process.env.CLOUDINARY_KEY,
        api_secret: process.env.CLOUDINARY_SECRET,
        secure: true
    });
    console.log("Cloudinary configurado.");
}; 

export { cloudinary, configureCloudinary };