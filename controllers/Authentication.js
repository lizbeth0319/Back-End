import bcryptjs from "bcryptjs";
//------- cloudinari
import { v2 as cloudinary } from 'cloudinary';
import { Stream } from 'stream';
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

//------------------------------
import User from "../models/User.js";
import helpersAuthentication from "../helpers/Authentication.js";
import { generarJWT } from "../middleware/generar-jwt.js";

const AuthenticationController = {

    create: async (req, res) => {
        let newUser;
        try {
            console.log('entro');
            const { nombre, password, email, rol } = req.body;
            const archivoImagen = req.file;
            // ----------------validacion imagen------------
            if (rol === 'instructor' && !archivoImagen) {
                return res.status(400).json({
                    msg: 'Para crear un Instructor, la imagen (firma o foto) es obligatoria.'
                });
            }

            let firma_url = null;
            let cloudinary_id = null;
            // ----------------------------------------------------
            if (archivoImagen) {
                // El await fuerza a esperar el resultado de Cloudinary
                const uploadResult = await helpersAuthentication.uploadToCloudinary(archivoImagen.buffer, 'img-sign');

                firma_url = uploadResult.secure_url;
                cloudinary_id = uploadResult.public_id;
            }
            //----------------------------
            const salt = bcryptjs.genSaltSync();
            const password_hash = bcryptjs.hashSync(password, salt);

            //-------estado

            newUser = new User({ 
                nombre,
                email,
                password_hash,
                rol,
                firma_url, // Será la URL de Cloudinary o null
                cloudinary_id, // Será el ID público o null
                
            });
            const savedUser = await newUser.save();

            const userResponse = {
                id: savedUser._id,
                nombre: savedUser.nombre, 
                email: savedUser.email,
                rol: savedUser.rol,
                firma_url: savedUser.firma_url 
            };
            console.log('entro');
            res.status(201).json({
                success: true,
                message: 'Usuario creado exitosamente',
                data: userResponse
            });
        } catch (error) {
            if (error.code === 11000) {
                return res.status(409).json({
                    success: false,
                    message: 'El email ya está registrado'
                });
            }
            console.error('Error al crear usuario:', error);
            res.status(500).json({ msg: 'Error interno del servidor.' });
        }
    },

    Login: async (req, res) => {
        try {
            const { email, password } = req.body;

            const usuario = await helpersAuthentication.verificarCredenciales(email, password);
            console.log(usuario)
            const token = await generarJWT(usuario.email);
            res.json({
                usuario: {
                    id:usuario._id,
                    nombre: usuario.nombre,
                    email: usuario.email,
                    rol: usuario.rol
                },
                token
            });
        } catch (error) {
            console.error('Error en login:', error);
            const statusCode = error.message.includes('Credenciales') ? 400 : 500;
            const mensajeError = statusCode === 400
                ? 'Credenciales inválidas'
                : 'Error en el servidor';

            res.status(statusCode).json({
                success: false,
                msg: mensajeError
            });
        }
    }


}

export default AuthenticationController;