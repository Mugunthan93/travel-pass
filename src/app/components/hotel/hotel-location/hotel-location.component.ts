import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Renderer2 } from '@angular/core';
import { Platform } from '@ionic/angular';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-hotel-location',
  templateUrl: './hotel-location.component.html',
  styleUrls: ['./hotel-location.component.scss']
})
export class HotelLocationComponent implements OnInit,AfterViewInit {

  @ViewChild('map', { static: true }) mapElement: ElementRef;

  landmarks: any[] = ["1","2","3","4","5"];

  constructor(
    public platform: Platform,
    private renderer : Renderer2
  ) { 
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.getGoogleMaps()
      .then(
        (googleMaps) => {
          // const mapEl = this.mapElement.nativeElement;
          const mapEl = document.getElementById('map');
          const map = new googleMaps.Map(mapEl, {
            center: {
              lat: -34.397,
              lng: 150.644
            },
            zoom: 16
          });
          googleMaps.event.addListenerOnce(map, 'idle', () => {
            this.renderer.addClass(mapEl, 'visible');
          });

        }
      )
      .catch(
        (err) => {
          console.log(err);
        }
      )
  }

  private getGoogleMaps() : Promise<any> {
    const win = window as any;
    const googleModule = win.google;
    if (googleModule && googleModule.maps) {
      return Promise.resolve(googleModule.maps);
    }
    return new Promise(
      (resolve, reject) => {

        const script = document.createElement('script');
        script.src = 'https://maps.googleapis.com/maps/api/js?key=' + environment.map_js_key + '&callback=initMap';
        script.async = true;
        script.defer = true;

        win.initMap = function () {
          // JS API is loaded and available
        };

        document.body.appendChild(script);
        script.onload = () => {
          const loadedGoogleModule = win.google;
          if (loadedGoogleModule && loadedGoogleModule.maps) {
            resolve(loadedGoogleModule.maps);
          }
          else {
            reject("google map SDK not available");
          }
        }
    });
  }
  
  locationChange(evt) {
    console.log(evt);
  }

}
