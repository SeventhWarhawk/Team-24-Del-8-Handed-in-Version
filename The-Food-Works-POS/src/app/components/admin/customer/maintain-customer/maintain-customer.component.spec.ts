import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintainCustomerComponent } from './maintain-customer.component';

describe('MaintainCustomerComponent', () => {
  let component: MaintainCustomerComponent;
  let fixture: ComponentFixture<MaintainCustomerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaintainCustomerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintainCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
