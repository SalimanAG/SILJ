import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-liste-valeur-locative',
  templateUrl: './liste-valeur-locative.component.html',
  styleUrls: ['./liste-valeur-locative.component.css']
})
export class ListeValeurLocativeComponent implements OnInit {

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
