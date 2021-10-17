import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintainBranchStockComponent } from './maintain-branch-stock.component';

describe('MaintainBranchStockComponent', () => {
  let component: MaintainBranchStockComponent;
  let fixture: ComponentFixture<MaintainBranchStockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaintainBranchStockComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintainBranchStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
