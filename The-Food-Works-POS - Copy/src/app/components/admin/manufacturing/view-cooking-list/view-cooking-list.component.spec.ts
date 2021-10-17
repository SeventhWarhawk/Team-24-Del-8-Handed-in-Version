import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCookingListComponent } from './view-cooking-list.component';

describe('ViewCookingListComponent', () => {
  let component: ViewCookingListComponent;
  let fixture: ComponentFixture<ViewCookingListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewCookingListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCookingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
