import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTrainingModuleComponent } from './create-training-module.component';

describe('CreateTrainingModuleComponent', () => {
  let component: CreateTrainingModuleComponent;
  let fixture: ComponentFixture<CreateTrainingModuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateTrainingModuleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTrainingModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
