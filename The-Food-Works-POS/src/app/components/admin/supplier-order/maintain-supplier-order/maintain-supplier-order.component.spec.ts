import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintainSupplierOrderComponent } from './maintain-supplier-order.component';

describe('MaintainSupplierOrderComponent', () => {
  let component: MaintainSupplierOrderComponent;
  let fixture: ComponentFixture<MaintainSupplierOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaintainSupplierOrderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintainSupplierOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
