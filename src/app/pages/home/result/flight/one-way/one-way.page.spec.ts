import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OneWayPage } from './one-way.page';
import { ResultSortingComponent } from 'src/app/components/shared/result-sorting/result-sorting.component';
import { ResultListComponent } from 'src/app/components/flight/result-list/result-list.component';

describe('OneWayPage', () => {
  let component: OneWayPage;
  let fixture: ComponentFixture<OneWayPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        OneWayPage,
        ResultSortingComponent,
        ResultListComponent
      ],
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
