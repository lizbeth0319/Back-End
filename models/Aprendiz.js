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
        match:[/^\w+([.-]?\w+)@\w+([.-]?\w+)(\.\w{2,3})+$/, 'Correo no válido.']
    },
    tipo_programa:{
        type:String,
        enum:['tecnologo','tecnico'],
        require:true
    }

});
const Aprendiz = model('Aprendiz', AprendizSchema);

export default Aprendiz;