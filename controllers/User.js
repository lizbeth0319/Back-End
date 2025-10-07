import User from '../models/User.js'; // Asegúrate de tener la ruta correcta

const UserController = {

    actualizarestadocorreo: async (req, res) => {
        try {
            const { nombre } = req.params;

            // 🛑 CORRECCIÓN: Usar findOneAndUpdate con el criterio de búsqueda 'nombre'
            const updatedUser = await User.findOneAndUpdate(
                { nombre: nombre }, // ✅ Criterio de búsqueda por campo 'nombre'
                [
                    { $set: { estado_correo: { $not: "$estado_correo" } } }
                ],
                { new: true, runValidators: true }
            );

            if (!updatedUser) {
                return res.status(404).json({
                    success: false,
                    msg: `Usuario no encontrado por nombre: ${nombre}.` // Mensaje de error ajustado
                });
            }
            res.status(200).json({
                success: true,
                msg: `Estado de correo actualizado a: ${updatedUser.estado_correo}`,
                data: {
                    id: updatedUser._id,
                    email: updatedUser.email,
                    estado_correo: updatedUser.estado_correo
                }
            });

        } catch (error) {
            console.error('Error al actualizar estado_correo:', error);
        res.status(500).json({ 
            success: false,
            msg: 'Error interno del servidor.' 
        });
    }
}
};

export default UserController;