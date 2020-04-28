import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SelectDropAndPickupPage } from './select-drop-and-pickup.page';

describe('SelectDropAndPickupPage', () => {
  let component: SelectDropAndPickupPage;
  let fixture: ComponentFixture<SelectDropAndPickupPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectDropAndPickupPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SelectDropAndPickupPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
