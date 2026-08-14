import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  // Control de estado para cambiar entre Iniciar Sesión y Registrarse
  isRegisterMode = false;

  // Formulario
  name = '';
  email = '';
  password = '';

  // Mensajes de feedback
  errorMessage = '';
  loading = false;

  toggleMode(): void {
    this.isRegisterMode = !this.isRegisterMode;
    this.errorMessage = '';
  }

  onSubmit(): void {
    if (!this.email || !this.password || (this.isRegisterMode && !this.name)) {
      this.errorMessage = 'Por favor completa todos los campos requeridos.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    if (this.isRegisterMode) {
      this.authService.register({ name: this.name, email: this.email, password: this.password }).subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/dashboard']);
        },
        error: (err: any) => {
          this.loading = false;
          this.errorMessage = err.error?.message || 'Error al procesar la solicitud.';
      }
      });
    } else {
      this.authService.login({ email: this.email, password: this.password }).subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.loading = false;
          this.errorMessage = err.error?.message || 'Credenciales incorrectas.';
        }
      });
    }
  }
}