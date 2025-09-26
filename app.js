import express from "express";
import connectDB from "./config/db.js";
import "dotenv/config";
import cors from 'cors';
import Authenticationrouter from './routers/authentication.js'
//import userrouter from './routers/User.js';
import Aprendizrouter from './routers/aprendiz.js'
import permisorouter from './routers/permiso.js'
const app = express();
const PORT = process.env.PORT; 

app.use(express.json());
app.use(cors());
app.use(express.static(`public`));

// Rutas
app.use('/api',Authenticationrouter);
app.use('/api/aprendiz',Aprendizrouter);
app.use('/api/permiso',permisorouter);


app.listen(PORT, () => {
    console.log(` Servidor escuchando en http: ${PORT}`);
    connectDB().then(() => {
    }).catch(error => {
        console.error("Failed to start server due to DB connection error:", error);
    });
});
