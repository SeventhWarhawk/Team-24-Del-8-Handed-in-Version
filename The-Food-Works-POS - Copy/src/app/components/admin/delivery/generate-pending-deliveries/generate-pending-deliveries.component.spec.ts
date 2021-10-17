import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneratePendingDeliveriesComponent } from './generate-pending-deliveries.component';

describe('GeneratePendingDeliveriesComponent', () => {
  let component: GeneratePendingDeliveriesComponent;
  let fixture: ComponentFixture<GeneratePendingDeliveriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeneratePendingDeliveriesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneratePendingDeliveriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
