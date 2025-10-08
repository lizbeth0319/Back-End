import User from "../models/User.js";
import Aprendiz from "../models/Aprendiz.js";
/* aprendiz,//nombreenfermera , fecha_solicitud , motivo,intructor,//nombrecompetencia,hora */

const Helperpermiso = {
    validarNombres: async (name) => {
        console.log("Validando nombre de aprendiz:", name);
        if (!name) {
            throw new Error('El nombre del aprendiz es requerido.');
        }
        if (name.length < 2 || name.length > 30) {
            throw new Error('El nombre debe tener entre 2 y 30 caracteres.');
        }
        const usuario = await Aprendiz.findOne({ nombre: String(name) });

        if (!usuario) {
            throw new Error(`El nombre de usuario "${name}" no se encuentra registrado en la base de datos.`);
        }

        return true;
    },

    validarenfermera: async (nombreenfermera) => {
        console.log("Validando nombre de enfermera:", nombreenfermera);
        if (!nombreenfermera) {
            throw new Error("El nombre de la enfermera es requerido.");
        }
        if (nombreenfermera.length < 2 || nombreenfermera.length > 30) {
            throw new Error('El nombre debe tener entre 2 y 30 caracteres.');
        }
        const usuario = await User.findOne({ nombre: nombreenfermera });

        if (!usuario) {
            throw new Error(`El nombre de enfermera(o) "${nombreenfermera}" no se encuentra registrado.`);
        }

        if (usuario.rol !== 'enfermeria') {
            throw new Error(`El usuario "${nombreenfermera}" está registrado, pero su rol es "${usuario.rol}", y se requiere que sea 'enfermera'.`);
        }
        return true;
    },
    validarmotivo: async (motivo) => {
        if (!motivo) {
            throw new Error("El motivo de la solicitud es requerido.");
        }
        if (typeof motivo !== 'string') {
            throw new Error("El motivo debe ser una cadena de texto.");
        } 
        if (motivo.length < 10 || motivo.length > 200) {
            throw new Error('El motivo debe ser específico y tener entre 10 y 200 caracteres.');
        }
        return true;
    },
    validarintructor: async (intructor) => {
        console.log("Validando nombre de instructor:", intructor);

        if (!intructor) {
            throw new Error("El nombre del instructor es requerido.");
        }
        if (intructor.length < 2 || intructor.length > 30) {
            throw new Error('El nombre debe tener entre 2 y 30 caracteres.');
        }
        const usuario = await User.findOne({ nombre: intructor });
        if (!usuario) {
            throw new Error(`El nombre de instructor(a) "${intructor}" no se encuentra registrado.`);
        }

        if (usuario.rol !== 'instructor') {
            throw new Error(`El usuario "${intructor}" está registrado, pero su rol es "${usuario.rol}", y se requiere que sea 'instructor'.`);
        }

        return true;
    },
    validarnombrecompetencia: async (nombrecompetencia) => {
        if (!nombrecompetencia) {
            throw new Error("El nombre de la competencia es requerido.");
        }
        if (typeof nombrecompetencia !== 'string') {
            throw new Error("El nombre de la competencia debe ser una cadena de texto.");
        }
        if (nombrecompetencia.length < 5 || nombrecompetencia.length > 50) {
            throw new Error('El nombre de la competencia debe tener entre 5 y 50 caracteres.');
        }
        return true;
    },
    traercorreoinstructor:async (intructor)=>{
        const datosintructor= await User.find({nombre:String(intructor)})
        if(!datosintructor){
            throw new Error("no hay un correo para este instructor");
            
        }
        console.log(datosintructor.email)
        return datosintructor.email
    }
};

export default Helperpermiso;