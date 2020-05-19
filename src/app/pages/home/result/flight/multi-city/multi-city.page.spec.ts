import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MultiCityPage } from './multi-city.page';
import { ResultSortingComponent } from 'src/app/components/shared/result-sorting/result-sorting.component';
import { ResultListComponent } from 'src/app/components/flight/result-list/result-list.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

describe('MultiCityPage', () => {
  let component: MultiCityPage;
  let fixture: ComponentFixture<MultiCityPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MultiCityPage,
        ResultSortingComponent,
        ResultListComponent
      ],
      imports: [
        IonicModule.forRoot(),
        ReactiveFormsModule,
        RouterTestingModule
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
