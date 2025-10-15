// helpers/pdf-services/pdf-template.js

// No es necesario importar getImageBase64 aquí, ya que el controller la llama.

// 🎯 Placeholder Base64 robusto para el logo del SENA (1x1 pixel PNG transparente)
// Usamos esto para evitar el error 404 del logo externo y el error de formato 'Invalid image'.
const SENA_LOGO_PLACEHOLDER_PNG_BASE64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='; 


export async function getPdfTemplate(datosAprendiz, registroPermisos) {

    // El logo ya tiene el prefijo de datos.
    const logoBase64 = SENA_LOGO_PLACEHOLDER_PNG_BASE64; 

    // Función de tabla síncrona, ya que el Base64 se resolvió en el controlador.
    const tablaBody = (() => {
        const headerRow = [
            { text: 'FECHA', bold: true, alignment: 'center' },
            { text: 'COMPETENCIA', bold: true, alignment: 'center' },
            { text: 'MOTIVO', bold: true, alignment: 'center' },
            { text: 'HORA', bold: true, alignment: 'center' },
            { text: 'AUTORIZACIÓN (Firma)', bold: true, alignment: 'center' }
        ];

        // Mapeo SÍNCRONO (se usa el Base64 ya resuelto: instructor_firma_base64)
        const dataRows = registroPermisos.map((permiso) => {
            
            // ✅ Formatear la fecha para que sea un string válido.
            const fechaFormateada = new Date(permiso.fecha_solicitud).toLocaleDateString('es-CO');
            
            const firmaElement = {
                // 💡 CRÍTICO: Usamos el Base64 ya resuelto por el controlador.
                image: permiso.instructor_firma_base64,
                width: 50,
                height: 20
            };
            
            return [
                fechaFormateada,     
                permiso.competencia, 
                permiso.motivo,      
                permiso.hora,        
                firmaElement         
            ];
        });
        
        return [headerRow, ...dataRows];
    })(); 
    // --- FIN CÁLCULO DE TABLA ---

    return {
        // --- Configuraciones de Página ---
        pageSize: 'LETTER',
        pageMargins: [40, 60, 40, 60],
        
        content: [
            // --- Encabezado basado en la imagen (usando una tabla) ---
            {
                style: 'headerTable',
                table: {
                    widths: ['15%', '60%', '25%'],
                    heights: [60],
                    body: [
                        [
                            // CELDA 1: Logo
                            {
                                image: logoBase64, // 💡 Usa el Base64 hardcodeado/placeholder
                                width: 50, 
                                height: 50, 
                                alignment: 'center',
                                margin: [0, 5, 0, 0]
                            },
                            // CELDA 2: Títulos Centrales
                            {
                                stack: [
                                    { text: "SERVICIO NACIONAL DE APRENDIZAJE SENA", fontSize: 10, alignment: 'center', bold: true, margin: [0, 0, 0, 2] },
                                    { text: "SISTEMA INTEGRADO DE GESTION Y AUTOCONTROL - SIGA", fontSize: 9, alignment: 'center' },
                                    { text: "PROCESO GESTION DE FORMACIÓN PROFESIONAL INTEGRAL", fontSize: 9, alignment: 'center' },
                                    { text: "EJECUCIÓN DE LA FORMACIÓN PROFESIONAL INTEGRAL", fontSize: 9, alignment: 'center' },
                                    { text: "PERMISO DE APRENDICES", fontSize: 10, alignment: 'center', bold: true, margin: [0, 5, 0, 0] }
                                ],
                                alignment: 'center',
                                fillColor: '#FFFFFF'
                            },
                            // CELDA 3: Documento de Apoyo
                            {
                                table: {
                                    widths: ['*'],
                                    body: [
                                        [{ text: "Documento de Apoyo\nNo. Controlado N° 17", alignment: 'center', fontSize: 8, margin: [0, 2, 0, 2], bold: true }],
                                        [{ text: "Versión 01", alignment: 'center', fontSize: 8, bold: true, margin: [0, 2, 0, 2] }],
                                        [{ text: "Fecha actualización\n03/02/2022", alignment: 'center', fontSize: 8, bold: true, margin: [0, 2, 0, 2] }],
                                    ]
                                },
                                layout: 'lightLinesAndNoBorder'
                            }
                        ]
                    ]
                },
                layout: {
                    hLineWidth: function (i, node) { return 1; },
                    vLineWidth: function (i, node) { return 1; },
                    hLineColor: function (i, node) { return 'black'; },
                    vLineColor: function (i, node) { return 'black'; },
                },
                margin: [0, 0, 0, 20]
            },

            // --- Títulos y Datos del Aprendiz (Datos dinámicos) ---
            { text: "PERMISO DE APRENDICES", style: "header", fontSize: 18, alignment: 'center', margin: [0, 0, 0, 20] },
            { text: "PERMISOS", style: "header", fontSize: 12, alignment: 'left', margin: [0, 0, 0, 5] },
            { text: "Usted puede solicitar permiso para:", margin: [0, 0, 0, 5] },
            {
                ul: [
                    "Asistir a Citas médicas y odontológicas - comprobadas",
                    "Calamidad domestica comprobada",
                    "Trámites Etapa Productiva"
                ],
                margin: [20, 0, 0, 15]
            },
            { text: "Libreta de permisos", style: "header", fontSize: 12, margin: [0, 0, 0, 10] },

            // Datos del Aprendiz
            { text: `NOMBRE: ${datosAprendiz.nombre}`, margin: [0, 0, 0, 5] },
            { text: `FICHA: ${datosAprendiz.ficha}`, margin: [0, 0, 0, 5] }, 
            { text: `PROGRAMA: ${datosAprendiz.programa}`, margin: [0, 0, 0, 15] },

            {
                text: "NOTA: El permiso se solicita con anticipación y debe contar con la autorización del instructor de la competencia y visto bueno del Coordinador Académico.",
                fontSize: 9,
                italics: true,
                margin: [0, 0, 0, 15]
            },

            // --- Tabla de Registros de Permisos (Generada dinámicamente) ---
            { text: "Registro de Permisos", style: "header", fontSize: 12, alignment: 'left', margin: [0, 0, 0, 5] },
            {
                style: 'tableExample',
                table: {
                    headerRows: 1,
                    widths: ['15%', '25%', '30%', '10%', '20%'],
                    body: tablaBody, // ⬅️ Filas generadas dinámicamente
                },
                layout: 'lightHorizontalLines'
            },

            { text: "\n\nVoBo Coordinador Académico: __________________________________", alignment: 'right', margin: [0, 30, 0, 0], fontSize: 10 }
        ],
        styles: {
            tableExample: {
                margin: [0, 5, 0, 15]
            },
            headerTable: {

            },
            header: {
                bold: true,
                alignment: 'center'
            }
        }
    };
}