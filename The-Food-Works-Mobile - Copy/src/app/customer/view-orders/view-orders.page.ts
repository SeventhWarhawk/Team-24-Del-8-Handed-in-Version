/* eslint-disable max-len */
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IOrders } from 'src/app/interfaces/orders';
import { CustomerService } from 'src/app/services/customer.service';
import { PickerController } from '@ionic/angular';
import { PickerOptions } from '@ionic/core';
import {formatDate} from '@angular/common';

@Component({
  selector: 'app-view-orders',
  templateUrl: './view-orders.page.html',
  styleUrls: ['./view-orders.page.scss'],
})
export class ViewOrdersPage implements OnInit {

  filter: any[] = [
    [
      'All',
      '3 months',
      '6 months'
    ],
    [
      'Being Prepared',
      'Packed',
      'Completed'
    ]
  ];

  numColumns = 2;
  numOptions = 3;
  customPickerOptions: any;
  orders: IOrders[];
  filteredOrders: IOrders[];
  isOrders: boolean;
  currentDate: Date;
  dateFilter: number;

  constructor(private service: CustomerService, private router: Router, private pickerController: PickerController) {
    this.customPickerOptions = {
      buttons: [{
        text: 'Select',
        handler: () => console.log('Clicked Save!')
      }]
    };
  }

  ngOnInit() {
    this.service.getAllOrders().subscribe((data: any) => {
      this.orders = data.reverse();
      console.log(this.orders);
      this.filteredOrders = data;

      if(this.orders.length > 0){
        this.isOrders = true;
      } else {
        this.isOrders = false;
      }
    });

    this.currentDate = new Date();
  }

  onClick(orderID: any){
    this.service.setOrderID(orderID);
    this.router.navigateByUrl('view-order');
  }

  async presentPicker() {
    const options: PickerOptions = {
       buttons: [
        {
          text: 'Reset',
          handler: () => {
            this.filteredOrders = this.orders;
          }
        },
        {
          text: 'Confirm',
          handler: (value: any) => {
            if(value[0].text === 'All') {
              this.filteredOrders = this.orders.filter(zz => zz.orderStatus === value[1].text);
            } else if (value[0].text === '3 months') {
              this.dateFilter = this.currentDate.getMonth() - 3;
              this.filteredOrders = this.orders.filter(zz => zz.orderStatus === value[1].text  && new Date(zz.orderDate).getMonth() >= this.dateFilter);
            } else if (value[0].text === '6 months') {
              this.dateFilter = this.currentDate.getMonth() - 6;
              this.filteredOrders = this.orders.filter(zz => zz.orderStatus === value[1].text && new Date(zz.orderDate).getMonth() >= this.dateFilter);
            }
          }
        }
       ],
       columns: this.getColumns()
    };
    const picker = await this.pickerController.create(options);
    picker.present();
  }

  getColumns(){
    const columns=[];
    for(let i = 0; i < this.numColumns; i++){
        columns.push({
            name:`${i}`,
            options: this.getColumnOptions(i)
        });
    }
    return columns;
  }

  getColumnOptions(columIndex: number){
    const options = [];
    for(let i = 0; i < this.numOptions; i++){
        options.push({
            text: this.filter[columIndex][i % this.numOptions],
            value:i
        });
    }
    return options;
  }
}
