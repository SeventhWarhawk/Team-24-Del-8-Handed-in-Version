import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoucherQrDialogComponent } from './voucher-qr-dialog.component';

describe('VoucherQrDialogComponent', () => {
  let component: VoucherQrDialogComponent;
  let fixture: ComponentFixture<VoucherQrDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VoucherQrDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VoucherQrDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
