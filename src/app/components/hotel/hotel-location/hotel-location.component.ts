import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { environment } from 'src/environments/environment';

// just an interface for type safety.
interface marker {
  lat: number;
  lng: number;
  label?: string;
  draggable: boolean;
}

@Component({
  selector: 'app-hotel-location',
  templateUrl: './hotel-location.component.html',
  styleUrls: ['./hotel-location.component.scss']
})
export class HotelLocationComponent implements OnInit,AfterViewInit {

  @ViewChild('map', { static: true }) mapElement: ElementRef;

  landmarks: any[] = ["1","2","3","4","5"];

  constructor(
    public platform: Platform
  ) { 
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    // this.getGoogleMaps()
    //   .then(
    //     (googleMaps) => {
    //       const mapEl = document.getElementById('map');
    //       const map = new googleMaps.Map(mapEl, {
    //         center: {
    //           lat: -34.397,
    //           lng: 150.644
    //         },
    //         zoom: 16
    //       });
    //       googleMaps.event.addListenerOnce(map, 'idle', () => {
    //         this.renderer.addClass(mapEl, 'visible');
    //       });

    //     }
    //   )
    //   .catch(
    //     (err) => {
    //       console.log(err);
    //     }
    //   )
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

  // google maps zoom level
  zoom: number = 8;

  // initial center position for the map
  lat: number = 51.673858;
  lng: number = 7.815982;

  clickedMarker(label: string, index: number) {
    console.log(`clicked the marker: ${label || index}`)
  }

  mapClicked($event: any) {
    this.markers.push({
      lat: $event.coords.lat,
      lng: $event.coords.lng,
      draggable: true
    });
  }

  markerDragEnd(m: marker, $event: MouseEvent) {
    console.log('dragEnd', m, $event);
  }

  markers: marker[] = [
    {
      lat: 51.673858,
      lng: 7.815982,
      label: 'A',
      draggable: true
    },
    {
      lat: 51.373858,
      lng: 7.215982,
      label: 'B',
      draggable: false
    },
    {
      lat: 51.723858,
      lng: 7.895982,
      label: 'C',
      draggable: true
    }
  ]

}
