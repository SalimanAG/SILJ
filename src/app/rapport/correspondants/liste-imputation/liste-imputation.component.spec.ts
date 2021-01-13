import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeImputationComponent } from './liste-imputation.component';

describe('ListeImputationComponent', () => {
  let component: ListeImputationComponent;
  let fixture: ComponentFixture<ListeImputationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListeImputationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListeImputationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
