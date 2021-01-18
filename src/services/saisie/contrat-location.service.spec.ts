import { TestBed } from '@angular/core/testing';

import { ContratLocationService } from './contrat-location.service';

describe('ContratLocationService', () => {
  let service: ContratLocationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContratLocationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
