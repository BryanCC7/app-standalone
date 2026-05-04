import { Component, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { switchMap } from 'rxjs';
import { IProduct } from '../../interfaces/product';
import { Product as ProductService} from '../../services/product';
import { ProductList } from './product-list/product-list';
import { ModalAdd } from './modal-add/modal-add';

@Component({
  selector: 'app-product',
  imports: [],
  templateUrl: './product.html',
  styleUrl: './product.css',
})
export class Product {}
