import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PointVenteComponent } from './point-vente.component';

describe('PointVenteComponent', () => {
  let component: PointVenteComponent;
  let fixture: ComponentFixture<PointVenteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PointVenteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PointVenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
