import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintainProductComponent } from './maintain-product.component';

describe('MaintainProductComponent', () => {
  let component: MaintainProductComponent;
  let fixture: ComponentFixture<MaintainProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaintainProductComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintainProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
