import { TestBed } from '@angular/core/testing';

import { Tools2Service } from './tools2.service';

describe('Tools2Service', () => {
  let service: Tools2Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Tools2Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
