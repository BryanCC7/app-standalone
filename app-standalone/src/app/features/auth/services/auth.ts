import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  public isAutenticated = signal<boolean>(false);
  private http = inject(HttpClient);
  private router = inject(Router);

  private apiUrl = 'http://localhost:3000';

  constructor(){
    this.isAutenticated.set(!!localStorage.getItem('token'));
  }
  
  login(email: string, password: string) {
    let userLogin = { email: email, password: password };
    return this.http.post(`http://localhost:3000/login`, userLogin).pipe(
      map((resp: any) => {
        console.log('Login successful:', resp);
        localStorage.setItem('token', resp.token);
        localStorage.setItem('usuario', JSON.stringify(resp.usuario));
        this.isAutenticated.set(true); // Actualizar el estado de autenticación
        this.router.navigate(['/home']);
      }));
  }

  public logout(){
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    this.isAutenticated.set(false); //Actualizar el estado de autenticación
    this.router.navigate(['/login']);
  }

  public loginGoogle(token: string) {
    const header = { 'Content-Type': 'application/json' };
    
    // 📍 CORREGIDO: El backend Node.js que arreglamos antes espera recibir 'googletoken', no 'token'
    let googleToken = { googletoken: token }; 

    // 📍 CORREGIDO: Las comillas invertidas (backticks) del string ahora se cierran correctamente
    return this.http.post(`${this.apiUrl}/google-login`, googleToken, { headers: header }).pipe(
      map((resp: any) => {
        console.log('Login with Google successful:', resp);
        localStorage.setItem('token', resp.token);
        localStorage.setItem('usuario', JSON.stringify(resp.usuario));
        this.isAutenticated.set(true);
        this.router.navigate(['/home']);
      })
    );
  }
}
