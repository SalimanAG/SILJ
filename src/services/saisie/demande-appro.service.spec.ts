import { TestBed } from '@angular/core/testing';

import { DemandeApproService } from './demande-appro.service';

describe('DemandeApproService', () => {
  let service: DemandeApproService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DemandeApproService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
