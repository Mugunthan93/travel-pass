import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HomeTabPage } from './home-tab.page';
import { TripListComponent } from 'src/app/components/trip-list/trip-list.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('HomeTabPage', () => {
  let component: HomeTabPage;
  let fixture: ComponentFixture<HomeTabPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        HomeTabPage,
        TripListComponent
      ],
      imports: [
        IonicModule.forRoot(),
        RouterTestingModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeTabPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
