import { Component, Input, output } from '@angular/core';
import { IProduct } from '../../product';
import { CommonModule } from '@angular/common';

import { StarComponent } from '../../shared/star/star.component';
import { DatePipe} from '@angular/common';
import { ImagePipe } from '../../shared/image-pipe';
import { Product } from '../product';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, StarComponent, DatePipe, ImagePipe],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductList {

  updatedProducts = output<IProduct []>();

  constructor(private productService: Product) {
    console.log('Hijo: constructor');
  }
  ngOnInit(): void {
    console.log('Hijo: ngOnInit');
  }
  ngOnChanges(): void {
    console.log('Hijo: ngOnChanges');
  }
  ngOnDestroy(): void {
    console.log('Hijo: ngOnDestroy');
  }


  @Input('datos') products: IProduct[] = [];

  showImage: boolean = false;

  toggleImage(): void {
    this.showImage = !this.showImage;
  }


  deleteProduct (productId: number) {
    console.log('Borrando producto:', productId);
    this.productService.deleteProduct (productId).pipe(
      switchMap(() => this.productService.getProducts())
    ).subscribe({
      next: (products: IProduct []) => {
      console.log('Llegó un dato');
      console.log('Producto eliminado:', productId);
      this.updatedProducts.emit(products);
      },
      error: (error: any) => {
      console.error('Error al borrar el producto:', error);
      },
      complete: () => console.log('Eliminación de producto completada')
    });
  }

  editProduct(productId: number, product: IProduct) {
    let datos: any = {
      name: `Producto Actualizado ${Math.round(Math.random() * (100 - 1) + 1)}`,
      code: this.productService.generateProductCode(),
      date: '2024-01-01',
      price: Math.round(Math.random() * (40000 -10000) + 10000),
      description: 'Descripción del producto nuevo',
      rate: Math.round(Math.random() * (200-1) + 1),
      image: 'gamuza_hush.jpg'
    }

    this.productService.updateProduct (productId, datos).pipe(
      switchMap(() => this.productService.getProducts())
    ).subscribe({
      next: (products: IProduct []) => {
      console.log('Llegó un dato');
      console.log('Producto actualizado:', productId);
      this.updatedProducts.emit(products);
      },
      error: (error: any) => {
      console.error('Error al actualizar el producto:', error);
      },
      complete: () => console.log('Actualización de producto completada')
    });
  }

  viewProduct(arg0: number){
    throw new Error('Method not implemented.')
  }




}
