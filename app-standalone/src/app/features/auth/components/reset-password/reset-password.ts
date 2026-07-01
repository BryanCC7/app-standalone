import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Auth } from '../../services/auth';

export function passwordsMatchValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password');
    const confirm = control.get('confirmPassword');
    if (password && confirm && password.value !== confirm.value) {
      return { passwordsMismatch: true };
    }
    return null;
  };
}

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css'
})
export class ResetPassword implements OnInit {
  private formBuilder = inject(FormBuilder);
  private authService = inject(Auth);
  private route = inject(ActivatedRoute);

  mensaje = '';
  exito = false;
  token = '';

  resetForm = this.formBuilder.group({
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]]
  }, { validators: passwordsMatchValidator() });

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParams['token'] || '';
    if (!this.token) {
      this.mensaje = 'Token no válido. Solicita un nuevo enlace.';
    }
  }

  onSubmit(): void {
    if (this.resetForm.invalid || !this.token) return;
    const password = this.resetForm.value.password!;
    this.authService.resetPassword(this.token, password).subscribe({
      next: (resp: any) => {
        this.mensaje = resp.mensaje;
        this.exito = true;
      },
      error: (err) => {
        this.mensaje = err.error?.mensaje || 'Error al restablecer la contraseña.';
      }
    });
  }
}
