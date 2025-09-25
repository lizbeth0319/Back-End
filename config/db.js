import mongoose from 'mongoose';
import "dotenv/config";


const connectDB = async () => {
    try {
        await mongoose.connect( process.env.DB_NL);
        console.log('BD Connected (via db.js)!'); 
    } catch (err) {
        console.error('DB Connection Error:', err);
    }
};
export default connectDB;