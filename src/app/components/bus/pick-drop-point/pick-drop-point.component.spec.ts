import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PickDropPointComponent } from './pick-drop-point.component';

describe('PickDropPointComponent', () => {
  let component: PickDropPointComponent;
  let fixture: ComponentFixture<PickDropPointComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PickDropPointComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PickDropPointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
