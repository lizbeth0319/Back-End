import Permiso from "../models/Permiso.js";
import Aprendiz from "../models/Aprendiz.js";
import User from "../models/User.js";
import axios from "axios";
import { sendPermisoEmail } from "./Estado.js";
import helperAprendiz from "../helpers/Aprendiz.js";
import Helperpermiso from "../helpers/Permiso.js";
import { generatePermisoPdf } from "../helpers/pdf-services/generate-pdf.js";
import { getImageBase64 } from '../helpers/pdf-services/get-base64.js';

async function getAprendizData(aprendizId) {

    const aprendiz = await Aprendiz.findOne(
        { _id: aprendizId },
        'nombre ficha programa'
    );
    console.log(aprendiz)
    return aprendiz ? aprendiz.toObject() : null;
}

async function getInstructorIdByName(name) {
    if (!name) {
        console.warn(`[Instructor Faltante] Nombre de instructor es nulo.`);
        return null;
    }
    
    // Asume que el modelo User tiene un campo 'nombre'
    const user = await User.findOne(
        { nombre: name }, // Buscar por el nombre completo
        '_id'
    ).exec();
    
    if (!user) {
        console.warn(`[Instructor Faltante] No se encontró ID para el instructor de nombre: ${name}`);
        return null;
    }
    
    return user._id;
}


async function getInstructorSignatureUrl(instructorId) {
    if (!instructorId) {
        console.warn(`[Firma Faltante] instructorId es nulo.`);
        return null;
    }

    const instructor = await User.findById(
        instructorId, 
        'firma_url cloudinary_id'
    ).exec();

    if (!instructor || !instructor.firma_url) {
        console.warn(`[Firma Faltante] No se encontraron datos de firma para el instructor ID: ${instructorId}`);
        return null;
    }

    const fullUrl = instructor.firma_url; 
    console.log(`URL de firma construida: ${fullUrl}`); 

    return fullUrl;
}

async function getRecentApprovedPermisos(aprendizId) {
    try {
        console.log(aprendizId)
        const permisos = await Permiso.find({
            id_aprendiz: aprendizId,
            estado:"aprobado"
        })
            .sort({ fecha_solicitud: -1 })
            .lean();
        console.log(permisos)
        return permisos;

    } catch (error) {
        console.error("Error al obtener permisos aprobados:", error);
        return []; 
    }
}


