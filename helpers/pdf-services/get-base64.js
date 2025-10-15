// Archivo: ./helpers/pdf-services/get-base64.js

import axios from 'axios';
import { Buffer } from 'node:buffer'; // Asegúrate de tener Buffer importado si estás en ESM, aunque en Node.js a veces está global.

// Base64 de un pixel GIF transparente (válido para pdfmake)
const EMPTY_BASE64_IMAGE = 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==';

export async function getImageBase64(url) {
    if (!url || typeof url !== 'string' || url.length < 10) { 
        console.warn('URL de imagen no proporcionada o es nula. Usando placeholder vacío.');
        return EMPTY_BASE64_IMAGE; // <-- Asegura que se devuelva el string completo
    }
    
    try {
        const response = await axios.get(url, {
            responseType: 'arraybuffer'
        });
        
        // 2. Convierte el buffer de la imagen a Base64
        const base64Image = Buffer.from(response.data, 'binary').toString('base64');
        
        // 💡 CRÍTICO: Asegura que el resultado de una descarga exitosa también tenga el prefijo MIME type
        return `data:${response.headers['content-type']};base64,${base64Image}`;
        
    } catch (error) {
        console.error(`Error al descargar la imagen desde ${url}. Estado: ${error.response?.status || 'N/A'}. Usando placeholder.`);
        return EMPTY_BASE64_IMAGE;
    }
}