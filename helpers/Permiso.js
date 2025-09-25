import User from "../models/User.js";

/* aprendiz,//nombreenfermera , fecha_solicitud , motivo,intructor,//nombrecompetencia,hora */

const Helperpermiso={
    validarNombres: (name) => {
        if (!name) throw new Error('El nombre es requerido');
        if (name.length < 2 || name.length > 30) {
            throw new Error('El nombre debe tener entre 2 y 30 caracteres');
        }
        return true;
    },
    validarenfermera: async (nombreenfermera)=>{
        if(!nombreenfermera) throw new Error("nombre requerido");
        const found = await User.find({nombre:enfermera})
        if(!found){
            throw new Error("nombre de enfermer@ no encontrado ");
        }
        if(nombreenfermera.length<2 || nombreenfermera>30){
            throw new Error('El nombre debe tener entre 2 y 30 caracteres');
        }

    },
    validarmotivo:(motivo)=>{
        if(!motivo) throw new Error("motivo requerido");
        if(motivo.length <4){//salud
            throw new Error("criterio especifico");
        }
        
    },
    validarintructor:async(intructor)=>{
        if(!intructor) throw new Error("intructor requerido");
        const found= await User.find({nombre:intructor})
        if(!found){
            throw new Error("intructor no registrado ");
        }
        
    },
    validarnombrecompetencia:(nombrecompetencia)=>{
        if(!nombrecompetencia) throw new Error(" se necesita competencia");
        if (name.length < 2 || name.length > 30) {
            throw new Error('El nombre debe tener entre 2 y 30 caracteres');
        }
    },
//buscar para vaidae fecha y hora 
};

export default Helperpermiso;