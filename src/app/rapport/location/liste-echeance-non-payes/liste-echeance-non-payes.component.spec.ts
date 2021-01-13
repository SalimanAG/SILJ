import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeEcheanceNonPayesComponent } from './liste-echeance-non-payes.component';

describe('ListeEcheanceNonPayesComponent', () => {
  let component: ListeEcheanceNonPayesComponent;
  let fixture: ComponentFixture<ListeEcheanceNonPayesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListeEcheanceNonPayesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListeEcheanceNonPayesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
