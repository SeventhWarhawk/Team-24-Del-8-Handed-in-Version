import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestBranchStockComponent } from './request-branch-stock.component';

describe('RequestBranchStockComponent', () => {
  let component: RequestBranchStockComponent;
  let fixture: ComponentFixture<RequestBranchStockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestBranchStockComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestBranchStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
