import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrouillardComponent } from './brouillard.component';

describe('BrouillardComponent', () => {
  let component: BrouillardComponent;
  let fixture: ComponentFixture<BrouillardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrouillardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrouillardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
