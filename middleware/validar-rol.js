//ejemplo no esat bien 
export const validateAdmiRole=(req,res,next)=>{
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