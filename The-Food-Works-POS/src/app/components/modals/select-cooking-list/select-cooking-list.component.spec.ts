import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectCookingListComponent } from './select-cooking-list.component';

describe('SelectCookingListComponent', () => {
  let component: SelectCookingListComponent;
  let fixture: ComponentFixture<SelectCookingListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectCookingListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectCookingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
