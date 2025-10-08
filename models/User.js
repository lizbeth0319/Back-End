import mongoose from "mongoose";

const { Schema, model, ObjectId } = mongoose;

const UserSchema = new Schema({
    //id
    nombre: { type: String, required: true },
    email: {
        type: String, 
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)@\w+([.-]?\w+)(\.\w{2,3})+$/, 'Correo no válido.']
    },
    password_hash: { type: String, required: true, minlength: 8 },
    rol: {
        type: String,
        num: ['aprendiz', 'enfermeria', 'instructor', 'porteria'],
        required: true
    },
    firma_url: {
        type: String,
        default: null,
    },
    // 💡 Opcional: Guardar el ID público de Cloudinary para facilitar la eliminación o actualización
    cloudinary_id: {
        type: String,
        default: null,
    }
});
const User = model('User', UserSchema);
export default User;
