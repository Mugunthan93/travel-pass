import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OneWayPage } from './one-way.page';

describe('OneWayPage', () => {
  let component: OneWayPage;
  let fixture: ComponentFixture<OneWayPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OneWayPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OneWayPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
