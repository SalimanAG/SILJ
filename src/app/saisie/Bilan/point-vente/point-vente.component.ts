import { Component, OnInit, ViewChild } from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-point-vente',
  templateUrl: './point-vente.component.html',
  styleUrls: ['./point-vente.component.css']
})
export class PointVenteComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  //Valeurs locative
  @ViewChild('addPVModal') public addPVModal: ModalDirective;
  @ViewChild('editPVModal') public editPVModal: ModalDirective;
  @ViewChild('deletePVModal') public deletePVModal: ModalDirective;

}
