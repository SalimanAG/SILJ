import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-brouillard',
  templateUrl: './brouillard.component.html',
  styleUrls: ['./brouillard.component.css']
})
export class BrouillardComponent implements OnInit {

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
