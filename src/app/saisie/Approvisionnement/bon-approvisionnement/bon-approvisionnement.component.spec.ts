import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BonApprovisionnementComponent } from './bon-approvisionnement.component';

describe('BonApprovisionnementComponent', () => {
  let component: BonApprovisionnementComponent;
  let fixture: ComponentFixture<BonApprovisionnementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BonApprovisionnementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BonApprovisionnementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
