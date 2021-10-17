import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'The Food Works';

  ngOnInit(): void {
    if (localStorage.getItem('paymentTimer') === null) {
      localStorage.setItem('paymentTimer', '30');
    }
  }
}

