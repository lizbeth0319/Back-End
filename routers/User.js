import { Router } from "express";
import  UserController from "../controllers/User.js"
import { validarCampos } from "../middleware/validar-campo.js";
import helpersUse from "../helpers/db-validators.js";
import validarRol from "../middleware/validar-rol.js";
const router = Router();

//agregr
router.post();

export default router;