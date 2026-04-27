import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'
import { Injectable } from '@angular/core';
import { IProduct } from '../product';

@Injectable({
  providedIn: 'root',
})
export class Product {


  constructor(private http: HttpClient){}
  getProducts(): Observable<IProduct[]> {
    console.log('Fetching products from API...');
    return this.http.get<IProduct[]>('http://localhost:3000/productos').pipe(map((resp:any)=> resp.productos));
  }

}
