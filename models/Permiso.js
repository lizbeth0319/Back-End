import mongoose from 'mongoose';
const { Schema, model, ObjectId } = mongoose;
import Aprendiz from './aprendiz.js'
import User from './user.js';
const PermisoSchema = new Schema({
    //id
    id_aprendiz: { type: String, ref: 'Aprendiz', required: true },//nmbrea aprendiz
    //datos del aprendiz?=  
    enfermera: { type: String, ref: 'Enfermeria', required: true },
    fecha_solicitud: { type: Date, default: Date.now },
    motivo: { type: String, required: true },
    estado: { type: String, enum: ['pendiente', 'aprobado', 'rechazado'], default: 'pendiente' },
    id_intructor: { type: String, required: true}, //nombre
    competencia:{ type: String, required: true} ,
    hora:{type: String, required: true}
});

const Permiso = model('Permiso', PermisoSchema);

export default Permiso;