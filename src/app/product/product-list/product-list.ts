import { Component, Input } from '@angular/core';
import { Product } from '../../product';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductList {
  @Input('datos') products: Product[] = [];

  showImage: boolean = false;

  toggleImage(): void {
    this.showImage = !this.showImage;
  }
}
