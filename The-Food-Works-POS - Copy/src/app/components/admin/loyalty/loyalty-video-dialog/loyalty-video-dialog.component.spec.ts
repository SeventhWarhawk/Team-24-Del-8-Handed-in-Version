import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoyaltyVideoDialogComponent } from './loyalty-video-dialog.component';

describe('LoyaltyVideoDialogComponent', () => {
  let component: LoyaltyVideoDialogComponent;
  let fixture: ComponentFixture<LoyaltyVideoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoyaltyVideoDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoyaltyVideoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
