import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportationExportationComponent } from './importation-exportation.component';

describe('ImportationExportationComponent', () => {
  let component: ImportationExportationComponent;
  let fixture: ComponentFixture<ImportationExportationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportationExportationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportationExportationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
