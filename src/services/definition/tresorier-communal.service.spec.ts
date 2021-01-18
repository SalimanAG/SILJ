import { TestBed } from '@angular/core/testing';

import { TresorierCommunalService } from './tresorier-communal.service';

describe('TresorierCommunalService', () => {
  let service: TresorierCommunalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TresorierCommunalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
