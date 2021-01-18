import { TestBed } from '@angular/core/testing';

import { InstitutionReversementService } from './institution-reversement.service';

describe('InstitutionReversementService', () => {
  let service: InstitutionReversementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InstitutionReversementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
