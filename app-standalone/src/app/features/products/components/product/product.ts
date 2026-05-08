import { Component, signal, computed, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../sevices/product';
import { ProductList } from './product-list/product-list';
import { ModalAdd } from './modal-add/modal-add';
import { IProduct } from '../../interfaces/product';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [ModalAdd, ProductList, FormsModule],
  templateUrl: './product.html',
  styleUrl: './product.css'
})
export class ProductComponent implements OnInit {
  isModalOpen = signal(false);
  listFilter = signal('');
  showChildren = signal(true);

  constructor(public productService: ProductService) {}

  ngOnInit(): void {
    this.productService.getProducts().subscribe();
  }

  filteredProducts = computed(() =>
    this.productService.products().filter(p =>
      p.productName.toLowerCase().includes(this.listFilter().toLowerCase())
    )
  );

  toggleChildren(): void {
    this.showChildren.update(val => !val);
  }

  abrirModal() {
    this.isModalOpen.set(true);
  }

  cerrarModal() {
    this.isModalOpen.set(false);
  }
}