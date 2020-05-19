import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HotelLocationComponent } from './hotel-location.component';
import { AgmCoreModule } from '@agm/core';
import { environment } from 'src/environments/environment';

describe('HotelLocationComponent', () => {
  let component: HotelLocationComponent;
  let fixture: ComponentFixture<HotelLocationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        HotelLocationComponent
      ],
      imports: [
        IonicModule.forRoot(),
        AgmCoreModule.forRoot({
          // please get your own API key here:
          // https://developers.google.com/maps/documentation/javascript/get-api-key?hl=en
          apiKey: environment.map_js_key
        })
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HotelLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
