import Permiso from "../models/Permiso.js";
import Aprendiz from "../models/Aprendiz.js";
import { sendPermisoEmail } from "./Estado.js";
import helperAprendiz from "../helpers/Aprendiz.js";
import Helperpermiso from "../helpers/Permiso.js";
const Permisocontroller = {
    crearPermiso: async (req, res) => {
        console.log('entrada datos  fuc crear');

        try {
            const {
                aprendiz,
                nombreenfermera,
                motivo,
                intructor,
                nombrecompetencia,
                hora
            } = req.body
            const fechaActual = new Date();
            const newPermiso = new Permiso({
                id_aprendiz: aprendiz,
                enfermera: nombreenfermera,
                fecha_solicitud: fechaActual,
                motivo,
                estado: 'pendiente',
                id_intructor: intructor,
                competencia: nombrecompetencia,
                hora
            });
            const savePermiso = await newPermiso.save();
            //---------------- envio correo autorizacion
            const permisoId = savePermiso._id.toString(); 
            //--- tarer datos para el correo_----
            const instructorEmail= Helperpermiso.traercorreoinstructor(savePermiso.id_intructor)
            const emailData = {
                instructorEmail: instructorEmail, 
                instructorName: savePermiso.id_intructor,   
                aprendizName:savePermiso.id_aprendiz,       
                motivo: motivo,
                permisoId: permisoId       // ID del permiso guardado
            };
            const { info, tokens } = await sendPermisoEmail(emailData);
            await Permiso.findByIdAndUpdate(permisoId, {
                token_aprobacion: tokens.aprobacion,
                token_rechazo: tokens.rechazo,
                // Opcional: registrar quién lo envió o la fecha de envío
            });
            //-------------------
            res.status(201).json({
                succes: true,
                message: 'permiso creado listo para autorizar',
                data: savePermiso
            });

        } catch (error) {
            console.error('Error en createPermiso:', error);
            res.status(500).json({
                success: false,
                message: 'Error al crear permiso'
            });
        }
    },

    listapermisos: async (req, res) => {
        try {
            const Permisos = await Permiso.find();

            res.status(200).json({
                succes: true,
                msg: 'listado permisos',
                data: Permisos
            })
        } catch (error) {
            console.error('Error en listapermiso:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener lista '
            });
        }
    },

    obtenerpermiso: async (req, res) => {
        try {
            const { query } = req.query;
            if (!query) {
                return res.status(400).json({
                    success: false,
                    msg: "El parámetro de búsqueda 'query' es requerido."
                });
            }
            const regex = new RegExp(query, 'i');
            const aprendices = await Permiso.find({
                $or: [
                    { enfermera: regex },
                    { id_intructor: regex },
                    { estado: regex },
                    { hora: regex } //agregar fecha
                ]
            });
            if (aprendices.length === 0) {
                return res.status(404).json({
                    success: false,
                    msg: `No se encontraron permisos con término: "${query}"`
                });
            }
            res.status(200).json({
                success: true,
                msg: "Búsqueda de aprendices realizada exitosamente",
                data: aprendices
            });
        } catch (error) {
            console.error('Error al obtener permiso por ID:', error);
            res.status(500).json({
                success: false,
                msg: 'Error interno del servidor.'
            });
        }
    },

    obtenerpermisoAprendiz: async (req, res) => {
        try {
            const { id_aprendiz } = req.params;
            console.log(id_aprendiz);
            const permisos = await Permiso.find({
                id_aprendiz: { $regex: id_aprendiz, $options: 'i' }
            })
            if (permisos.length === 0) {
                return res.status(404).json({
                    success: false,
                    msg: 'No se encontraron permisos para este aprendiz.' //8
                });
            }
            res.status(200).json({
                success: true,
                msg: 'permisos del aprendiz enocntrado 115',
                data: permisos
            });
        } catch (error) {
            console.error('Error al obtener historial del aprendiz:', error);
            res.status(500).json({
                success: false,
                msg: 'Error interno del servidor.'
            });
        }
    },

    buscarpermisoAprediz: async (req, res) => {
        console.log("enrtre");
        try {
            const { query } = req.query;
            if (!query) {
                return res.status(400).json({
                    success: false,
                    msg: "El parámetro de búsqueda 'query' es requerido."
                });
            }
            const regex = new RegExp(query, 'i');
            const aprendices = await Aprendiz.find({
                $or: [
                    { nombre: regex },
                    { ficha: regex },
                    { programa: regex }
                ]
            });
            if (aprendices.length === 0) {
                return res.status(404).json({
                    success: false,
                    msg: `No se encontraron aprendices con el término: "${query}"`
                });
            }
            console.log(aprendices);
            res.status(200).json({
                success: true,
                msg: "Búsqueda de aprendices realizada exitosamente",
                data: aprendices
            });
        } catch (error) {
            console.error('Error en la búsqueda de permisos:', error);
            res.status(500).json({ msg: 'Error interno del servidor durante la búsqueda.' });
        }
    },
    permisoAprobado: async (req, res) => {
        try {
            const Permisos = await Permiso.find({ estado: "aprobado" })
            res.status(200).json({
                success: true,
                msg: "Búsqueda de Permisos aprobados realizada exitosamente",
                data: Permisos
            });
        } catch (error) {
            console.error('Error en la búsqueda de permisos aprobados:', error);
            res.status(500).json({ msg: 'Error interno del servidor durante la búsqueda.' });
        }
    },
    eliminarpermiso: async (req, res) => {
        try {
            const { id } = req.params;

            const permiso = await Permiso.findByIdAndDelete(id);

            if (!permiso) {
                return res.status(404).json({ msg: 'Permiso no encontrado.' });
            }

            res.status(200).json({ msg: 'Permiso eliminado correctamente.' });
        } catch (error) {
            console.error('Error al eliminar permiso:', error);
            res.status(500).json({ msg: 'Error interno del servidor.' });
        }
    },

    // en otro lado descargarPermisoPDF


}

export default Permisocontroller;



/* •	POST /api/permisos: Crear un nuevo permiso. Solo la enfermera puede hacer esta petición.-
•	GET /api/permisos: Obtener la lista de todos los permisos. Lo usaría la enfermera o el portero para ver un historial.-
•	GET /api/permisos/{id}: Obtener los detalles de un permiso específico. Lo usaría cualquier rol para ver la información completa de una solicitud.
•	GET /api/permisos/aprendiz/{id_aprendiz}: Obtener todos los permisos de un aprendiz. Esta es la petición que usará el aprendiz para ver su historial.
•	PUT /api/permisos/{id}/aprobar: Aprobar un permiso. Solo el instructor puede hacer esto.
•	PUT /api/permisos/{id}/denegar: Denegar un permiso. Solo el instructor puede hacer esto.
•	-GET /api/permisos/search: Buscar permisos por nombre de aprendiz, ficha o fecha. Esto es clave para los roles de instructor y portero.
•	DELETE /api/permisos/{id}: Eliminar un permiso. Esta petición se puede usar con moderación y control, posiblemente solo por la enfermera.
•	GET /api/permisos/{id}/descargar: Descargar el permiso en PDF. Lo usaría el aprendiz para obtener su documento.
 */