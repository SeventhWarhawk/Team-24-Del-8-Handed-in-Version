import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaceSupplierOrderComponent } from './place-supplier-order.component';

describe('PlaceSupplierOrderComponent', () => {
  let component: PlaceSupplierOrderComponent;
  let fixture: ComponentFixture<PlaceSupplierOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlaceSupplierOrderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaceSupplierOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
