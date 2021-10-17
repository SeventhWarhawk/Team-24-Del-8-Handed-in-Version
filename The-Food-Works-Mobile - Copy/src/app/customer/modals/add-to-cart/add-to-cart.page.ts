import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { CustomerService } from 'src/app/services/customer.service';

@Component({
  selector: 'app-add-to-cart',
  templateUrl: './add-to-cart.page.html',
  styleUrls: ['./add-to-cart.page.scss'],
})
export class AddToCartPage implements OnInit {

  @Input() price: number;
  @Input() productName: string;

  addForm: FormGroup;
  quant: any;
  cartLinePrice: any;

  constructor(private fb: FormBuilder, private modal: ModalController, private service: CustomerService) { }

  ngOnInit() {
     // formbuilder formgroup and form validation
    this.addForm = this.fb.group({
      quantity: ['', []],
    });
    this.quant = 1;
    this.cartLinePrice = this.calculatePrice();
    this.service.setQuantity(1);
  }

  dismissModal(isClose: boolean) {
    this.modal.dismiss(isClose);
  }

  changeQuant(event: any) {
    this.quant = event.detail.value;
    this.cartLinePrice = this.calculatePrice();
    this.service.setQuantity(this.quant);
  }

  calculatePrice() {
    return this.price * this.quant;
  }
}
