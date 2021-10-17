import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateConfirmationComponent } from './generate-confirmation.component';

describe('GenerateConfirmationComponent', () => {
  let component: GenerateConfirmationComponent;
  let fixture: ComponentFixture<GenerateConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenerateConfirmationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerateConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
