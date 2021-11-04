import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EcritureComponent } from './ecriture.component';

describe('EcritureComponent', () => {
  let component: EcritureComponent;
  let fixture: ComponentFixture<EcritureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EcritureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EcritureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
