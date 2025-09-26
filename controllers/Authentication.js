import bcryptjs from "bcryptjs";

import User from "../models/user.js";
import helpersAuthentication from "../helpers/authentication.js";
import { generarJWT } from "../middleware/generar-jwt.js";

const AuthenticationController = {

    create: async (req, res) => {
        try {
            console.log('entro');

            const { nombre, password, email, rol } = req.body; 

            const salt = bcryptjs.genSaltSync();
            const hash = bcryptjs.hashSync(password, salt);

            const newUser = new User({
                nombre,
                email,
                password_hash: hash, 
                rol
            });

            const savedUser = await newUser.save();

            const userResponse = {
                document: savedUser.document,
                name: savedUser.name,
                email: savedUser.email,
                createdAt: savedUser.createdAt
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
        }
    },

    Login: async (req, res) => {
        try {
            const { email, password } = req.body;

            const usuario = await helpersAuthentication.verificarCredenciales(email, password);

            const token = await generarJWT(usuario.document);
            res.json({
                usuario: {
                    nombre: usuario.name,
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