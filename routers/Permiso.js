import { Router } from "express";
import Permisocontroller from '../controllers/Permiso.js'
import { validarCampos } from '../middleware/validar-campo.js';
import Helperpermiso from '../helpers/Permiso.js'
import { check, query ,validationResult} from "express-validator";
import { validarJWT } from "../middleware/validar-jwt.js";
import validarRol from "../middleware/validar-rol.js";
const router = Router();


/* const {
    aprendiz,enfermera,motivo,intructor,competencia,hora} = req.body */
router.post('/permiso',
    validarJWT,
    [
        check('aprendiz').custom(Helperpermiso.validarNombres),
        check('nombreenfermera').custom(Helperpermiso.validarenfermera),
        check('motivo').custom(Helperpermiso.validarmotivo),
        check('intructor').custom(Helperpermiso.validarintructor),
        check('nombrecompetencia').custom(Helperpermiso.validarnombrecompetencia),
        validarCampos
    ],
    Permisocontroller.crearPermiso
)

router.get('/listadopermisos',
    validarJWT,
    Permisocontroller.listapermisos
)

router.get('/permisos/search',
    validarJWT,
    [
        query('nombreenfermera').optional().isString().withMessage('El nombre debe ser una cadena de texto'),
        //query('motivo').optional().isString().withMessage('El nombre debe ser una cadena de texto'),
        query('intructor').optional().isString().withMessage('El nombre debe ser una cadena de texto'),
        //query('nombrecompetencia').optional().isString().withMessage('El nombre debe ser una cadena de texto'),
        validarCampos
    ],
    Permisocontroller.obtenerpermiso
)

router.get('/aprendiz/:id_aprendiz', 
    validarJWT,
    Permisocontroller.obtenerpermisoAprendiz
)
router.get('/aprendiz/busqeda/search', 
    validarJWT,
    [
        query('nombre').optional().isString().withMessage('El nombre debe ser una cadena de texto'),
        query('ficha').optional().isString().withMessage('La ficha debe ser una cadena de texto'),
        query('programa').optional().isString().withMessage('El programa debe ser una cadena de texto'),
        query('fecha_solicitud')
            .optional()
            .isISO8601()
            .toDate()
            .withMessage('La fecha debe ser un formato válido (YYYY-MM-DD o ISO 8601).'),
    ],
    Permisocontroller.buscarpermisoAprediz
)

///api/porteria/permisos/aprobados
router.get('/porteria/permiso/aprobados',
    validarJWT,
    Permisocontroller.permisoAprobado
);
router.delete('/:id', 
    validarJWT,
    Permisocontroller.eliminarpermiso);

//router.get('/porteria/permisos/aprobados')
//•	GET /api/instructores/{id}/permisos/pendientes: 
//correo
/* router.put('/:id/aprobar', [
    validarJWT,
    validarRol(['instructor']) 
], PermisoController.aprobarPermiso);

router.put('/:id/denegar', [
    validarJWT,
    validarRol(['instructor']) 
], PermisoController.denegarPermiso); */
export default router
//agragr