import { TestBed } from '@angular/core/testing';

import { IncinerationService } from './incineration.service';

describe('IncinerationService', () => {
  let service: IncinerationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IncinerationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
