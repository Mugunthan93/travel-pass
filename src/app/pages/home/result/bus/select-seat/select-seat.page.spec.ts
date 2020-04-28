import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SelectSeatPage } from './select-seat.page';

describe('SelectSeatPage', () => {
  let component: SelectSeatPage;
  let fixture: ComponentFixture<SelectSeatPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectSeatPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SelectSeatPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
