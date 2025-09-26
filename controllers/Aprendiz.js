//•	POST /api/aprendices: Crear un nuevo aprendiz. Lo usaría la enfermera para registrar a un estudiante por primera vez.
/* •GET /api/aprendices: Obtener la lista de todos los aprendices. Útil para que la enfermera pueda buscarlos.
•	GET /api/aprendices/{id}: Obtener los datos de un aprendiz específico. La enfermera lo usaría para verificar la información.
•	GET /api/aprendices/search: Buscar un aprendiz por nombre, ficha o programa.
•	Router.put edtar 
•	Router.delete */
import Aprendiz from  "../models/Aprendiz.js";
import bcrypt from "bcryptjs";
//import User from "../models/User.js";

const ControllerAprendiz = {
    crearaprendiz: async (req, res) => {
        try {
            const { nombre, ficha, programa, email, password } = req.body;

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.password, salt);

            const newAprendiz = new Aprendiz({
                nombre,
                ficha,
                programa,
                email,
                password_hash: hashedPassword
            });
            const savedAprendiz = await newAprendiz.save();
            const datosAprendiz = {
                nombre: savedAprendiz.nombre,
                ficha: savedAprendiz.ficha,
                programa: savedAprendiz.programa,
                email: savedAprendiz.email
            }
            res.status(201).json({
                success: true,
                msg: "Aprendiz creado exitosamente",
                DataTransfer: datosAprendiz
            });
        } catch (error) {
            console.error('Error en createUsers:', error);
            res.status(500).json({
                success: false,
                message: 'Error al crear usuario'
            });
        }
    },
    obtenerAprendices: async (req, res) => {
        try {
            const aprendices = await Aprendiz.find({}, '-password_hash'); // Excluir el campo password_hash
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
            const aprendiz = await Aprendiz.findOne({ nombre: String(nombre) }, '-password_hash')
            console.log(aprendiz);
            if (!aprendiz) {
                return res.status(404).json({
                    success: false,
                    msg: "Aprendiz no encontrado"
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
                message: 'Error al obtener la venta'
            });
        }
    },
    obtenerAprendicesSearch: async (req, res) => {
        try {
            const { query } = req.query;
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
            }, '-password_hash'); // Excluir el campo password_hash
            res.status(200).json({
                success: true,
                msg: "Búsqueda de aprendices realizada exitosamente",
                DataTransfer: aprendices
            });
        } catch (error) {
            console.error('Error en obtenerAprendicesSearch:', error);
            res.status(500).json({
                success: false,
                message: 'Error al buscar aprendices'
            });
        }
    },
    actualizarAprendiz: async (req, res) =>{
        try {
            const {nombre}=req.params
            const { ficha, programa, email, password } = req.body;
            const aprendiz = await Aprendiz.findOne({ nombre: String(nombre) });
            if (!aprendiz) {
                return res.status(404).json({
                    success: false,
                    msg: "Aprendiz no encontrado"
                });
            }
            aprendiz.ficha = ficha || aprendiz.ficha;
            aprendiz.programa = programa || aprendiz.programa;
            aprendiz.email = email || aprendiz.email;
            if (password) {
                const salt = await bcrypt.genSalt();
                aprendiz.password_hash = await bcrypt.hash(password, salt);
            }
            const updatedAprendiz = await aprendiz.save();
            const datosAprendiz = {
                nombre: updatedAprendiz.nombre,
                ficha: updatedAprendiz.ficha,
                programa: updatedAprendiz.programa,
                email: updatedAprendiz.email
            }
            res.status(200).json({
                success: true,
                msg: "Aprendiz actualizado exitosamente",
                DataTransfer: datosAprendiz
            });
        } catch (error) {
            console.error('Error en actualizarAprendiz:', error);
            res.status(500).json({
                success: false,
                message: 'Error al buscar aprendices'
            });
        }
    },
    eliminarAprendiz:async(req,res )=>{
        try {
            const {nombre}=req.params
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