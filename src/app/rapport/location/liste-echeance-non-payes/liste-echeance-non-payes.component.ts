import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-liste-echeance-non-payes',
  templateUrl: './liste-echeance-non-payes.component.html',
  styleUrls: ['./liste-echeance-non-payes.component.css']
})
export class ListeEcheanceNonPayesComponent implements OnInit {

  opened:number = 0;
  clicked:number = 0;

  constructor() { }

  ngOnInit(): void {
  }

  manageCollapses(inde:number){
    this.opened = inde;
    this.clicked = inde;
  }

}
