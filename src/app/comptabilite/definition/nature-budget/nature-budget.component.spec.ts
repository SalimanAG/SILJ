import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NatureBudgetComponent } from './nature-budget.component';

describe('NatureBudgetComponent', () => {
  let component: NatureBudgetComponent;
  let fixture: ComponentFixture<NatureBudgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NatureBudgetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NatureBudgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
