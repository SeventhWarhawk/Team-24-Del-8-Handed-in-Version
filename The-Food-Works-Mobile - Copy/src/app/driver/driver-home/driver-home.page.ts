import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccessService } from 'src/app/services/access.service';
import { DriverService } from 'src/app/services/driver.service';

@Component({
  selector: 'app-driver-home',
  templateUrl: './driver-home.page.html',
  styleUrls: ['./driver-home.page.scss'],
})
export class DriverHomePage implements OnInit {

  isAssigned: boolean;
  driverName: string;

  constructor(private driverService: DriverService, private authService: AccessService, private router: Router) { }

  ngOnInit() {
    this.authService.displayName.subscribe(displayName => {
      if(displayName) {
        this.driverName= displayName;
      }
    });
  }

  ionViewDidEnter() {
    this.checkRoute();
  }

  checkRoute() {
    this.isAssigned = false;
    this.driverService.getRoute().subscribe((res: any) => {
      this.driverService.setWaypointLength(res.length);
      if(res.length > 0){
        this.isAssigned = true;
      }
    });
  }

  doLogout() {
    this.driverService.setLogout();
    this.authService.doLogout();
    this.router.navigateByUrl('shop-location');
  }
}
