import { TestBed } from '@angular/core/testing';

import { MissionStaffService } from './mission-staff.service';

describe('MissionStaffService', () => {
  let service: MissionStaffService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MissionStaffService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
