import { Component, OnInit } from '@angular/core';
import { CustomerService } from 'src/app/services/customer.service';
import { IProduct } from 'src/app/interfaces/product';
import { ModalController, ToastController } from '@ionic/angular';
import { AddToCartPage } from '../modals/add-to-cart/add-to-cart.page';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
@Component({
  selector: 'app-view-product',
  templateUrl: './view-product.page.html',
  styleUrls: ['./view-product.page.scss'],
})
export class ViewProductPage implements OnInit {

  product: IProduct;
  isAdding: boolean;

  constructor(private service: CustomerService, public modal: ModalController, public toast: ToastController, private router: Router) { }

  ngOnInit() {
    this.isAdding = false;
    this.service.getProduct().subscribe((data: any) => {
      this.product = data;
    });
  }

  async presentModal() {
    const modal = await this.modal.create({
      component: AddToCartPage,
      swipeToClose: true,
      componentProps: {
        productID: this.product.productID,
        productName: this.product.productName,
        price: this.product.productPrice
      }
    });
    modal.onDidDismiss().then((isClose) => {
      if(!isClose.data){
        this.isAdding = true;
        this.service.addToCart().subscribe(res => {
          this.isAdding = false;
          this.presentSuccessToast();
        }, (error: HttpErrorResponse) => {
          console.log(error.status);
          this.isAdding = false;
          this.presentFailToast();
        });
      }
    });
    return await modal.present();
  }

  async presentSuccessToast() {
    const toast = await this.toast.create({
      header: 'Success!',
      message: 'Item(s) added to your cart.',
      position: 'top',
      color: 'success',
      duration: 2000,
      buttons: [{
          text: 'Close',
          role: 'close',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    await toast.present();
  }

  async presentFailToast() {
    const toast = await this.toast.create({
      header: 'Oops!',
      message: 'Something went wrong.',
      position: 'top',
      color: 'danger',
      duration: 2000,
      buttons: [{
          text: 'Close',
          role: 'close',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    await toast.present();
  }
}
