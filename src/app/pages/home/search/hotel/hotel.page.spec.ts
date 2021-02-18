import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HotelPage } from './hotel.page';
import { MatDividerModule } from '@angular/material/divider';
import { HotelPageRoutingModule } from './hotel-routing.module';
import { RouterTestingModule } from '@angular/router/testing';

describe('HotelPage', () => {
  let component: HotelPage;
  let fixture: ComponentFixture<HotelPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HotelPage ],
      imports: [
        IonicModule.forRoot(),
        MatDividerModule,
        RouterTestingModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HotelPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
