import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandeApprovisionnementComponent } from './demande-approvisionnement.component';

describe('DemandeApprovisionnementComponent', () => {
  let component: DemandeApprovisionnementComponent;
  let fixture: ComponentFixture<DemandeApprovisionnementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemandeApprovisionnementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemandeApprovisionnementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
