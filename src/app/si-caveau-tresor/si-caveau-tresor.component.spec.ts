import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SiCaveauTresorComponent } from './si-caveau-tresor.component';

describe('SiCaveauTresorComponent', () => {
  let component: SiCaveauTresorComponent;
  let fixture: ComponentFixture<SiCaveauTresorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SiCaveauTresorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SiCaveauTresorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
