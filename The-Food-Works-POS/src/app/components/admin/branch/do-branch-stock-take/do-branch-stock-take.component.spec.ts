import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoBranchStockTakeComponent } from './do-branch-stock-take.component';

describe('DoBranchStockTakeComponent', () => {
  let component: DoBranchStockTakeComponent;
  let fixture: ComponentFixture<DoBranchStockTakeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DoBranchStockTakeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DoBranchStockTakeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
