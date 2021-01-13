import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JournalCaisseComponent } from './journal-caisse.component';

describe('JournalCaisseComponent', () => {
  let component: JournalCaisseComponent;
  let fixture: ComponentFixture<JournalCaisseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JournalCaisseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JournalCaisseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
