import { Component, computed, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { IProduct } from './product';
import { ProductList } from "./product/product-list/product-list";
import { FormsModule } from '@angular/forms';

import { Product } from './product/product'

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ProductList, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

  constructor(private productService: Product){
    console.log('Padre: constructor');
  }
  ngOnInit(): void{
    this.productService.getProducts().subscribe((products: IProduct[])=>{
      this.products.set(products);
      console.log(this.products());
    });
  }
  ngOnChanges(): void{
    console.log('Padre: ngOnChanges');
  }
  ngOnDestroy(): void{
    console.log('Padre: ngOnDestroy');
  }
  datoRecibido = signal<any>('');
  

  showChildren = signal(true);
  toggleChildren(): void {
    this.showChildren.update(value=> !value);
  }

  protected readonly title = signal('EMPRESAS ACME');
  listFilter = signal('');

  products = signal<IProduct[]>([]);

  filteredProducts = computed(() =>
    this.products().filter(p =>
      p.productName.toLowerCase().includes(this.listFilter().toLowerCase())
    )
  );
}

