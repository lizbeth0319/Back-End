import mongoose from 'mongoose';
import "dotenv/config";


const DB_URL = process.env.MONGO_URL;

const connectDB = async () => {
  try {
    await mongoose.connect(DB_URL);
    console.log('Conectado a MongoDB Atlas');
  } catch (error) {
    console.error('Error al conectar a MongoDB:', error);
    process.exit(1);
  }
};
export default connectDB;