import { TestBed } from '@angular/core/testing';

import { PointVenteService } from './point-vente.service';

describe('PointVenteService', () => {
  let service: PointVenteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PointVenteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
