import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IProduct } from '../../products/interfaces/product';

export interface SaleDataItem {
  name: string;
  value: number;
}

@Injectable({
  providedIn: 'root',
})
export class ProductSalesAnalytics {
  saleData = signal<SaleDataItem[]>([]);

  constructor(private http: HttpClient) {}

  getMockSalesData(): SaleDataItem[] {
    return [
      { name: 'Lunes', value: 1200500 },
      { name: 'Martes', value: 1150000 },
      { name: 'Miércoles', value: 1300000 },
      { name: 'Jueves', value: 850000 },
      { name: 'Viernes', value: 1450000 },
      { name: 'Sábado', value: 2100000 },
      { name: 'Domingo', value: 1950000 },
    ];
  }

  getTopRatedProducts(): Observable<SaleDataItem[]> {
    let token = localStorage.getItem('token') || '';
    return this.http.get<IProduct[]>(
      'http://localhost:3000/productos',
      { headers: { 'Authorization': `Bearer ${token}` } }
    ).pipe(
      map((resp: any) => {
        const products: IProduct[] = resp.productos || resp;
        return products
          .sort((a, b) => b.starRating - a.starRating)
          .slice(0, 5)
          .map(p => ({
            name: p.productName,
            value: p.starRating
          }));
      })
    );
  }
}
