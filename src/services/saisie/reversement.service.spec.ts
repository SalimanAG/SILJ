import { TestBed } from '@angular/core/testing';

import { ReversementService } from './reversement.service';

describe('ReversementService', () => {
  let service: ReversementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReversementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
