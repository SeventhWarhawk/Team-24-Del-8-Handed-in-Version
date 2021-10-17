import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCookingListComponent } from './add-cooking-list.component';

describe('AddCookingListComponent', () => {
  let component: AddCookingListComponent;
  let fixture: ComponentFixture<AddCookingListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddCookingListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCookingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
