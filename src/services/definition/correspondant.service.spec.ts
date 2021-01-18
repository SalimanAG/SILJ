import { TestBed } from '@angular/core/testing';

import { CorrespondantService } from './correspondant.service';

describe('CorrespondantService', () => {
  let service: CorrespondantService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CorrespondantService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
