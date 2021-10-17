import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintainSupplierComponent } from './maintain-supplier.component';

describe('MaintainSupplierComponent', () => {
  let component: MaintainSupplierComponent;
  let fixture: ComponentFixture<MaintainSupplierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaintainSupplierComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintainSupplierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
