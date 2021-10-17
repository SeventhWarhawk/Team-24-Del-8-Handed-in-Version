import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDeliveryComponent } from './view-delivery.component';

describe('ViewDeliveryComponent', () => {
  let component: ViewDeliveryComponent;
  let fixture: ComponentFixture<ViewDeliveryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewDeliveryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewDeliveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
