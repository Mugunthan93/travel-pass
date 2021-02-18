import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TrainPage } from './train.page';

describe('TrainPage', () => {
  let component: TrainPage;
  let fixture: ComponentFixture<TrainPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrainPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TrainPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
