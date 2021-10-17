import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintainLoyaltyComponent } from './maintain-loyalty.component';

describe('MaintainLoyaltyComponent', () => {
  let component: MaintainLoyaltyComponent;
  let fixture: ComponentFixture<MaintainLoyaltyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaintainLoyaltyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintainLoyaltyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
