import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JournalOperationComponent } from './journal-operation.component';

describe('JournalOperationComponent', () => {
  let component: JournalOperationComponent;
  let fixture: ComponentFixture<JournalOperationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JournalOperationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JournalOperationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
