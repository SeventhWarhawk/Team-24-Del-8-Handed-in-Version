import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PointOfSalesHomeComponent } from './point-of-sales-home.component';

describe('PointOfSalesHomeComponent', () => {
  let component: PointOfSalesHomeComponent;
  let fixture: ComponentFixture<PointOfSalesHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PointOfSalesHomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PointOfSalesHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
