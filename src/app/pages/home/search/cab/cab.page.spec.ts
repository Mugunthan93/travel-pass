import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CabPage } from './cab.page';

describe('CabPage', () => {
  let component: CabPage;
  let fixture: ComponentFixture<CabPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CabPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CabPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
