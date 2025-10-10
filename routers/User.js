import { Router } from "express";
import { validarCampos } from "../middleware/validar-campo.js";
import UserController from "../controllers/User.js"
import helpersUser from "../helpers/User.js";
import { check,query ,param,validationResult } from "express-validator"; 
import { validarJWT } from "../middleware/validar-jwt.js";


const router = Router();

router.get('/listarporelrol/:rol',
    validarJWT, 
    [
        param('rol', 'El rol es obligatorio y debe ser una cadena de texto.')
            .isString()
            .trim()
            .escape(),
            
        param('rol').custom(helpersUser.validarRolPermitido),
        validarCampos
    ],
    UserController.listarUsuariosPorRol 
);

//router.get('/porteria/permisos/aprobados')
export default router;