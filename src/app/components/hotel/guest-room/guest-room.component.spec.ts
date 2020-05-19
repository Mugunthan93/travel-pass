import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { GuestRoomComponent } from './guest-room.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('GuestRoomComponent', () => {
  let component: GuestRoomComponent;
  let fixture: ComponentFixture<GuestRoomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GuestRoomComponent ],
      imports: [
        BrowserAnimationsModule,
        IonicModule.forRoot(),
        MatExpansionModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(GuestRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
