import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BusAmentiesComponent } from './bus-amenties.component';

describe('BusAmentiesComponent', () => {
  let component: BusAmentiesComponent;
  let fixture: ComponentFixture<BusAmentiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusAmentiesComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BusAmentiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
