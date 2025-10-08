//•	POST /api/aprendices: Crear un nuevo aprendiz. Lo usaría la enfermera para registrar a un estudiante por primera vez.
/* •GET /api/aprendices: Obtener la lista de todos los aprendices. Útil para que la enfermera pueda buscarlos.
•	GET /api/aprendices/{id}: Obtener los datos de un aprendiz específico. La enfermera lo usaría para verificar la información.
•	GET /api/aprendices/search: Buscar un aprendiz por nombre, ficha o programa.
•	Router.put edtar 
•	Router.delete */
import Aprendiz from "../models/Aprendiz.js";
import bcrypt from "bcryptjs";
//import User from "../models/User.js";

const ControllerAprendiz = {
    crearaprendiz: async (req, res) => {
        console.log('ya entro a crear');
        try {
            const { nombre, ficha, programa, email, tipo_programa } = req.body;

            const newAprendiz = new Aprendiz({
                nombre,
                ficha,
                programa,
                email,
                tipo_programa
            });
            const savedAprendiz = await newAprendiz.save();

            const datosAprendiz = {
                nombre: savedAprendiz.nombre,
                ficha: savedAprendiz.ficha,
                programa: savedAprendiz.programa,
                email: savedAprendiz.email,
                tipo_programa: savedAprendiz.tipo_programa
            }
            res.status(201).json({
                success: true,
                msg: "Aprendiz creado exitosamente",
                DataTransfer: datosAprendiz
            });
        } catch (error) {
            console.error('Error en createUsers:', error);
            if (error.code === 11000) {
                return res.status(409).json({
                    success: false,
                    message: 'El email ya está registrado para otro aprendiz.'
                });
            }
            res.status(500).json({
                success: false,
                message: 'Error al crear usuario'
            });
        }
    },
    obtenerAprendices: async (req, res) => {
        try {
            const aprendices = await Aprendiz.find(); 
            res.status(200).json({
                success: true,
                msg: "Lista de aprendices obtenida exitosamente",
                DataTransfer: aprendices
            });
        } catch (error) {
            console.error('Error en obtenerAprendices:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener aprendices'
            });
        }
    },
    obteneraprendiz: async (req, res) => { // Obtener un aprendiz por ID que seria su nombre
        try {
            const { nombre } = req.params;
            console.log(nombre)
            const aprendiz = await Aprendiz.find({
                nombre: { $regex: nombre, $options: 'i' }
            });
            console.log(aprendiz);
            if (aprendiz.length === 0) {
                return res.status(404).json({
                    success: false,
                    msg: `No se encontraron aprendices cuyo nombre contenga "${nombre}".`
                });
            }
            res.status(200).json({
                success: true,
                msg: "Aprendiz obtenido exitosamente",
                DataTransfer: aprendiz
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al obtener el aprendiz'
            });
        }
    },
    obtenerAprendicesSearch: async (req, res) => {
        try {
            const { query } = req.query; 
            if (!query) {
                return res.status(400).json({
                    success: false,
                    msg: "El parámetro de búsqueda 'query' es requerido."
                });
            }
            const regex = new RegExp(query, 'i'); // Búsqueda insensible a mayúsculas/minúsculas
            const aprendices = await Aprendiz.find({
                $or: [
                    { nombre: regex },
                    { ficha: regex },
                    { programa: regex }
                ]
                /* $or: Este es un operador lógico que permite combinar múltiples condiciones. 
                La consulta devolverá los documentos que cumplan cualquiera de
                 las condiciones dentro de los corchetes.  */
            }); // Excluir el campo password_hash
            if (aprendices.length === 0) {
                return res.status(404).json({
                    success: false,
                    msg: `No se encontraron aprendices con el término: "${query}"`
                });
            }

            res.status(200).json({
                success: true,
                msg: "Búsqueda de aprendices realizada exitosamente",
                data: aprendices
            });
        } catch (error) {
            console.error('Error en obtenerAprendicesSearch:', error);
            res.status(500).json({
                success: false,
                message: 'Error al buscar aprendices'
            });
        }
    },
    actualizarAprendiz: async (req, res) => {
        try {
            const { nombre: nombreIdentificador } = req.params;
            const updateData = req.body;
            console.log("138", nombreIdentificador);

            // 3. Usar findOneAndUpdate para una sola llamada a la base de datos
            // NOTA: Si el campo 'email' está en el cuerpo y es un índice único, Mongoose
            // automáticamente lanzará el error 11000 si hay duplicado.
            const updatedAprendiz = await Aprendiz.findOneAndUpdate(
                { nombre: nombreIdentificador }, // Criterio de búsqueda
                updateData,                       // Datos a actualizar
                { new: true }                     // Devuelve el documento actualizado
            );

            if (!updatedAprendiz) {
                return res.status(404).json({
                    success: false,
                    msg: "Aprendiz no encontrado."
                });
            }

            const datosAprendiz = {
                nombre: updatedAprendiz.nombre,
                ficha: updatedAprendiz.ficha,
                programa: updatedAprendiz.programa,
                email: updatedAprendiz.email,
                tipo_programa: updatedAprendiz.tipo_programa
            };

            res.status(200).json({
                success: true,
                msg: "Aprendiz actualizado exitosamente",
                data: datosAprendiz 
            });

        } catch (error) {
            if (error.code === 11000) {
                return res.status(409).json({
                    success: false,
                    message: 'Error: El email o la ficha que intentas asignar ya están registrados.'
                });
            }

            console.error('Error en actualizarAprendiz:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor al actualizar aprendiz.'
            });
        }
    },
    eliminarAprendiz: async (req, res) => {
        try {
            const { nombre } = req.params
            const deletedAprendiz = await Aprendiz.findOneAndDelete({ nombre: String(nombre) });
            if (!deletedAprendiz) {
                return res.status(404).json({
                    success: false,
                    msg: "Aprendiz no encontrado"
                });
            }
            res.status(200).json({
                success: true,
                msg: "Aprendiz eliminado exitosamente"
            });
        } catch (error) {
            console.error('Error en elminar aprendiz:', error);
            res.status(500).json({
                success: false,
                message: 'Error al buscar aprendices'
            });
        }
    }
};
export default ControllerAprendiz;