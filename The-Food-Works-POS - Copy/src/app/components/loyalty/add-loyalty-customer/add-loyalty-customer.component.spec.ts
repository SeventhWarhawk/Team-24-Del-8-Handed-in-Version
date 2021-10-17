import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLoyaltyCustomerComponent } from './add-loyalty-customer.component';

describe('AddLoyaltyCustomerComponent', () => {
  let component: AddLoyaltyCustomerComponent;
  let fixture: ComponentFixture<AddLoyaltyCustomerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddLoyaltyCustomerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddLoyaltyCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
