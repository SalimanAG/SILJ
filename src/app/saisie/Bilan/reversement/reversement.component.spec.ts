import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReversementComponent } from './reversement.component';

describe('ReversementComponent', () => {
  let component: ReversementComponent;
  let fixture: ComponentFixture<ReversementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReversementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReversementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
