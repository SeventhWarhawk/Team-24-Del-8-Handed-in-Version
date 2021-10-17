import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDeliveryModalComponent } from './view-delivery-modal.component';

describe('ViewDeliveryModalComponent', () => {
  let component: ViewDeliveryModalComponent;
  let fixture: ComponentFixture<ViewDeliveryModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewDeliveryModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewDeliveryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
