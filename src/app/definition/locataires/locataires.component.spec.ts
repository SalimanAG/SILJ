import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocatairesComponent } from './locataires.component';

describe('LocatairesComponent', () => {
  let component: LocatairesComponent;
  let fixture: ComponentFixture<LocatairesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocatairesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocatairesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
