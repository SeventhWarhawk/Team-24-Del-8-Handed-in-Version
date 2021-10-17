import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReconcileCookingListComponent } from './reconcile-cooking-list.component';

describe('ReconcileCookingListComponent', () => {
  let component: ReconcileCookingListComponent;
  let fixture: ComponentFixture<ReconcileCookingListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReconcileCookingListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReconcileCookingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
