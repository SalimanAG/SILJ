import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecapLivrableComponent } from './recap-livrable.component';

describe('RecapLivrableComponent', () => {
  let component: RecapLivrableComponent;
  let fixture: ComponentFixture<RecapLivrableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecapLivrableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecapLivrableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
