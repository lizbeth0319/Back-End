import Aprendiz from "../models/Aprendiz.js";

const helperAprendiz = {
    validateNombre: async (nombre, { req }) => {
        if (!nombre) return;
        const idActual = req.params.id;
        const query = {
            nombre: nombre,
            _id: { $ne: idActual }
        };

        const existeOtroAprendiz = await Aprendiz.findOne(query);
        if (existeOtroAprendiz) {
            throw new Error(`El nombre: ${nombre} ya está registrado por otro aprendiz.`);
        }
        return true;
    },
    validarFicha: async (ficha) => {
        console.log('ya valido ficha');
        if (!ficha) {
            throw Error(`La ficha es obligatoria`);
        }
        if (ficha.length < 5) { //26 29 16 0
            throw new Error(`La ficha debe tener al menos 7 caracteres`);
        } else if (ficha.length > 8) {
            throw new Error("la ficha debe ser menos de 8 caracteres");

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
    validarEmail: async (email, { req }) => {
        // Si el email no se envía en el body, la validación termina aquí.
        if (!email) return;

        // Obtener el ID del usuario que se está actualizando
        const idActual = req.params.id;
        const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
        if (!emailRegex.test(email)) {
            throw new Error('El formato del correo electrónico no es válido. Debe ser del tipo usuario@dominio.com');
        }
        const query = {
            email: email,
            _id: { $ne: idActual } 
        };
        const existeOtroAprendiz = await Aprendiz.findOne(query);
        if (existeOtroAprendiz) {
            throw new Error(`El email: ${email} ya está registrado por otro usuario.`);
        }
        return true;
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