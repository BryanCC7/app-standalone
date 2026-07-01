import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css'
})
export class ForgotPassword {
  private formBuilder = inject(FormBuilder);
  private authService = inject(Auth);

  mensaje = '';
  enviado = false;

  forgotForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]]
  });

  onSubmit(): void {
    if (this.forgotForm.invalid) return;
    const email = this.forgotForm.value.email!;
    this.authService.forgotPassword(email).subscribe({
      next: (resp: any) => {
        this.mensaje = resp.mensaje;
        this.enviado = true;
      },
      error: () => {
        this.mensaje = 'Ocurrió un error. Intenta nuevamente.';
      }
    });
  }
}
