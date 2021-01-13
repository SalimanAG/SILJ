import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionDroitsGroupesComponent } from './gestion-droits-groupes.component';

describe('GestionDroitsGroupesComponent', () => {
  let component: GestionDroitsGroupesComponent;
  let fixture: ComponentFixture<GestionDroitsGroupesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GestionDroitsGroupesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionDroitsGroupesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
