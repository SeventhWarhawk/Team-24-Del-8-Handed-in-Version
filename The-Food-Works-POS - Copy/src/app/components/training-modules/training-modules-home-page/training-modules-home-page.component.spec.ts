import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingModulesHomePageComponent } from './training-modules-home-page.component';

describe('TrainingModulesHomePageComponent', () => {
  let component: TrainingModulesHomePageComponent;
  let fixture: ComponentFixture<TrainingModulesHomePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrainingModulesHomePageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainingModulesHomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
