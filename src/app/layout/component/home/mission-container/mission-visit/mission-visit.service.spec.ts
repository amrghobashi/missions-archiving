import { TestBed } from '@angular/core/testing';

import { MissionVisitService } from './mission-visit.service';

describe('MissionVisitService', () => {
  let service: MissionVisitService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MissionVisitService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
