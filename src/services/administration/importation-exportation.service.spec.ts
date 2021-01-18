import { TestBed } from '@angular/core/testing';

import { ImportationExportationService } from './importation-exportation.service';

describe('ImportationExportationService', () => {
  let service: ImportationExportationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImportationExportationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
