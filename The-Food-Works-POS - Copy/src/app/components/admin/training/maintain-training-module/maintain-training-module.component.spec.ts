import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintainTrainingModuleComponent } from './maintain-training-module.component';

describe('MaintainTrainingModuleComponent', () => {
  let component: MaintainTrainingModuleComponent;
  let fixture: ComponentFixture<MaintainTrainingModuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaintainTrainingModuleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintainTrainingModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
