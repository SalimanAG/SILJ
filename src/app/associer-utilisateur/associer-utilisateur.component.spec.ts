import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssocierUtilisateurComponent } from './associer-utilisateur.component';

describe('AssocierUtilisateurComponent', () => {
  let component: AssocierUtilisateurComponent;
  let fixture: ComponentFixture<AssocierUtilisateurComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssocierUtilisateurComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssocierUtilisateurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
