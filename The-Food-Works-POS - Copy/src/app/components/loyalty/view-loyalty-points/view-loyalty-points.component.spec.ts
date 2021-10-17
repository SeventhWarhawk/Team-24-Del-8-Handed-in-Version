import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewLoyaltyPointsComponent } from './view-loyalty-points.component';

describe('ViewLoyaltyPointsComponent', () => {
  let component: ViewLoyaltyPointsComponent;
  let fixture: ComponentFixture<ViewLoyaltyPointsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewLoyaltyPointsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewLoyaltyPointsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
