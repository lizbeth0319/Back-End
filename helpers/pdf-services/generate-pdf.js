// Archivo: ./helpers/pdf-services/generate-pdf.js 

import PdfPrinter from 'pdfmake';
import fonts from './fonts.js'; 
import styles from './styles.js'; 
import { getPdfTemplate } from './pdf-template.js'; 
// Esta función es la única que debe estar definida en este archivo
export async function generatePermisoPdf(datosAprendiz, registroPermisos) {
    
    const templateContent = await getPdfTemplate(datosAprendiz, registroPermisos);

    const docDefinition = {
        ...templateContent, 
        styles: { ...styles, ...templateContent.styles } 
    };
    const printer = new PdfPrinter(fonts);
    const pdfDoc = printer.createPdfKitDocument(docDefinition);

    // 3. Devolver el documento como un stream
    return pdfDoc; 
}