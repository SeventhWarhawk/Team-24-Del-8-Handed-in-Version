import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintainSupplierTypeComponent } from './maintain-supplier-type.component';

describe('MaintainSupplierTypeComponent', () => {
  let component: MaintainSupplierTypeComponent;
  let fixture: ComponentFixture<MaintainSupplierTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaintainSupplierTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintainSupplierTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
