import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContratLocationComponent } from './contrat-location.component';

describe('ContratLocationComponent', () => {
  let component: ContratLocationComponent;
  let fixture: ComponentFixture<ContratLocationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContratLocationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContratLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
