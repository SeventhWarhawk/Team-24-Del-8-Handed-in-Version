/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable quote-props */
import { Component, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MapInfoWindow, MapDirectionsService, MapMarker } from '@angular/google-maps';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DriverService } from 'src/app/services/driver.service';
// import { Geolocation } from '@capacitor/geolocation';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator/ngx';
import { Capacitor } from '@capacitor/core';
import { LocationService } from 'src/app/services/location.service';
import { Plugins } from "@capacitor/core";

// eslint-disable-next-line @typescript-eslint/naming-convention
const { Geolocation} = Plugins;

export interface MapDirectionsResponse {
  status: google.maps.DirectionsStatus;
  result?: google.maps.DirectionsResult;
}

let waypts: google.maps.DirectionsWaypoint[] = [];

@Component({
  selector: 'app-driver-map',
  templateUrl: './driver-map.page.html',
  styleUrls: ['./driver-map.page.scss'],
})
export class DriverMapPage implements OnInit {

  @ViewChild(MapInfoWindow) infoWindow: MapInfoWindow;

  // My variables
  orderID: any;
  address: any;
  waypoints: any;
  posLat: any;
  posLng: any;
  mapRoute: string;
  watchId: any;
  initLoad: boolean;

  // google maps zoom level
  zoom = 12;

  stylesArray: google.maps.MapTypeStyle[] = [
      {
          "featureType": "landscape.natural",
          "elementType": "geometry.fill",
          "stylers": [
              {
                  "visibility": "on"
              },
              {
                  "color": "#e0efef"
              }
          ]
      },
      {
          "featureType": "poi",
          "elementType": "geometry.fill",
          "stylers": [
              {
                  "visibility": "on"
              },
              {
                  "hue": "#1900ff"
              },
              {
                  "color": "#c0e8e8"
              }
          ]
      },
      {
          "featureType": "road",
          "elementType": "geometry",
          "stylers": [
              {
                  "lightness": 100
              },
              {
                  "visibility": "simplified"
              }
          ]
      },
      {
          "featureType": "road",
          "elementType": "labels",
          "stylers": [
              {
                  "visibility": "off"
              }
          ]
      },
      {
          "featureType": "transit.line",
          "elementType": "geometry",
          "stylers": [
              {
                  "visibility": "on"
              },
              {
                  "lightness": 700
              }
          ]
      },
      {
          "featureType": "water",
          "elementType": "all",
          "stylers": [
              {
                  "color": "#7dcdcd"
              }
          ]
      }
  ];

  // initial center position for the map
  center: google.maps.LatLngLiteral;
  options: google.maps.MapOptions = {
    zoomControl: false,
    disableDefaultUI: true,
    styles: this.stylesArray
  };

  directionOptions: google.maps.DirectionsRendererOptions = {
    suppressMarkers: true,
  };

  markerPositions: any[];

  positionMarker: any;

  positionMarkerOptions: google.maps.MarkerOptions = {
    icon: '../../../assets/icon/car.gif'
  };

  theFoodWorksCenturion = { lat: -25.864798431703196, lng: 28.16656588444456 };

  directionsResults$: Observable<google.maps.DirectionsResult|undefined>;

  trackingOptions = {
    enableHighAccuracy: false,
    timeout: 5000,
    maximumAge: 0
  };

  constructor(private mapDirectionsService: MapDirectionsService, private toast: ToastController, public ngZone: NgZone,
              private service: DriverService, private router: Router, private launchNavigator: LaunchNavigator, private locationService: LocationService) { }

  openInfoWindow(marker: MapMarker, saleID: any, address: any) {
    if (saleID != null){
      this.orderID = saleID;
      this.address = address;
      this.infoWindow.open(marker);
    }
  }

  ngOnInit() {
    this.initLoad = true;
  }

  ionViewDidEnter() {
    this.getMyLocation();
    this.waypoints = [];
    waypts = [];
    this.service.getRoute().subscribe((res: any) => {
      const currentLength = this.service.waypointsLength;
      if (res.length > 0) {
        this.waypoints = res;
        if (currentLength !== res.length || this.initLoad) {
          if (this.initLoad) {
            this.initLoad = false;
          }
          this.markerPositions = [{
            coords: this.theFoodWorksCenturion
          }];
          this.service.setWaypointLength(res.length);
          this.fetchRoute();
        }
      }
    });
  }

  ionViewDidLeave() {
    this.clearWatch();
  }

  async getMyLocation() {
    const hasPermission = await this.locationService.checkGPSPermission();
    if (hasPermission) {
      if (Capacitor.isNativePlatform) {
        const canUseGPS = await this.locationService.askToTurnOnGPS();
        this.postGPSPermission(canUseGPS);
      }
      else { this.postGPSPermission(true); }
    }
    else {
      const permission = await this.locationService.requestGPSPermission();
      if (permission === 'CAN_REQUEST' || permission === 'GOT_PERMISSION') {
        if (Capacitor.isNativePlatform) {
          const canUseGPS = await this.locationService.askToTurnOnGPS();
          this.postGPSPermission(canUseGPS);
        }
        else { this.postGPSPermission(true); }
      }
      else {
        await this.presentFailToast();
      }
    }
  }

  async postGPSPermission(canUseGPS: boolean) {
    if (canUseGPS) { this.watchPosition(); }
    else {
      await this.presentFailToast();
    }
  }

  async watchPosition() {
    try {
      this.watchId = Geolocation.watchPosition({maximumAge:1000, timeout:60000, enableHighAccuracy:true}, (position, err) => {
        this.posLat = position.coords.latitude;
          this.posLng = position.coords.longitude;
          this.positionMarker = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
      });
    }
    catch (err) {console.log('err', err);}
  }

  clearWatch() {
    if (this.watchId !== null) {
      Geolocation.clearWatch({ id: this.watchId });
    }
  }


  fetchRoute() {
    const request: google.maps.DirectionsRequest = {
      destination: this.theFoodWorksCenturion,
      origin: this.theFoodWorksCenturion,
      waypoints: waypts,
      travelMode: google.maps.TravelMode.DRIVING,
      optimizeWaypoints: true
    };

    this.directionsResults$ = this.mapDirectionsService.route(request).pipe(map(response => response.result));

    this.waypoints.forEach(element => {
      waypts.push({
        location: new google.maps.LatLng(element.lat, element.lng)
      });

      this.markerPositions.push({
        saleID: element.saleID,
        address: element.address,
        coords: { lat: element.lat, lng: element.lng }
      });
    });
  }

  doNavigate() {
    const options: LaunchNavigatorOptions = {
      start: null,
      app: this.launchNavigator.APP.GOOGLE_MAPS
    };

    this.mapRoute = '';
    this.waypoints.forEach(element => {
      this.mapRoute += `${element.lat},${element.lng}+to:`;
      console.log(element);
    });

    this.launchNavigator.navigate(this.mapRoute + '-25.86423761512273,28.16665231644819', options)
    .then(
      success => console.log('Launched navigator'),
      error => this.presentFailToast()
    );
  }

  doComplete() {
    this.infoWindow.close();
    this.service.setSaleID(this.orderID);
    this.router.navigateByUrl('complete-delivery');
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
