import { Router } from "express"; 
import Permisocontroller from '../controllers/permiso.js'
import { validarCampos } from '../middleware/validar-campo.js';
import Helperpermiso from '../helpers/permiso.js'
import { check } from "express-validator";
import { validarJWT } from "../middleware/validar-jwt.js";
const router = Router();

router.post('/permiso',
    //validarJWT,
    //validar rol
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
export default router
//agragr