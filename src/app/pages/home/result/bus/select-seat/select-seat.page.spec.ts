import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SelectSeatPage } from './select-seat.page';
import { BusSeatlayoutComponent } from 'src/app/components/bus/bus-seatlayout/bus-seatlayout.component';
import { SelectSeatPageRoutingModule } from './select-seat-routing.module';

describe('SelectSeatPage', () => {
  let component: SelectSeatPage;
  let fixture: ComponentFixture<SelectSeatPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        SelectSeatPage,
        BusSeatlayoutComponent
      ],
      imports: [
        IonicModule.forRoot(),
        SelectSeatPageRoutingModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SelectSeatPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
