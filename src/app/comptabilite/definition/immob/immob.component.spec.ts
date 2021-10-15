import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImmobComponent } from './immob.component';

describe('ImmobComponent', () => {
  let component: ImmobComponent;
  let fixture: ComponentFixture<ImmobComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImmobComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImmobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
