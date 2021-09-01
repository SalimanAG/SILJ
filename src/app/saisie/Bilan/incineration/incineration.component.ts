import { Component, OnInit } from '@angular/core';
import { PlageNumDispo } from '../../../../models/PlageNumDispo'

@Component({
  selector: 'app-incineration',
  templateUrl: './incineration.component.html',
  styleUrls: ['./incineration.component.css']
})
export class IncinerationComponent implements OnInit {

  constructor(public pld : PlageNumDispo ) { }

  ngOnInit(): void {
  }

  afficherIncinerationPrevue(){}

}
