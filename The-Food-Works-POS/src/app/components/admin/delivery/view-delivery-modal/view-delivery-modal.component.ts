import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DeliveryService } from 'src/app/services/delivery.service';

@Component({
  selector: 'app-view-delivery-modal',
  templateUrl: './view-delivery-modal.component.html',
  styleUrls: ['./view-delivery-modal.component.scss']
})
export class ViewDeliveryModalComponent implements OnInit {

  delivery: any;

  constructor(private service: DeliveryService, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.service.getViewDelivery(this.data).subscribe(res => {
      this.delivery = res;
    });
  }

}
