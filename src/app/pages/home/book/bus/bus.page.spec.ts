import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BusPage } from './bus.page';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDividerModule } from '@angular/material/divider';
import { BusPageRoutingModule } from './bus-routing.module';
import { RouterTestingModule } from '@angular/router/testing';

describe('BusPage', () => {
  let component: BusPage;
  let fixture: ComponentFixture<BusPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusPage ],
      imports: [
        IonicModule.forRoot(),
        MatExpansionModule,
        MatDividerModule,
        RouterTestingModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BusPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
