import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-journal-operation',
  templateUrl: './journal-operation.component.html',
  styleUrls: ['./journal-operation.component.css']
})
export class JournalOperationComponent implements OnInit {

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
