import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateBranchStockComponent } from './update-branch-stock.component';

describe('UpdateBranchStockComponent', () => {
  let component: UpdateBranchStockComponent;
  let fixture: ComponentFixture<UpdateBranchStockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateBranchStockComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateBranchStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
