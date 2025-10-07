import { Router } from "express";
import { validarCampos } from "../middleware/validar-campo.js";
import UserController from "../controllers/User.js"

import { check,query ,param,validationResult } from "express-validator"; 
import { validarJWT } from "../middleware/validar-jwt.js";

const router = Router();

router.put('/actualizarestadocorreo/:nombre',
    validarJWT,
    UserController.actualizarestadocorreo
);

//router.get('/porteria/permisos/aprobados')
export default router;