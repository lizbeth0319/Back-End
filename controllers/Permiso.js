import Permiso from "../models/Permiso.js";

const Permisocontroller={
    crearPermiso: async (req, res)=>{
        try {
            const { 
            aprendiz,//nombre
            //traer datos aprendiz ?
            enfermera ,
            fecha_solicitud , 
            motivo,
            intructor,//nombre
            competencia,
            hora
        }=req.body 

        const newPermiso=new Permiso({
            id_aprendiz:aprendiz,
            enfermera,
            fecha_solicitud,
            motivo,
            estado:'pendiente',
            id_intructor:intructor,
            competencia,
            hora
        });
        const savePermiso= await newPermiso.save();

        res.status(201).json({
            succes:true,
            message: 'permiso creado listo para autorizar',
            data:savePermiso
        });
        } catch (error) {
            console.error('Error en createPermiso:', error);
            res.status(500).json({
                success: false,
                message: 'Error al crear usuario'
            });
        }
    },
}

export default Permisocontroller;