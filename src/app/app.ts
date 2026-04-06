import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Product } from './product';
import { ProductList } from "./product/product-list/product-list";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ProductList],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('EMPRESAS ACME');

  products: Product[] = [
    {
      productId: 1,
      productName: 'Mini Consola Nintendo NES Edición Clásica',
      productCode: 'NIN-001',
      releaseDate: '2022-12-20',
      description: 'Nueva Sin Abrir con 30 juegos Stock EE. UU.',
      price: 70000,
      starRating: 5.0,
      imageUrl: 'nes.png'
    },
    {
      productId: 2,
      productName: 'Nokia 110 4G (2024)',
      productCode: 'NOK-001',
      releaseDate: '2024-01-05',
      description: 'Combinando llamadas de calidad HD y un impresionante revestimiento cerámico, es sencillamente un placer para los sentidos.',
      price: 120000,
      starRating: 4.0,
      imageUrl: 'nokia.png'
    },
    {
      productId: 3,
      productName: 'Mando Inalámbrico Microsoft para Xbox Series X/S',
      productCode: 'XBO-001',
      releaseDate: '2020-10-30',
      description: 'Negro Carbono. Probado sin caja.',
      price: 40000,
      starRating: 3.9,
      imageUrl: 'xbox.png'
    }
  ]
}

