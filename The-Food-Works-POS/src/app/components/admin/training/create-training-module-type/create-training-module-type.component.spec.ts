import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTrainingModuleTypeComponent } from './create-training-module-type.component';

describe('CreateTrainingModuleTypeComponent', () => {
  let component: CreateTrainingModuleTypeComponent;
  let fixture: ComponentFixture<CreateTrainingModuleTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateTrainingModuleTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTrainingModuleTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
