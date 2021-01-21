import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeModeComponent } from './type-mode.component';

describe('TypeModeComponent', () => {
  let component: TypeModeComponent;
  let fixture: ComponentFixture<TypeModeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TypeModeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TypeModeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
