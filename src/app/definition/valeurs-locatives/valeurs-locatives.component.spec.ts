import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValeursLocativesComponent } from './valeurs-locatives.component';

describe('ValeursLocativesComponent', () => {
  let component: ValeursLocativesComponent;
  let fixture: ComponentFixture<ValeursLocativesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValeursLocativesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValeursLocativesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
