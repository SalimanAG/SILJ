import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeValeurLocativeComponent } from './liste-valeur-locative.component';

describe('ListeValeurLocativeComponent', () => {
  let component: ListeValeurLocativeComponent;
  let fixture: ComponentFixture<ListeValeurLocativeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListeValeurLocativeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListeValeurLocativeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
