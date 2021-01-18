import { TestBed } from '@angular/core/testing';

import { RecollementService } from './recollement.service';

describe('RecollementService', () => {
  let service: RecollementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecollementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
