import { TestBed } from '@angular/core/testing';

import { ValeurLocativeService } from './valeur-locative.service';

describe('ValeurLocativeService', () => {
  let service: ValeurLocativeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ValeurLocativeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
