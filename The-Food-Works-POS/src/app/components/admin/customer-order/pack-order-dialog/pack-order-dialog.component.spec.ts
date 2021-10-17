import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackOrderDialogComponent } from './pack-order-dialog.component';

describe('PackOrderDialogComponent', () => {
  let component: PackOrderDialogComponent;
  let fixture: ComponentFixture<PackOrderDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PackOrderDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PackOrderDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
