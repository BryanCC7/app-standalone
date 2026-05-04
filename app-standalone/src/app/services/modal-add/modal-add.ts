import { Component, output } from '@angular/core';

@Component({
  selector: 'app-modal-add',
  imports: [],
  templateUrl: './modal-add.html',
  styleUrl: './modal-add.css',
})
export class ModalAdd {
  close = output<void>();

  ocultarModal(){
    this.close.emit();
  }
}
