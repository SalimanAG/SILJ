import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-liste-contrat-locataire',
  templateUrl: './liste-contrat-locataire.component.html',
  styleUrls: ['./liste-contrat-locataire.component.css']
})
export class ListeContratLocataireComponent implements OnInit {

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
