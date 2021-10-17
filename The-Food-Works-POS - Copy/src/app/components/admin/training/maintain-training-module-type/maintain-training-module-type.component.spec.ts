import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintainTrainingModuleTypeComponent } from './maintain-training-module-type.component';

describe('MaintainTrainingModuleTypeComponent', () => {
  let component: MaintainTrainingModuleTypeComponent;
  let fixture: ComponentFixture<MaintainTrainingModuleTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaintainTrainingModuleTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintainTrainingModuleTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
