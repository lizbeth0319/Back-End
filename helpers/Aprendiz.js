import Aprendiz from "../models/Aprendiz.js";

const helperAprendiz={
    validateNombre: async(nombre)=>{
        console.log('ya valido nombre');
        const aprendiz= await Aprendiz.findOne({nombre});
        if(aprendiz){
            throw new Error(`El nombre: ${nombre}, ya está registrado`);
        }
        if(!nombre){
            throw new Error(`El nombre es obligatorio`);
        }
    },
    validarFicha:async(ficha)=>{
        console.log('ya valido ficha');
        if(!ficha){
            throw Error(`La ficha es obligatoria`);
        }
        if(ficha.length < 7){ //26 29 16 0
            throw new Error(`La ficha debe tener al menos 6 caracteres`);
        }
    },
    validarPrograma:async(programa)=>{
        console.log('ya valido programa');
        if(!programa){
            throw new Error(`El programa es obligatorio`);
        }
        if(programa.length <5){
            throw new Error("criterio especifico");
        }
    },
    validarEmail: async (email)=>{
        console.log('ya valido email');
        if (!email) throw new Error('El email es requerido');
        if (!/^\w+([.-]?\w+)@\w+([.-]?\w+)(\.\w{2,3})+$/.test(email)) {
            throw new Error('El correo debe ser @gmail.com');
        }
        const existeEmail = await Aprendiz.findOne({ email });
        if(existeEmail){
            throw new Error(`El correo ${email} ya está registrado`);
        }
    },
    validarPassword: (password) => {
        console.log('ya valido password');
        if (!password) throw new Error('La contraseña es requerida');
        if (password.length < 8) throw new Error('La contraseña debe tener mínimo 8 caracteres');
        return true;
    },
}
export default helperAprendiz;