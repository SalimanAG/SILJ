import { TestBed } from '@angular/core/testing';

import { DroitGroupeService } from './droit-groupe.service';

describe('DroitGroupeService', () => {
  let service: DroitGroupeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DroitGroupeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
