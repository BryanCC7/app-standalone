import { Component, computed, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { IProduct } from './product';
import { ProductList } from "./product/product-list/product-list";
import { FormsModule } from '@angular/forms';
import { ModalAdd } from './services/modal-add/modal-add';

import { switchMap } from 'rxjs/operators';

import { Product } from './product/product'

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ProductList, FormsModule, ModalAdd],
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


  crearProducto() {
    let datos: any = {
      name: `Producto Nuevo ${Math.round(Math.random()* (100 - 1) + 1 )}` ,
      code: this.productService.generateProductCode(),
      date: '2024-01-01',
      price: Math.round(Math.random ()* (40000 - 10000) + 100000 ) ,
      description: 'Descripción del producto nuevo',
      rate: Math.round(Math.random( )* (200 - 1) + 1 ) ,
      image: 'gamuza_hush.jpg'
    }
    this.guardarProducto (datos);
  }

  guardarProducto(product: IProduct){
    console.log('Guardando producto: ', product);
    this.productService.saveProducts(product).pipe(
      switchMap(()=> this.productService.getProducts())
    ).subscribe(products =>  this.products.set(products))
  }

  isModalOpen = signal(false);
  
  abrirModal(){
    console.log('Abriendo modal...');
    this.isModalOpen.set(true);
    console.log(this.isModalOpen);
  }

  cerrarModal(){
    console.log('Cerrando Modal...');
    this.isModalOpen.set(false);
  }





}

