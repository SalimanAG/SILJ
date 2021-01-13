import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecapPrestationComponent } from './recap-prestation.component';

describe('RecapPrestationComponent', () => {
  let component: RecapPrestationComponent;
  let fixture: ComponentFixture<RecapPrestationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecapPrestationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecapPrestationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
