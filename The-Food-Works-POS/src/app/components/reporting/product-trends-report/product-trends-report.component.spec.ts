import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductTrendsReportComponent } from './product-trends-report.component';

describe('ProductTrendsReportComponent', () => {
  let component: ProductTrendsReportComponent;
  let fixture: ComponentFixture<ProductTrendsReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductTrendsReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductTrendsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
