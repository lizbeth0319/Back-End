import User from "../models/User.js";
const helpersUser = {
    validarRolPermitido: (rol) => {
        // Lista de roles válidos basada en tu modelo User
        const rolesValidos = ['aprendiz', 'enfermeria', 'instructor', 'porteria'];
        
        if (!rol) {
            throw new Error('El parámetro de rol es requerido.');
        }

        if (!rolesValidos.includes(rol.toLowerCase())) {
            throw new Error(`El rol '${rol}' no es un rol válido en el sistema. Roles permitidos: ${rolesValidos.join(', ')}`);
        }
        
        return true;
    },
        validarnombre: async (nombre)=>{
        const existeNombre = await User.findOne({ nombre });
        if(existeNombre){
            throw new Error(`El nombre ${nombre} ya está registrado`);
        }
        if(nombre.length >10){
            throw new Error('El nombre debe tener máximo 10 caracteres');
        }
        } 
};
export default helpersUser;
