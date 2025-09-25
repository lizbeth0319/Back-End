import { Router } from "express";
import { validarCampos } from "../middleware/validar-campo.js";
import ControllerAprendiz from "../controllers/Aprendiz.js";
import helperAprendiz from "../helpers/Aprendiz.js";
import { check } from "express-validator"; 
import { validarJWT } from "../middleware/validar-jwt.js";
const router = Router();

router.post('/crearaprendiz',
    //validarJWT,
    //validar rol
    [
        //nombre, ficha, programa, email, password
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('nombre').custom(helperAprendiz.validateNombre),
        check('ficha').custom(helperAprendiz.validarFicha),
        check('programa').custom(helperAprendiz.validarPrograma),
        check('email').custom(helperAprendiz.validarEmail),
        check('password').custom(helperAprendiz.validarPassword),
        validarCampos
    ], 
    ControllerAprendiz.crearaprendiz
);

router.get('/obteneraprendices',
    validarJWT,
    ControllerAprendiz.obtenerAprendices
)
router.get('/obteneraprendiz/:nombre',
    validarJWT,
    [
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('nombre').custom(helperAprendiz.validateNombre), 
    ],
    ControllerAprendiz.obteneraprendiz
)
router.get('/aprendices/search',
    validarJWT,
    [
        check('nombre').optional().isString().withMessage('El nombre debe ser una cadena de texto'),
        check('ficha').optional().isString().withMessage('La ficha debe ser una cadena de texto'),
        check('programa').optional().isString().withMessage('El programa debe ser una cadena de texto'),
        validarCampos
    ],
    ControllerAprendiz.obtenerAprendicesSearch
)
router.put('/actualizaraprendiz/:id',
    validarJWT,
    [
        check('id')
        .isMongoId().withMessage('El ID no es válido'),
        check('nombre')
        .optional()
        .custom(helperAprendiz.validateNombre),
        check('ficha')
        .optional()
        .custom(helperAprendiz.validarFicha),
        check('programa')
        .optional()
        .custom(helperAprendiz.validarPrograma),
        check('email')
        .optional()
        .custom(helperAprendiz.validarEmail),
        check('password')
        .optional()
        .custom(helperAprendiz.validarPassword),
        validarCampos
    ],
    ControllerAprendiz.actualizarAprendiz
)
router.delete('/eliminaraprendiz/:id',
     //validarJWT
    [
        check('id')
        .isMongoId().withMessage('El ID no es válido'),
        validarCampos
    ],
    ControllerAprendiz.eliminarAprendiz 
)
export default router;