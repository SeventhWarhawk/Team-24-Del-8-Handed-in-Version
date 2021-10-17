import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttachCustomerDialogComponent } from './attach-customer-dialog.component';

describe('AttachCustomerDialogComponent', () => {
  let component: AttachCustomerDialogComponent;
  let fixture: ComponentFixture<AttachCustomerDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AttachCustomerDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AttachCustomerDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
