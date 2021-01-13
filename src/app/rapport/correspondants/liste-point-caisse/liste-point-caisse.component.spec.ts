import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListePointCaisseComponent } from './liste-point-caisse.component';

describe('ListePointCaisseComponent', () => {
  let component: ListePointCaisseComponent;
  let fixture: ComponentFixture<ListePointCaisseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListePointCaisseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListePointCaisseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
