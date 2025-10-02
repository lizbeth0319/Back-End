import mongoose from 'mongoose';
const { Schema, model, ObjectId } = mongoose;

const AprendizSchema = new Schema({
    nombre: { type: String, required: true },
    ficha:{ type:String, required:true },  
    programa: { type: String, required: true },
    email: { 
        type: String, 
        required: true, 
        unique: true, 
        trim: true,  
        lowercase: true,
        match: [/^\w+([.-]?\w+)@\w+([.-]?\w+)(\.\w{2,3})+$/, 'Correo no válido.']
    },
    password_hash: { type: String, required: true, minlength: 8 }//areglabe el largor

});
const Aprendiz = model('Aprendiz', AprendizSchema);

export default Aprendiz;