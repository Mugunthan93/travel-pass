import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HomeTabPage } from './home-tab.page';

describe('HomeTabPage', () => {
  let component: HomeTabPage;
  let fixture: ComponentFixture<HomeTabPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeTabPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeTabPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
