import Permiso from "../models/Permiso.js";
import User from "../models/User.js";
import Aprendiz from "../models/Aprendiz.js";
import nodemailer from "nodemailer";
import "dotenv/config";

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587, 
    secure: false, // Ahora es false para usar STARTTLS

    auth: {
        user: process.env.CORREO_USER,
        pass: process.env.PASS_USER,
    },
});
/* function generateSecureToken() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
} // 💡 ESTA FUNCIÓN YA NO SE NECESITA SI NO USAS TOKENS
 */

export async function sendPermisoEmail(data) {
    // Desestructurar datos de entrada
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

    const BASE_URL ="http://localhost:3000"; 
    
    // 💡 ENLACES CORREGIDOS: Solo usan el ID del permiso
    const linkAprobar = `${BASE_URL}/api/permiso/permisos/aprobar/${permisoId}`;
    const linkRechazar = `${BASE_URL}/api/permiso/permisos/rechazar/${permisoId}`;
    
    console.log(linkRechazar);
    console.log(linkAprobar);
    
    const htmlContent = ` 
        <html>
            <body>
                <h2>🔔 Solicitud de Permiso Pendiente (ID: ${permisoId})</h2>
                <p>Estimado(a) Instructor(a) **${instructorName || 'designado'}**:</p>
                <p>La enfermera ha generado una solicitud de permiso de salida para el Aprendiz **${aprendizName}**.</p>
                <p><strong>Motivo:</strong> ${motivo || 'No especificado'}</p>
                <p>Por favor, proceda a autorizar o denegar la solicitud haciendo clic en uno de los botones:</p>

                <div style="margin-top: 30px;">
                    <a href="${linkAprobar}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-align: center; text-decoration: none; display: inline-block; border-radius: 5px; margin-right: 15px;">
                        ✅ APROBAR PERMISO
                    </a>
                    <a href="${linkRechazar}" style="background-color: #f44336; color: white; padding: 10px 20px; text-align: center; text-decoration: none; display: inline-block; border-radius: 5px;">
                        ❌ RECHAZAR PERMISO
                    </a>
                </div>
                <p style="margin-top: 50px; font-size: 0.8em; color: #777;">Si el enlace no funciona, copie y pegue el link de aprobación en su navegador: ${linkAprobar}</p>
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

        console.log(`Correo enviado. Message ID: ${info.messageId}`);
        // 💡 RETORNO CORREGIDO: Ya no retorna tokens, solo info.
        return { info: info, tokens: { aprobacion: '', rechazo: '' } }; 
    } catch (error) {
        console.error("Error al enviar correo con Nodemailer:", error);
        throw new Error("Fallo al enviar la notificación por correo."); 
    }
}
// Exportamos solo la función de envío
// NOTA: El objeto controllersEstadoPermiso y las importaciones de modelos 
// deben ir en el archivo del controlador.