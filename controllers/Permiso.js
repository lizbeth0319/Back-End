import { param } from "express-validator";
import Permiso from "../models/Permiso.js";
import Aprendiz from "../models/Aprendiz.js";
const Permisocontroller = {
    crearPermiso: async (req, res) => {
        try {
            const {
                aprendiz,//nombre
                //traer datos aprendiz ?
                enfermera,
                fecha_solicitud,
                motivo,
                intructor,//nombre
                competencia,
                hora
            } = req.body

            const newPermiso = new Permiso({
                id_aprendiz: aprendiz,
                enfermera, // enfermera: req.usuario.id,
                fecha_solicitud,
                motivo,
                estado: 'pendiente',
                id_intructor: intructor,
                competencia,
                hora
            });
            const savePermiso = await newPermiso.save();

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
            const { id } = req.params;
            const permiso = await Permiso.findById(id)
                .populate('id_aprendiz', 'nombre')
                .populate('enfermera', 'nombre');

            if (!permiso) {
                return res.status(404).json({
                    success: false,
                    msg: 'Permiso no encontrado.'
                });
            }

            res.status(200).json({
                success: true,
                msg: 'Permiso no encontrado.',
                data: permiso
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
            const permisos = await Permiso.find({ id_aprendiz })
                .populate('id_aprendiz', 'nombre')
                .sort({ fecha_solicitud: -1 });

            if (permisos.length === 0) {
                return res.status(404).json({
                    success: false,
                    msg: 'No se encontraron permisos para este aprendiz.'
                });
            }
            res.status(200).json({
                success: true,
                msg: 'permisos del aprendiz enocntrado',
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
        try {
            const { nombre, ficha, fecha_solicitud } = req.query;
            let filtro = {};
            //validar datos
            //validar fecha
            if (nombre) {
                // Nota: Esto asume que tienes el nombre del aprendiz en tu modelo Permiso o puedes buscarlo por el modelo Aprendiz.
                // Para la búsqueda real, deberías buscar el ID en el modelo Aprendiz primero y luego filtrar por id_aprendiz.
                // Ejemplo simplificado: filtro.nombre_aprendiz = { $regex: nombre_aprendiz, $options: 'i' };
                filtro.nombre = {
                    $regex: nombre,
                    $options: 'i'
                }
            }

            // Si la búsqueda es por fecha (debes manejar el formato de fecha correctamente)
            if (fecha_solicitud) {
                // Ejemplo: Buscar por un día específico (requiere manejo de zonas horarias)
                // filtro.fecha_solicitud = { $gte: fechaInicioDelDia, $lt: fechaFinDelDia };
                filtro.fecha_solicitud = {
                    $gte: fecha_solicitud
                }
            }
            const resultados = await Permiso.find(filtro)
                .populate('id_aprendiz', 'nombre'); // Asegúrate de popular

            res.status(200).json({
                succes: true,
                msg: 'datos encontrados',
                data: resultados
            });
        } catch (error) {
            console.error('Error en la búsqueda de permisos:', error);
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

//por fuera para saber depemdendo de la seccion /esta parte es para el correo
const actualizarEstadoPermiso = (nuevoEstado) => async (req, res) => {
    try {
        const { id } = req.params;
        // Opcional: Validar que el instructor autenticado sea el mismo asignado en el permiso (id_intructor)

        const permiso = await Permiso.findByIdAndUpdate(
            id,
            { estado: nuevoEstado },
            { new: true } 
        );

        if (!permiso) {
            return res.status(404).json({ msg: 'Permiso no encontrado.' });
        }

        res.status(200).json({ msg: `Permiso ${nuevoEstado}.`, permiso });
    } catch (error) {
        console.error(`Error al ${nuevoEstado} el permiso:`, error);
        res.status(500).json({ msg: 'Error interno del servidor.' });
    }
};

export const aprobarPermiso = actualizarEstadoPermiso('aprobado');
export const denegarPermiso = actualizarEstadoPermiso('rechazado');


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