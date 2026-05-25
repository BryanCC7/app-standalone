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
}
