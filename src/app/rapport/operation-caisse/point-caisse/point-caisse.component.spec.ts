import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PointCaisseComponent } from './point-caisse.component';

describe('PointCaisseComponent', () => {
  let component: PointCaisseComponent;
  let fixture: ComponentFixture<PointCaisseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PointCaisseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PointCaisseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
