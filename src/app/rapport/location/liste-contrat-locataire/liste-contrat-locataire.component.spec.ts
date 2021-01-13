import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeContratLocataireComponent } from './liste-contrat-locataire.component';

describe('ListeContratLocataireComponent', () => {
  let component: ListeContratLocataireComponent;
  let fixture: ComponentFixture<ListeContratLocataireComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListeContratLocataireComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListeContratLocataireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
