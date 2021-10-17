import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingModulesContentViewComponent } from './training-modules-content-view.component';

describe('TrainingModulesContentViewComponent', () => {
  let component: TrainingModulesContentViewComponent;
  let fixture: ComponentFixture<TrainingModulesContentViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrainingModulesContentViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainingModulesContentViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
