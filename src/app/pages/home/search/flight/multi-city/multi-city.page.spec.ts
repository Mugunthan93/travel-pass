import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MultiCityPage } from './multi-city.page';
import { ReactiveFormsModule } from '@angular/forms';

describe('MultiCityPage', () => {
  let component: MultiCityPage;
  let fixture: ComponentFixture<MultiCityPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultiCityPage ],
      imports: [
        IonicModule.forRoot(),
        ReactiveFormsModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MultiCityPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
