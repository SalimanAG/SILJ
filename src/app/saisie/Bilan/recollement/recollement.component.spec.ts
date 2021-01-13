import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecollementComponent } from './recollement.component';

describe('RecollementComponent', () => {
  let component: RecollementComponent;
  let fixture: ComponentFixture<RecollementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecollementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecollementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
