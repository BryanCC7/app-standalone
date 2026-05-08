import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { IProduct } from '../../../interfaces/product';
import { StarComponent } from './star/star.component';
import { DatePipe } from '@angular/common';
import { ImagePipe } from '../../../../../shared/image-pipe';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [StarComponent, DatePipe, ImagePipe],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductList {
  @Input('datos') products: IProduct[] = [];
  
  @Output() viewRequested = new EventEmitter<number>();
  @Output() editRequested = new EventEmitter<{id: number, product: IProduct}>();
  @Output() deleteRequested = new EventEmitter<number>();

  showImage = signal<boolean>(true);

  toggleImage(): void {
    this.showImage.update(value => !value);
  }

  viewProduct(productId: number) {
    this.viewRequested.emit(productId);
  }

  editProduct(productId: number, product: IProduct) {
    this.editRequested.emit({ id: productId, product });
  }

  deleteProduct(productId: number) {
    this.deleteRequested.emit(productId);
  }
}