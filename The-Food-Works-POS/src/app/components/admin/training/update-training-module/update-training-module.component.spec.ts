import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateTrainingModuleComponent } from './update-training-module.component';

describe('UpdateTrainingModuleComponent', () => {
  let component: UpdateTrainingModuleComponent;
  let fixture: ComponentFixture<UpdateTrainingModuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateTrainingModuleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateTrainingModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
