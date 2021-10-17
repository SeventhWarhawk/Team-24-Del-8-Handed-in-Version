import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingModulesContentComponent } from './training-modules-content.component';

describe('TrainingModulesContentComponent', () => {
  let component: TrainingModulesContentComponent;
  let fixture: ComponentFixture<TrainingModulesContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrainingModulesContentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainingModulesContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
