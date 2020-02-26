import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TripTabPage } from './trip-tab.page';

describe('TripTabPage', () => {
  let component: TripTabPage;
  let fixture: ComponentFixture<TripTabPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TripTabPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TripTabPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
