import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InstitutionReversementComponent } from './institution-reversement.component';

describe('InstitutionReversementComponent', () => {
  let component: InstitutionReversementComponent;
  let fixture: ComponentFixture<InstitutionReversementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InstitutionReversementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstitutionReversementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
