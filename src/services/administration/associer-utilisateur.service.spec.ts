import { TestBed } from '@angular/core/testing';

import { AssocierUtilisateurService } from './associer-utilisateur.service';

describe('AssocierUtilisateurService', () => {
  let service: AssocierUtilisateurService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AssocierUtilisateurService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
