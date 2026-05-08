import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IProduct } from '../interfaces/product';
import { Observable, timer, of } from 'rxjs';
import { map, tap, switchMap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private http = inject(HttpClient);
  private url = 'http://localhost:3000/productos';

  products = signal<IProduct[]>([]);

  getProducts(): Observable<IProduct[]> {
    return this.http.get<any>(this.url).pipe(
      map(res => res.productos),
      tap(prods => this.products.set(prods))
    );
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }

  saveProduct(product: IProduct): Observable<any> {
    return this.http.post(this.url, product);
  }

  searchProduct(code: string): Observable<any> {
    return timer(1000).pipe(switchMap(() => {
      return this.http.get<any>(`http://localhost:3000/existeproducto/${code}`).pipe(
        map((resp: any) => resp.data),
        catchError(() => of(null))
      );
    }));
  }

  generateProductCode(): string {
    return 'PROD-' + Math.random().toString(36).substring(2, 7).toUpperCase();
  }
}