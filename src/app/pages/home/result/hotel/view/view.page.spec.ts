import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ViewPage } from './view.page';
import { MatGridListModule } from '@angular/material/grid-list';
import { SimilarHotelsComponent } from 'src/app/components/hotel/similar-hotels/similar-hotels.component';
import { MatDividerModule } from '@angular/material/divider';

describe('ViewPage', () => {
  let component: ViewPage;
  let fixture: ComponentFixture<ViewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ViewPage,
        SimilarHotelsComponent
      ],
      imports: [
        IonicModule.forRoot(),
        MatGridListModule,
        MatDividerModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ViewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
