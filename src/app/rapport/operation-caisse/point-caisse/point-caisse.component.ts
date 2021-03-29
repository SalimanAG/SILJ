import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-point-caisse',
  templateUrl: './point-caisse.component.html',
  styleUrls: ['./point-caisse.component.css']
})
export class PointCaisseComponent implements OnInit {

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
