import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';

export class AuthController {
  static async register(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, name } = req.body;

      if (!email || !password || !name) {
        res.status(400).json({ message: 'Todos los campos son obligatorios.' });
        return;
      }

      const result = await AuthService.register({ email, password, name });
      res.status(201).json({ message: 'Usuario registrado con éxito', ...result });
    } catch (error: any) {
      res.status(400).json({ message: error.message || 'Error en el registro' });
    }
  }

  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ message: 'Email y contraseña requeridos.' });
        return;
      }

      const result = await AuthService.login({ email, password });
      res.status(200).json({ message: 'Inicio de sesión exitoso', ...result });
    } catch (error: any) {
      res.status(401).json({ message: error.message || 'Error de autenticación' });
    }
  }
}