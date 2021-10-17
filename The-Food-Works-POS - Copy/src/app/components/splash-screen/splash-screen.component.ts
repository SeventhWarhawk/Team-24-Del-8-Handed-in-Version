import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
declare var anime: any;

@Component({
  selector: 'app-splash-screen',
  templateUrl: './splash-screen.component.html',
  styleUrls: ['./splash-screen.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SplashScreenComponent implements AfterViewInit {

  constructor() { }

  ngAfterViewInit(): void {
    var textWrapper = document.querySelector('.ml6 .letters');
    textWrapper!.innerHTML = textWrapper!.textContent!.replace(/\S/g, "<span class='letter'>$&</span>");

    anime.timeline({loop: true})
      .add({
        targets: '.ml6 .letter',
        translateY: ["1.1em", 0],
        translateZ: 0,
        duration: 1500,
      delay: (el: any, i: any) => 50 * i
  }).add({
    targets: '.ml6',
    opacity: 0,
    duration: 2000,
    easing: "easeOutExpo",
    delay: 1000
  });

  }


}


