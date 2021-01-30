import { Component, OnInit,ViewChild } from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-placement',
  templateUrl: './placement.component.html',
  styleUrls: ['./placement.component.css']
})
export class PlacementComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  //Valeurs locative
  @ViewChild('addPlaModal') public addPlaModal: ModalDirective;
  @ViewChild('editPlaModal') public editPlaModal: ModalDirective;
  @ViewChild('deletePlaModal') public deletePlaModal: ModalDirective;
}
