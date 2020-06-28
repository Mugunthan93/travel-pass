import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RequestListPage } from './request-list.page';

describe('RequestListPage', () => {
  let component: RequestListPage;
  let fixture: ComponentFixture<RequestListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RequestListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
