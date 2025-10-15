import vfsFonts from "pdfmake/build/vfs_fonts.js";
const { pdfMake } = vfsFonts;

const fonts = {
    Roboto: {
        normal: 'Helvetica',
        bold: 'Helvetica-Bold',
        italics: 'Helvetica-Oblique',
        bolditalics: 'Helvetica-BoldOblique'
    }
};

export default fonts;