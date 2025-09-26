import User from '../models/user.js';
import bcrypt from 'bcryptjs';


const helpersAuthentication = {
    // helpers/Authentication.js

    validarEmail: async (email) => {
        if (!email) throw new Error('El email es requerido');
        // ... lógica de validación de formato ...

        console.log('1. Intentando buscar email:', email); // 👈 Primer log

        const existeEmail = await User.findOne({ email }); // LA LÍNEA BLOQUEANTE

        console.log('2. Consulta a BD finalizada.'); // 👈 Segundo log (Si no se ve, la consulta se colgó)

        if (existeEmail) {
            throw new Error(`El correo ${email} ya está registrado`);
        }
    },
    validarNombre: (name) => {
        if (!name) throw new Error('El nombre es requerido');
        if (name.length < 2 || name.length > 30) {
            throw new Error('El nombre debe tener entre 2 y 30 caracteres');
        }
        return true;
    },
    validarPassword: (password) => {
        if (!password) throw new Error('La contraseña es requerida');
        if (password.length < 8) throw new Error('La contraseña debe tener mínimo 8 caracteres');
        return true;
    },
    validarRol: async (rol) => {
        const rolesValidos = ["aprendiz", "enfermeria", "instructor", "porteria"];
        console.log(rol);
        if (!rol) {
            throw new Error('El rol es requerido.');
        }
        const rolLimpio = rol.trim().toLowerCase();

        if (!rolesValidos.includes(rolLimpio)) {
            throw new Error(`El rol '${rol}' no es válido. Los roles permitidos son: ${rolesValidos.join(', ')}`);
        }

    },
    validarEmailLogin: async (email) => {
        if (!email) throw new Error('El email es requerido');
        if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/i.test(email)) {
            throw new Error('El correo debe ser @gmail.com');
        }
        return true;
    },
    // helpers/Authentication.js

    verificarCredenciales: async (email, password) => {
        const usuario = await User.findOne({ email });
        if (!usuario) throw new Error('Credenciales inválidas');

        // 💡 CAMBIA 'usuario.password' por 'usuario.password_hash'
        const validaPassword = await bcrypt.compare(password, usuario.password_hash);

        if (!validaPassword) throw new Error('Credenciales inválidas');

        return usuario;
    }
}
export default helpersAuthentication;