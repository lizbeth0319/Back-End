import jwt from "jsonwebtoken";
import "dotenv/config";
import User from '../models/User.js';


export const validarJWT = async (req, res, next) => {

    const token = req.header("x-token");
    if (!token) {
        return res.status(401).json({
            msg: "No hay token en la peticion."
        });
    }

    try {
        console.log('entro a funcion validarJWT')
        const payload = jwt.verify(token, process.env.JWT_KEY); 
        const { email } = payload;
        let usuario = await User.find({ email });
        console.log('email',email)
        if (!usuario) {
            return res.status(401).json({
                msg: "Token no válido - usuario no existe en DB."
            });
        }
        console.log(usuario)
        if (usuario.estado === 0 || usuario.estado === false) { 
            return res.status(401).json({
                msg: "Token no válido - el usuario está inactivo." 
            });
        }
        
        req.usuario = usuario;

        next();
        
    } catch (error) {
        console.error('Error en JWT:', error.message); 
        res.status(401).json({
            msg: "Token no válido o ha expirado."
        });
    }
};
/* import jwt from "jsonwebtoken";
import "dotenv/config";
import User from "../models/User";
const secrety = process.env.JWT_KEY

export const validarJWT = async (req, res, next) => {
    const token = req.header("x-token");
    if (!token) {
        return res.status(401).json({
            msg: "No hay token en la peticion."
        });
    }
    try {
        console.log('entra a la funcion validarJWT')
        const payload = jwt.verify(token,secrety); 
        const { email } = payload;
        console.log('correo',email);
        let usuario = await User.findOne({ email });
        console.log(usuario);
        if (!usuario) {
            return res.status(401).json({
                msg: "Token no válido - usuario no existe en DB."
            });
        }
        console.log('entra a la funcion validarJWT -validacion 2')
        if (usuario.estado === 0 || usuario.estado === false) { // Adaptado a tu lógica (0) o a booleano
            return res.status(401).json({
                msg: "Token no válido - el usuario está inactivo." 
            });
        } 
        req.usuario = usuario;
        next();
    } catch (error) {
        res.status(401).json({
            msg: "Token no valido-- catch"
        })
    }
} */