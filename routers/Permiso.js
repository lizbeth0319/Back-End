import { Router } from "express"; 
import Permisocontroller from '../controllers/Permiso.js'
import { validarCampos } from '../middleware/validar-campo.js';
import Helperpermiso from '../helpers/Permiso.js'
import { check } from "express-validator";
import { validarJWT } from "../middleware/validar-jwt.js";
import validarRol from "../middleware/validar-rol.js";
const router = Router();

router.post('/permiso',
    validarJWT,                   
    validarRol(['enfermeria']),    
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
    validarRol(['instructor', 'enfermeria']),
    Permisocontroller.listapermisos
)

router.get('/search',
    validarJWT,
    validarRol(['instructor', 'porteria']),
    Permisocontroller.obtenerpermiso
)

router.get('/aprendiz/:id_aprendiz', [
    validarJWT,
    validarRol(['aprendiz']) ,
],Permisocontroller.obtenerpermisoAprendiz
)

router.get('/:id', [
    validarJWT // Cualquier rol autenticado puede verlo
],Permisocontroller.buscarpermisoAprediz
)
router.delete('/:id', [
    validarJWT,
    validarRol(['enfermeria']), 
], Permisocontroller.eliminarpermiso);
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