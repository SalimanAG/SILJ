import { TestBed } from '@angular/core/testing';

import { RegisseurService } from './regisseur.service';

describe('RegisseurService', () => {
  let service: RegisseurService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegisseurService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
