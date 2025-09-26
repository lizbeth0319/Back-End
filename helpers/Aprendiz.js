import Aprendiz from "../models/Aprendiz.js";

const helperAprendiz={
    validateNombre: async(nombre)=>{
        const aprendiz= await Aprendiz.findOne({nombre});
        if(aprendiz){
            throw new Error(`El nombre: ${nombre}, ya está registrado`);
        }
        if(!nombre){
            throw new Error(`El nombre es obligatorio`);
        }
    },
    validarFicha:(ficha)=>{
        if(!ficha){
            throw Error(`La ficha es obligatoria`);
        }
        if(ficha.length < 6){ //26 29 16 0
            throw new Error(`La ficha debe tener al menos 6 caracteres`);
        }
    },
    validarRol:(rol)=>{
        const rolesValidos=['aprendiz', 'enfermeria','instructor','porteria']
        if(!rolesValidos.includes(rol)){
            throw new Error(`El rol ${rol} no es válido. Los roles permitidos son: ${rolesValidos.join(', ')}`);
        }
    },
    validarPrograma:(programa)=>{
        if(!programa){
            throw new Error(`El programa es obligatorio`);
        }
        if(programa.length <5){
            throw new Error("criterio especifico");
        }
    },
    validarEmail: async (email)=>{
        if (!email) throw new Error('El email es requerido');
        if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/i.test(email)) {
            throw new Error('El correo debe ser @gmail.com');
        }
        const existeEmail = await User.findOne({ email });
        if(existeEmail){
            throw new Error(`El correo ${email} ya está registrado`);
        }
    },
    validarPassword: (password) => {
        if (!password) throw new Error('La contraseña es requerida');
        if (password.length < 8) throw new Error('La contraseña debe tener mínimo 8 caracteres');
        return true;
    },
}
export default helperAprendiz;