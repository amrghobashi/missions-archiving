import { TestBed } from '@angular/core/testing';

import { MissionCarService } from './mission-car.service';

describe('MissionCarService', () => {
  let service: MissionCarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MissionCarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
