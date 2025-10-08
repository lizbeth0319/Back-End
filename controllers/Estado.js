import Permiso from "../models/Permiso";
import User from "../models/User";
import Aprendiz from "../models/Aprendiz";
import nodemailer from "nodemailer";
import "dotenv/config";
function generateSecureToken() {
    // Genera una cadena alfanumérica segura
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}


const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, 

    auth: {
        user: process.env.CORREO_USER, // Reemplazar con process.env.CORREO_USER
        pass: process.env.PASS_USER, // Reemplazar con process.env.PASS_USER (App Password de Google)
    },
});

export async function sendPermisoEmail(data) {
    // Desestructurar datos de entrada:
    const { 
        instructorEmail, 
        instructorName, 
        aprendizName, 
        motivo, 
        permisoId 
    } = data;

    if (!instructorEmail || !permisoId) {
        throw new Error("Datos requeridos incompletos: instructorEmail o permisoId.");
    }
    
    const tokenAprobacion = generateSecureToken();
    const tokenRechazo = generateSecureToken();

    const BASE_URL = "https://back-end-proyect.onrender.com"; 

    // 3. Crear los enlaces de acción
    // NOTA: Asegúrate de que tus rutas de aprobación/rechazo manejen el token y el ID del permiso.
    // Una URL más completa podría ser: 
    // const linkAprobar = `${BASE_URL}/api/permisos/aprobar/${permisoId}/${tokenAprobacion}`;
    const linkAprobar = `${BASE_URL}/api/permisos/aprobar/${tokenAprobacion}`;
    const linkRechazar = `${BASE_URL}/api/permisos/rechazar/${tokenRechazo}`;


    const htmlContent = ` 
        <html>
            <body>
                <h2>🔔 Solicitud de Permiso Pendiente (ID: ${permisoId})</h2>
                <p>Estimado(a) Instructor(a) **${instructorName || 'designado'}**,</p>
                <p>La enfermera ha generado una solicitud de permiso de salida para el Aprendiz **${aprendizName}**.</p>
                <p><strong>Motivo:</strong> ${motivo || 'No especificado'}</p>
                <p>Por favor, revise y proceda a autorizar o denegar la solicitud haciendo clic en una de las opciones a continuación. Esta acción actualizará el estado del permiso automáticamente.</p>

                <div style="margin-top: 30px;">
                    <a href="${linkAprobar}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-align: center; text-decoration: none; display: inline-block; border-radius: 5px; margin-right: 15px;">
                        ✅ APROBAR PERMISO
                    </a>
                    <a href="${linkRechazar}" style="background-color: #f44336; color: white; padding: 10px 20px; text-align: center; text-decoration: none; display: inline-block; border-radius: 5px;">
                        ❌ RECHAZAR PERMISO
                    </a>
                </div>
                <p style="margin-top: 50px; font-size: 0.8em; color: #777;">Si el enlace no funciona, por favor, copie y pegue el link de aprobación en su navegador: ${linkAprobar}</p>
            </body>
        </html>
    `;

    // 5. ENVÍO DEL CORREO
    try {
        const info = await transporter.sendMail({
            from: 'Tu Sistema SENA <yajahiraproj@gmail.com>',
            to: instructorEmail,
            subject: `[PERMISO SENA] Solicitud Pendiente para ${aprendizName}`,
            text: `Permiso para ${aprendizName} pendiente. Aprobación: ${linkAprobar}. Rechazo: ${linkRechazar}`,
            html: htmlContent, 
        }); 

        // 💡 NOTA: Aquí iría la lógica para **GUARDAR los tokens en la base de datos**
        // junto con el permisoId, tokenAprobacion, y tokenRechazo. Esto es CRUCIAL para
        // verificar la autenticidad de la acción al hacer clic en los enlaces.
        console.log(`Tokens generados para Permiso ${permisoId}: Aprobación: ${tokenAprobacion}, Rechazo: ${tokenRechazo}`);

        return info; // Retornamos la info para manejar la respuesta en el controlador
    } catch (error) {
        console.error("Error al enviar correo con Nodemailer:", error);
        // Relanzar el error para que sea capturado por el bloque try-catch del controlador
        throw new Error("Fallo al enviar la notificación por correo."); 
    }
}


const controllersEstadoPermiso={
    aprobarpermiso:async (req, res)=>{
        try {
            
        } catch (error) {
            
        }
    }

};
export default controllersEstadoPermiso;
export { sendPermisoEmail };