import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintainBatchComponent } from './maintain-batch.component';

describe('MaintainBatchComponent', () => {
  let component: MaintainBatchComponent;
  let fixture: ComponentFixture<MaintainBatchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaintainBatchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintainBatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
