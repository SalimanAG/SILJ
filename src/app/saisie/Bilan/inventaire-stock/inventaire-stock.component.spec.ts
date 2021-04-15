import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventaireStockComponent } from './inventaire-stock.component';

describe('InventaireStockComponent', () => {
  let component: InventaireStockComponent;
  let fixture: ComponentFixture<InventaireStockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventaireStockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventaireStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
