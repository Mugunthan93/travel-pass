import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PassengerModalComponent } from './passenger-modal.component';
import { ReactiveFormsModule } from '@angular/forms';

describe('PassengerModalComponent', () => {
  let component: PassengerModalComponent;
  let fixture: ComponentFixture<PassengerModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PassengerModalComponent ],
      imports: [
        IonicModule.forRoot(),
        ReactiveFormsModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PassengerModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
