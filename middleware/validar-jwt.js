import jwt from "jsonwebtoken";
import "dotenv/config";
import User from '../models/User.js';
const secrety = process.env.JWT_KEY

export const validarJWT = async (req, res, next) => {
    const token = req.header("x-token");
    if (!token) {
        return res.status(401).json({
            msg: "No hay token en la peticion"
        })
    }
    try {
        const { document } = jwt.verify(token, process.env.JWT_SECRET)
        let usuario = await User.findOne({ document });
        if (!usuario) {
            return res.status(401).json({
                msg: "Token no válido "//- usuario no existe DB
            })
        }
        if (usuario.estado == 0) {
            return res.status(401).json({
                msg: "Token no válido " //- usuario con estado: false
            })
        }
        next();
    } catch (error) {
        res.status(401).json({
            msg: "Token no valido-- catch"
        })
    }
}