import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CorrespondantsComponent } from './correspondants.component';

describe('CorrespondantsComponent', () => {
  let component: CorrespondantsComponent;
  let fixture: ComponentFixture<CorrespondantsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CorrespondantsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CorrespondantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
