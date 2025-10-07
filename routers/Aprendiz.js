import { Router } from "express";
import { validarCampos } from "../middleware/validar-campo.js";
import ControllerAprendiz from "../controllers/Aprendiz.js";
import helperAprendiz from "../helpers/Aprendiz.js";
import { check,query ,validationResult } from "express-validator"; 
import { validarJWT } from "../middleware/validar-jwt.js";
//import validarRol from "../middleware/validar-rol.js";
const router = Router();

router.post('/crearaprendiz',
    validarJWT,
    [
        //nombre, ficha, programa, email, password
        check('nombre').custom(helperAprendiz.validateNombre),
        check('ficha').custom(helperAprendiz.validarFicha),
        check('programa').custom(helperAprendiz.validarPrograma),
        check('email').custom(helperAprendiz.validarEmail),
        check('tipo_programa').custom(helperAprendiz.validartipo_programa),
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
    /* [
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('nombre').custom(helperAprendiz.validateNombre), 
    ], */
    ControllerAprendiz.obteneraprendiz
)
// Archivo: routers/Aprendiz.js (Ruta Corregida)
//http://localhost:3000/api/aprendices/search?nombre=Carlos&ficha=2458123
// Si usas: import { check, query, validationResult } from "express-validator"; 
router.get('/aprendices/search',
    validarJWT,  
    [
        query('nombre').optional().isString().withMessage('El nombre debe ser una cadena de texto'),
        query('ficha').optional().isString().withMessage('La ficha debe ser una cadena de texto'),
        query('programa').optional().isString().withMessage('El programa debe ser una cadena de texto'),
        //fecha
        validarCampos
    ],
    ControllerAprendiz.obtenerAprendicesSearch
);
router.put('/actualizaraprendiz/:nombre',
    validarJWT,    
    [    
        /* check('nombre')
        .optional()
        .custom(helperAprendiz.validateNombre), */
        check('ficha')
        .optional()
        .custom(helperAprendiz.validarFicha),
        check('programa')
        .optional()
        .custom(helperAprendiz.validarPrograma),
        check('email')
        .optional()
        .custom(helperAprendiz.validarEmail),
        check('tipo_programa')
        .optional()
        .custom(helperAprendiz.validartipo_programa),
        validarCampos
    ],
    ControllerAprendiz.actualizarAprendiz
)
router.delete('/eliminaraprendiz/:nombre',
    validarJWT,
    ControllerAprendiz.eliminarAprendiz 
)
export default router;