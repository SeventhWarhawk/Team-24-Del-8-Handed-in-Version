import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IngredientReportComponent } from './ingredient-report.component';

describe('IngredientReportComponent', () => {
  let component: IngredientReportComponent;
  let fixture: ComponentFixture<IngredientReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IngredientReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IngredientReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
