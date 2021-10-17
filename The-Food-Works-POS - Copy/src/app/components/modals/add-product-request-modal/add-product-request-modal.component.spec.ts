import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProductRequestModalComponent } from './add-product-request-modal.component';

describe('AddProductRequestModalComponent', () => {
  let component: AddProductRequestModalComponent;
  let fixture: ComponentFixture<AddProductRequestModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddProductRequestModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddProductRequestModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
