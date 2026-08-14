import { prisma } from '../config/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


export class AuthService {
  /**
   * Registrar un nuevo usuario en la base de datos
   */
  static async register(data: { email: string; password: string; name: string }) {
    // 1. Verificar si el usuario ya existe por su correo
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new Error('El correo electrónico ya está registrado.');
    }

    // 2. Encriptar la contraseña (hash)
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // 3. Crear el usuario en PostgreSQL
    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.name,
      },
    });

    // 4. Generar el token JWT
    const token = this.generateToken(user.id, user.email, user.role);

    // 5. Retornar el usuario (sin la contraseña) y el token
    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      token,
    };
  }

  /**
   * Iniciar sesión verificando credenciales
   */
  static async login(data: { email: string; password: string }) {
    // 1. Buscar al usuario por correo
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new Error('Credenciales incorrectas.');
    }

    // 2. Comparar la contraseña ingresada con la encriptada
    const isMatch = await bcrypt.compare(data.password, user.password);

    if (!isMatch) {
      throw new Error('Credenciales incorrectas.');
    }

    // 3. Generar el token JWT
    const token = this.generateToken(user.id, user.email, user.role);

    // 4. Retornar la información básica del usuario y el token
    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      token,
    };
  }

  /**
   * Método auxiliar para firmar tokens JWT
   */
  private static generateToken(userId: string, email: string, role: string): string {
    const secret = process.env.JWT_SECRET || 'secretKey';
    return jwt.sign({ sub: userId, email, role }, secret, { expiresIn: '1d' });
  }
}