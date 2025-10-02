import express from "express";
import connectDBatlas from './config/db-atlas.js'
import connectDBcompass from './config/db-compass.js'
import "dotenv/config";
import cors from 'cors';
import { configureCloudinary } from "./config/cloudinary.js"; 

import Authenticationrouter from './routers/Authentication.js'
//import userrouter from './routers/User.js';
import Aprendizrouter from './routers/Aprendiz.js'
import permisorouter from './routers/Permiso.js'
const app = express();
const PORT = process.env.PORT; 

app.use(express.json());
app.use(cors());
app.use(express.static(`public`));

// Rutas
app.use('/api',Authenticationrouter);
app.use('/api/aprendiz',Aprendizrouter);
app.use('/api/permiso',permisorouter);

console.log("DEBUG CLOUD_NAME:", process.env.CLOUDINARY_NAME);

app.listen(PORT, () => {
    console.log(` Servidor escuchando en http: ${PORT}`);
    connectDBatlas().then(() => {
    //connectDBcompass().then(() => {
    }).catch(error => {
        console.error("Failed to start server due to DB connection error:", error);
    });
});
configureCloudinary();