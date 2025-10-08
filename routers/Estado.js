import { Router } from "express";
import { validarCampos } from '../middleware/validar-campo.js';
import { check, query ,validationResult} from "express-validator";
import { validarJWT } from "../middleware/validar-jwt.js";
const router = Router();
//correo
/* router.put('/:id/aprobar', [
    validarJWT,
    validarRol(['instructor']) 
], PermisoController.aprobarPermiso);

router.put('/:id/denegar', [
    validarJWT,
    validarRol(['instructor']) 
], PermisoController.denegarPermiso); */

router.put('/:id/aprobar')