const Permisocontroller = {
    crearPermiso: async (req, res) => {
        console.log('entrada datos fuc crear');

        try {
            const {
                aprendiz, nombreenfermera, motivo, intructor, nombrecompetencia, hora
            } = req.body;
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
            const instructorEmail = await Helperpermiso.traercorreoinstructor(savePermiso.id_intructor);
            if (!instructorEmail) {
                throw new Error("No se pudo obtener el correo del instructor.");
            }
            const emailData = {
                instructorEmail: instructorEmail,
                instructorName: savePermiso.id_intructor,
                aprendizName: savePermiso.id_aprendiz,
                motivo: motivo,
                permisoId: permisoId // ID del permiso guardado
            };

            // 💡 NOTA: Aunque sendPermisoEmail retorna tokens, AHORA NO SE USARÁN para la aprobación/rechazo
            const { info } = await sendPermisoEmail(emailData);

            // 💡 SE BORRA la lógica de guardar tokens si no se van a usar para la validación de la URL.
            // Si quieres guardar la info del correo (info.messageId), puedes hacerlo aquí.

            //-------------------
            res.status(201).json({
                succes: true,
                message: 'Permiso creado y correo de autorización enviado.',
                data: savePermiso
            });

        } catch (error) {
            console.error('Error en createPermiso:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Error al crear permiso'
            });
        }
    },

    handleAprobarRechazar: async (req, res, estado) => {
        const { id } = req.params;
        const accion = estado === 'aprobado' ? 'Aprobado' : 'Rechazado';

        try {
            // 1. Usar findByIdAndUpdate para actualizar el estado directamente
            const updatedPermiso = await Permiso.findOneAndUpdate(
                {
                    _id: id,
                    estado: 'pendiente' // Solo actualiza si aún está pendiente
                },
                {
                    estado: estado
                },
                {
                    new: true,
                    runValidators: true
                }
            );

            if (!updatedPermiso) {
                // Si no se encuentra, es porque el ID es inválido o el permiso ya fue procesado
                return res.status(404).send(`<h1>🚫 Error al Procesar</h1>
                                             <p>El permiso ID **${id}** ya fue procesado o no se encuentra en estado pendiente.</p>`);
            }

            const mensajeHTML = `
                        <!DOCTYPE html>
                        <html lang="es">
                        <head>
                            <meta charset="UTF-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                            <style>
                            * {
                                margin: 0;
                                padding: 0;
                                box-sizing: border-box;
                            }
                            body {
                                font-family: 'Roboto', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                                background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
                                padding: 20px;
                            }
                            .container {
                                max-width: 600px;
                                margin: 0 auto;
                                background: white;
                                border-radius: 16px;
                                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
                                overflow: hidden;
                            }
                            .header {
                                background: linear-gradient(135deg, #39a900 0%, #2d8600 100%);
                                padding: 30px;
                                text-align: center;
                                color: white;
                            }
                            .header h1 {
                                font-size: 28px;
                                font-weight: 700;
                                margin-bottom: 10px;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                gap: 10px;
                            }
                            .icon {
                                font-size: 40px;
                                animation: bounce 1s ease infinite;
                            }
                            @keyframes bounce {
                                0%, 100% { transform: translateY(0); }
                                50% { transform: translateY(-10px); }
                            }
                            .content {
                                padding: 40px 30px;
                            }
                            .info-box {
                                background: #f8f9fa;
                                border-left: 4px solid #39a900;
                                border-radius: 8px;
                                padding: 20px;
                                margin: 20px 0;
                            }
                            .info-row {
                                display: flex;
                                justify-content: space-between;
                                align-items: center;
                                padding: 12px 0;
                                border-bottom: 1px solid #e9ecef;
                            }
                            .info-row:last-child {
                                border-bottom: none;
                            }
                            .label {
                                color: #6c757d;
                                font-weight: 500;
                                font-size: 14px;
                            }
                            .value {
                                color: #212529;
                                font-weight: 600;
                                font-size: 16px;
                            }
                            .estado-badge {
                                display: inline-block;
                                padding: 8px 16px;
                                border-radius: 20px;
                                font-weight: 600;
                                font-size: 14px;
                                text-transform: uppercase;
                                letter-spacing: 0.5px;
                            }
                            .estado-aprobado {
                                background: #d4edda;
                                color: #155724;
                                border: 1px solid #c3e6cb;
                            }
                            .estado-rechazado {
                                background: #f8d7da;
                                color: #721c24;
                                border: 1px solid #f5c6cb;
                            }
                            .estado-pendiente {
                                background: #fff3cd;
                                color: #856404;
                                border: 1px solid #ffeaa7;
                            }
                            .mensaje-principal {
                                font-size: 16px;
                                line-height: 1.6;
                                color: #495057;
                                margin: 20px 0;
                                text-align: center;
                            }
                            .footer {
                                background: #f8f9fa;
                                padding: 20px;
                                text-align: center;
                                border-top: 1px solid #e9ecef;
                            }
                            .footer p {
                                color: #6c757d;
                                font-size: 13px;
                                margin: 5px 0;
                            }
                            .highlight {
                                color: #39a900;
                                font-weight: 700;
                            }
                            </style>
                        </head>
                        <body>
                            <div class="container">
                            <div class="header">
                                <h1>
                                <span class="icon">✅</span>
                                Permiso ${accion}
                                </h1>
                            </div>
                            
                            <div class="content">
                                <p class="mensaje-principal">
                                El permiso ha sido <span class="highlight">${accion.toUpperCase()}</span> con éxito.
                                </p>
                                
                                <div class="info-box">
                                <div class="info-row">
                                    <span class="label">ID del Permiso:</span>
                                    <span class="value">${updatedPermiso._id}</span>
                                </div>
                                
                                <div class="info-row">
                                    <span class="label">Aprendiz:</span>
                                    <span class="value">${updatedPermiso.id_aprendiz}</span>
                                </div>
                                
                                <div class="info-row">
                                    <span class="label">Estado Final:</span>
                                    <span class="estado-badge estado-${updatedPermiso.estado.toLowerCase()}">${updatedPermiso.estado.toUpperCase()}</span>
                                </div>
                                </div>
                            </div>
                            
                            <div class="footer">
                                <p>Sistema de Gestión de Permisos - SENA</p>
                                <p>Este es un mensaje automático, por favor no responder.</p>
                            </div>
                            </div>
                        </body>
                        </html>
                        `;
            res.status(200).send(mensajeHTML);

        } catch (error) {
            console.error('Error al actualizar estado del permiso:', error);
            res.status(500).send(`<h1>❌ Error Interno</h1><p>Fallo al procesar la solicitud: ${error.message}</p>`);
        }
    },

    aprobarPermiso: (req, res) => Permisocontroller.handleAprobarRechazar(req, res, 'aprobado'),

    rechazarPermiso: (req, res) => Permisocontroller.handleAprobarRechazar(req, res, 'rechazado'),


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
    deleteAll: async (req, res) => {
        try {
            // Utiliza deleteMany({}) para eliminar todos los documentos.
            const result = await Permiso.deleteMany({});

            res.status(200).json({
                success: true,
                message: `Todos los permisos han sido eliminados. Total: ${result.deletedCount}`,
                deletedCount: result.deletedCount
            });
        } catch (error) {
            console.error('Error al eliminar todos los permisos:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor al intentar eliminar permisos.'
            });
        }
    },
    generarPermiso: async (req, res) => {
        try {
            // 1. Obtener ID del aprendiz de los parámetros
            const aprendizId = req.params.id;
            console.log(aprendizId)
            if (!aprendizId) {
                return res.status(400).send({ message: 'Debe proporcionar el ID del aprendiz.' });
            }

            // 2. Obtener datos del aprendiz
            const aprendizData = await getAprendizData(aprendizId);

            if (!aprendizData) {
                return res.status(404).send({ message: 'Aprendiz no encontrado.' });
            }

            console.log(aprendizData.nombre) 

            // 3. Obtener los permisos APROBADOS
            const permisosData = await getRecentApprovedPermisos(aprendizData.nombre);

            // 4. 💡 CORRECCIÓN 2: Procesar los permisos para OBTENER LA FIRMA EN BASE64
            const permisosWithBase64 = await Promise.all(
                permisosData.map(async (permiso) => {
                    
                    // --- PASO 1: Obtener ID del instructor a partir de su nombre ---
                    const instructorId = await getInstructorIdByName(permiso.id_intructor);
                    
                    // --- PASO 2: Obtener URL de la firma con el ID del instructor ---
                    const firmaUrl = await getInstructorSignatureUrl(instructorId); 
                    
                    // --- PASO 3: Obtener Base64 de la firma ---
                    // getImageBase64 recibe la URL de la firma, la resuelve y devuelve Base64 o el placeholder.
                    const firmaBase64 = await getImageBase64(firmaUrl); 

                    return {
                        ...permiso,
                        // Añadimos el contenido Base64 resuelto para el PDF
                        instructor_firma_base64: firmaBase64
                    };
                })
            );

            // 5. Llamar al servicio de generación de PDF con los datos procesados
            const pdfDoc = await generatePermisoPdf(aprendizData, permisosWithBase64); // Se pasa el nuevo array

            // 6. Configurar headers y enviar el PDF
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=PermisoAprendiz_${aprendizId}.pdf`);

            pdfDoc.pipe(res);
            pdfDoc.end();

        } catch (error) {
            console.error('Error generando PDF:', error);
            res.status(500).send({ message: 'Error interno del servidor al generar el PDF.' });
        }
    }

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