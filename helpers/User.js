import User from '../models/User.js';



/* validarPassword: (password) => {
        if (!password) throw new Error('La contraseña es requerida');
        if (password.length < 8) throw new Error('La contraseña debe tener mínimo 8 caracteres');
        return true;
    }, */
const helpersUser = {
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
