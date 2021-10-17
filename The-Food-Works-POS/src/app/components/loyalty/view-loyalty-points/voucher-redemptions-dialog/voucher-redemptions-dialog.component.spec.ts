import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoucherRedemptionsDialogComponent } from './voucher-redemptions-dialog.component';

describe('VoucherRedemptionsDialogComponent', () => {
  let component: VoucherRedemptionsDialogComponent;
  let fixture: ComponentFixture<VoucherRedemptionsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VoucherRedemptionsDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VoucherRedemptionsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
