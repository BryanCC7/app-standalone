import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'
import { Auth } from '../../services/auth'
import { email } from '@angular/forms/signals';
import { SocialAuthService, GoogleSigninButtonModule, SocialUser } from '@abacritt/angularx-social-login';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, GoogleSigninButtonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private formBuilder  = inject(FormBuilder);
  private loginService = inject(Auth);
  private socialAuthService = inject(SocialAuthService);

  ngOnInit(): void {
    this.socialAuthService.authState.subscribe((user: SocialUser | null) => {
      if (user) {
        this.loginService.loginGoogle(user.idToken!).subscribe({
          next: (data) => {
            console.log('Google login successful:', data);
          },
          error: (err) => {
            // 📍 Añadido: Manejo de errores por si falla la conexión con tu backend
            console.error('Error al intentar hacer login con Google en el backend:', err);
          }
        });
      }
    });
  }

  loginForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required, Validators.minLength(10)]
  });
  
  login() {
    let email: any = this.loginForm.value.email;
    let password: any = this.loginForm.value.password;
    this.loginService.login(email, password).subscribe(
      data => {
        console.log('Login successful:', data);
      }
    );
  }
}