import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateTrainingModuleTypeComponent } from './update-training-module-type.component';

describe('UpdateTrainingModuleTypeComponent', () => {
  let component: UpdateTrainingModuleTypeComponent;
  let fixture: ComponentFixture<UpdateTrainingModuleTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateTrainingModuleTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateTrainingModuleTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
