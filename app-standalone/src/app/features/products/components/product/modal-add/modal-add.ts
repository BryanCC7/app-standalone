import { Component, Output, EventEmitter, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProductService } from '../../../sevices/product';

@Component({
  selector: 'app-modal-add',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './modal-add.html',
  styleUrl: './modal-add.css'
})
export class ModalAdd {
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();

  private fb = inject(FormBuilder);
  private productService = inject(ProductService);


  formProduct = this.fb.group({
    name: ['', Validators.required],
    code: ['', [Validators.required, Validators.minLength(7)], [this.codeValidator()]],
    date: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(0)]],
    description: ['', Validators.required],
    rating: [0, [Validators.required, Validators.min(1), Validators.max(200)]], 
  });

  codeValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {
      let code = control.value;
      return this.productService.searchProduct(code).pipe(
        map(res => {
          if (res) {
            return { codeExists: true };
          }
          return null;
        })
      );
    };
  }

  saveData() {
    if (this.formProduct.valid) {

      const productData = { ...this.formProduct.value };
      
      const rawRating = Number(productData.rating);
      productData.rating = Math.ceil(rawRating / 40);


      this.save.emit(productData);
      this.ocultarModal();
    }
  }

  ocultarModal(): void {
    this.close.emit();
  }
}