import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintainBranchComponent } from './maintain-branch.component';

describe('MaintainBranchComponent', () => {
  let component: MaintainBranchComponent;
  let fixture: ComponentFixture<MaintainBranchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaintainBranchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintainBranchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
