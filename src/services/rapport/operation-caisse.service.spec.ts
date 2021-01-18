import { TestBed } from '@angular/core/testing';

import { OperationCaisseService } from './operation-caisse.service';

describe('OperationCaisseService', () => {
  let service: OperationCaisseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OperationCaisseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
