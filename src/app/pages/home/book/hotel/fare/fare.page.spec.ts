import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FarePage } from './fare.page';

describe('FarePage', () => {
  let component: FarePage;
  let fixture: ComponentFixture<FarePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FarePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FarePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
