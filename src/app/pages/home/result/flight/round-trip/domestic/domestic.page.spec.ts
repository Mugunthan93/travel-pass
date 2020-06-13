import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DomesticPage } from './domestic.page';

describe('DomesticPage', () => {
  let component: DomesticPage;
  let fixture: ComponentFixture<DomesticPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DomesticPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DomesticPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
