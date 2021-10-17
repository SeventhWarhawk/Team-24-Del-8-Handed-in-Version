import { Component, OnInit } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { ICartItem } from 'src/app/interfaces/cart';
import { CustomerService } from 'src/app/services/customer.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {

  cartItems: ICartItem[];
  isCartItems: boolean;
  cartTotal: number;
  isProgress = false;

  constructor(public alert: AlertController, private toast: ToastController, private service: CustomerService) { }

  ngOnInit() {
    this.getCartData();
  }

  getCartData() {
    this.service.getAllCartItems().subscribe((data: any) => {
      this.cartItems = data;
      if(this.cartItems.length > 0){
        this.isCartItems = true;
      } else {
        this.isCartItems = false;
      }

      this.cartTotal = 0;
      this.cartItems.forEach(element => {
        this.cartTotal += (element.productPrice * element.quantity);
      });
    });
  }

  async presentDeleteItemAlert(productID: any) {
    const alert = await this.alert.create({
      cssClass: 'my-custom-class',
      header: 'Removal Confirmation',
      message: 'Are you sure you want to remove this item from your cart?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Remove',
          handler: () => {
            this.isProgress = true;
            this.service.removeItem(productID).subscribe(res => {
              this.isProgress = false;
              this.presentClearSuccessToast();
              this.getCartData();
            }, error => {
              this.presentFailToast();
            });
          }
        }
      ]
    });

    await alert.present();
  }

  async clearCartAlert() {
    const alert = await this.alert.create({
      cssClass: 'my-custom-class',
      header: 'Clear Confirmation',
      message: 'Are you sure you want to clear your cart?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Clear',
          handler: () => {
            this.isProgress = true;
            this.service.clearCart().subscribe(res => {
              this.isProgress = false;
              this.presentClearSuccessToast();
              this.getCartData();
            }, error => {
              this.presentFailToast();
            });
          }
        }
      ]
    });

    await alert.present();
  }

  async presentRemoveSuccessToast() {
    const toast = await this.toast.create({
      header: 'Success!',
      message: 'Item(s) removed your cart.',
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

  async presentClearSuccessToast() {
    const toast = await this.toast.create({
      header: 'Success!',
      message: 'Items cleared from your cart.',
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
