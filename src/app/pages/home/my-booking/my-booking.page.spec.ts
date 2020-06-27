import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MyBookingPage } from './my-booking.page';

describe('MyBookingPage', () => {
  let component: MyBookingPage;
  let fixture: ComponentFixture<MyBookingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyBookingPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MyBookingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
