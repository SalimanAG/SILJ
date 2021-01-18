import { TestBed } from '@angular/core/testing';

import { SiCaveauTresorService } from './si-caveau-tresor.service';

describe('SiCaveauTresorService', () => {
  let service: SiCaveauTresorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SiCaveauTresorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
