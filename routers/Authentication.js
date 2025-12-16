import { Router } from "express";
import  AuthenticationController from "../controllers/Authentication.js"
import { validarCampos } from '../middleware/validar-campo.js';
import helpersAuthentication from "../helpers/Authentication.js";
import { check } from "express-validator";
const router = Router();
//---- imagen 
import multer from 'multer';
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
//
router.post('/auth/register',
    upload.single('firma'),
    [
        check('rol').custom(helpersAuthentication.validarRol),
        check('nombre').custom(helpersAuthentication.validarNombre),
        check('password').custom(helpersAuthentication.validarPassword),
        check('email').custom(helpersAuthentication.validarEmail),
        validarCampos
    ], 
    AuthenticationController.create);

router.post('/auth/login', // email, password
    [
        check('email', 'El email es requerido').not().isEmpty(),
        check('email').custom(helpersAuthentication.validarEmailLogin),
        check('password', 'La contraseña es requerida').not().isEmpty(),
        check('password').custom(helpersAuthentication.validarPassword),
        validarCampos
    ],
    AuthenticationController.Login)
 

export default router;