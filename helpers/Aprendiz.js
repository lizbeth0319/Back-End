import Aprendiz from "../models/Aprendiz.js";

const helperAprendiz = {
    validateNombre: async (nombre) => {
        console.log('ya valido nombre');
        const aprendiz = await Aprendiz.findOne({ nombre });
        if (aprendiz) {
            throw new Error(`El nombre: ${nombre}, ya está registrado`);
        }
        if (!nombre) {
            throw new Error(`El nombre es obligatorio`);
        }
    },
    validarFicha: async (ficha) => {
        console.log('ya valido ficha');
        if (!ficha) {
            throw Error(`La ficha es obligatoria`);
        }
        if (ficha.length < 7) { //26 29 16 0
            throw new Error(`La ficha debe tener al menos 6 caracteres`);
        }
    },
    validarPrograma: async (programa) => {
        console.log('ya valido programa');
        if (!programa) {
            throw new Error(`El programa es obligatorio`);
        }
        if (programa.length < 5) {
            throw new Error("criterio especifico");
        }
    },
    validarEmail: async (email) => {
        console.log('ya valido email');
        if (!email) {
            throw new Error('El email es requerido');
        }
        const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
        if (!emailRegex.test(email)) {
            throw new Error('El formato del correo electrónico no es válido. Debe ser del tipo usuario@dominio.com');
        }
        const existeEmail = await Aprendiz.findOne({ email });
        if (existeEmail) {
        throw new Error(`El correo ${email} ya está registrado`);
        return true;
    }
    },
    validartipo_programa: (tipo_programa) => {
        console.log('ya valido tipo_programa');
        if (!tipo_programa) throw new Error("El tipo de programa es reqierodo");
        let tipos_programas = ['tecnologo', 'tecnico']
        if (!tipos_programas.includes(tipo_programa)) {
            throw new Error("tipo programa debe ser ", { tipos_programas });
        }
        return true;
    },
}
export default helperAprendiz;