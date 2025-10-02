import mongoose from 'mongoose';
import "dotenv/config";
const DB_URL = process.env.MONGO_NL;

const connectDB = async () => {
    try {
        await mongoose.connect(DB_URL);
        console.log('BD Connected (via db.js)!'); // Se modificó el mensaje de registro para mayor claridad
    } catch (err) {
        console.error('DB Connection Error:', err); // Registra el error
// Opcionalmente, vuelve a generar el error o sale del proceso si la conexión a la BD es crítica
        process.exit(1);
    }
};
export default connectDB;
/* import express from 'express';
import mongoose from 'mongoose';
import "dotenv/config";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_NL);
        console.log('✅ MongoDB connected successfully');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error.message);
        process.exit(1);
    }
};

export default connectDB;
 */