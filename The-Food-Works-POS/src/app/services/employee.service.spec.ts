
import { TestBed } from '@angular/core/testing';

import { EmployeeServiceService } from './employee.service';

describe('EmployeeService', () => {
  let service: EmployeeServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmployeeServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
