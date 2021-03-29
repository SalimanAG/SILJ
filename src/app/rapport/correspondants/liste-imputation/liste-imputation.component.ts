import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-liste-imputation',
  templateUrl: './liste-imputation.component.html',
  styleUrls: ['./liste-imputation.component.css']
})
export class ListeImputationComponent implements OnInit {

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
