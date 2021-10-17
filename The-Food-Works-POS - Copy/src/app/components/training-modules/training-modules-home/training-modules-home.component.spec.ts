import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingModulesHomeComponent } from './training-modules-home.component';

describe('TrainingModulesHomeComponent', () => {
  let component: TrainingModulesHomeComponent;
  let fixture: ComponentFixture<TrainingModulesHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrainingModulesHomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainingModulesHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
