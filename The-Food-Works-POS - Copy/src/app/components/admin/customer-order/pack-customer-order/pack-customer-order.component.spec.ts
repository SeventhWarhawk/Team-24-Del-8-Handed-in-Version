import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackCustomerOrderComponent } from './pack-customer-order.component';

describe('PackCustomerOrderComponent', () => {
  let component: PackCustomerOrderComponent;
  let fixture: ComponentFixture<PackCustomerOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PackCustomerOrderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PackCustomerOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
