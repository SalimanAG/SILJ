import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-liste-point-caisse',
  templateUrl: './liste-point-caisse.component.html',
  styleUrls: ['./liste-point-caisse.component.css']
})
export class ListePointCaisseComponent implements OnInit {

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
