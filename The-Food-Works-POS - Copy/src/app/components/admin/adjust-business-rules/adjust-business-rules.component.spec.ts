import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdjustBusinessRulesComponent } from './adjust-business-rules.component';

describe('AdjustBusinessRulesComponent', () => {
  let component: AdjustBusinessRulesComponent;
  let fixture: ComponentFixture<AdjustBusinessRulesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdjustBusinessRulesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdjustBusinessRulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
