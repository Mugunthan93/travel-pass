import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CalendarModalComponent } from './calendar-modal.component';
import { CalendarModule } from 'ion2-calendar';
import { HTTP } from '@ionic-native/http/ngx';

describe('CalendarModalComponent', () => {
  let component: CalendarModalComponent;
  let fixture: ComponentFixture<CalendarModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        CalendarModalComponent
      ],
      imports: [
        IonicModule.forRoot(),
        CalendarModule
      ],
      providers: [
        HTTP
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CalendarModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
