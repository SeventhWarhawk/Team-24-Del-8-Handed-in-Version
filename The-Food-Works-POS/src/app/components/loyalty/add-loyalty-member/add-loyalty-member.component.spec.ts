import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLoyaltyMemberComponent } from './add-loyalty-member.component';

describe('AddLoyaltyMemberComponent', () => {
  let component: AddLoyaltyMemberComponent;
  let fixture: ComponentFixture<AddLoyaltyMemberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddLoyaltyMemberComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddLoyaltyMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
