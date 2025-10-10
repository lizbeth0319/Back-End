import mongoose from "mongoose";

const { Schema, model } = mongoose;

const UserSchema = new Schema({
    nombre: { 
        type: String, 
        required: true 
    },
    email: {
    type: String, 
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/, 'Correo no válido.'] 
},
    password_hash: { 
        type: String, 
        required: true, 
        minlength: [8, 'La contraseña debe tener mínimo 8 caracteres'] 
    },
    rol: {
        type: String,
        enum: ['aprendiz', 'enfermeria', 'instructor', 'porteria'], 
        required: true
    },
    firma_url: {
        type: String,
        default: null,
    },
    cloudinary_id: {
        type: String,
        default: null,
    }
});

const User = model('User', UserSchema);
export default User;