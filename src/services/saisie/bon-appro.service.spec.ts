import { TestBed } from '@angular/core/testing';

import { BonApproService } from './bon-appro.service';

describe('BonApproService', () => {
  let service: BonApproService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BonApproService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
