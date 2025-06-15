import { TestBed } from '@angular/core/testing';

import { MissionBattelionService } from './mission-battelion.service';

describe('MissionBattelionService', () => {
  let service: MissionBattelionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MissionBattelionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
