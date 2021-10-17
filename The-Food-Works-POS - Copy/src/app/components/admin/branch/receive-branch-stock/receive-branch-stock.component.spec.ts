import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiveBranchStockComponent } from './receive-branch-stock.component';

describe('ReceiveBranchStockComponent', () => {
  let component: ReceiveBranchStockComponent;
  let fixture: ComponentFixture<ReceiveBranchStockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReceiveBranchStockComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceiveBranchStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
