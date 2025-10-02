//ejemplo no esat bien 
//['aprendiz', 'enfermeria','instructor','porteria']


const validarRol = (rolesPermitidos = []) => {

    return (req, res, next) => {
        if (!req.usuario) {
            return res.status(500).json({
                msg: 'Error interno: Se está intentando validar el rol sin validar el token JWT primero.'
            });
        }
        
        const rolUsuario = req.usuario.rol;
        
        // 1. Comprueba si el rol del usuario está en la lista de roles permitidos
        if (!rolesPermitidos.includes(rolUsuario)) {
            return res.status(403).json({
                msg: `Acceso denegado. El rol '${rolUsuario}' no está autorizado. Roles requeridos: ${rolesPermitidos.join(', ')}`
            });
        }

        // 2. Si el rol es válido, continuar al controlador
        next();
    }
};
export default validarRol;
/* 
const validateAdmiRole=(req,res,next)=>{
    if(!req.user){
        return res.status(500).json({
            msg:'We want to verify the role without first validating the token.'
        });
    }

    const { globalRole, firstName } =  req.user;

    if(globalRole!=='Admin'){
        return res.status(403).json({
            msg:`${firstName} no tiene rol de administrador - Acceso denegado.`
        });
    }
    next();
    console.log(`Usuario ${firstName} es Admin. Acceso permitido.`);
}

 */