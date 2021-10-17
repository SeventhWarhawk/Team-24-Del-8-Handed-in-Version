import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckBranchComponent } from './check-branch.component';

describe('CheckBranchComponent', () => {
  let component: CheckBranchComponent;
  let fixture: ComponentFixture<CheckBranchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckBranchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckBranchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
