import { Component, Input } from '@angular/core';
import { Product } from '../../product';
import { CommonModule } from '@angular/common';

import { StarComponent } from '../../shared/star/star.component';
import { DatePipe} from '@angular/common';
import { ImagePipe } from '../../shared/image-pipe';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, StarComponent, DatePipe, ImagePipe],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductList {

  constructor() {
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

  
  @Input('datos') products: Product[] = [];

  showImage: boolean = false;

  toggleImage(): void {
    this.showImage = !this.showImage;
  }
}
