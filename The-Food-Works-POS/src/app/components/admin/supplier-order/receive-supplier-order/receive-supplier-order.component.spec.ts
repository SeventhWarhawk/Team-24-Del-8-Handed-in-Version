import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiveSupplierOrderComponent } from './receive-supplier-order.component';

describe('ReceiveSupplierOrderComponent', () => {
  let component: ReceiveSupplierOrderComponent;
  let fixture: ComponentFixture<ReceiveSupplierOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReceiveSupplierOrderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceiveSupplierOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
