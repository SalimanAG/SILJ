import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TresorierCommunalComponent } from './tresorier-communal.component';

describe('TresorierCommunalComponent', () => {
  let component: TresorierCommunalComponent;
  let fixture: ComponentFixture<TresorierCommunalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TresorierCommunalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TresorierCommunalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
