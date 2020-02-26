import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FlightPage } from './flight.page';

describe('FlightPage', () => {
  let component: FlightPage;
  let fixture: ComponentFixture<FlightPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlightPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FlightPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
