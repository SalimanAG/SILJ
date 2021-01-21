import { Component, OnInit, ViewChild } from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-valeurs-locatives',
  templateUrl: './valeurs-locatives.component.html',
  styleUrls: ['./valeurs-locatives.component.css']
})
export class ValeursLocativesComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
//Valeurs locative
  @ViewChild('addvaleursModal') public addvaleursModal: ModalDirective;
  @ViewChild('editModal') public editModal: ModalDirective;
  @ViewChild('deleteModal') public deleteModal: ModalDirective;

//Type Valeurs locative
  @ViewChild('addTypeModal') public addTypeModal: ModalDirective;
  @ViewChild('editTypeModal') public editTypeModal: ModalDirective;
  @ViewChild('deleteTypeModal') public deleteTypeModal: ModalDirective;

//prix Valeurs locative
  @ViewChild('addPrixModal') public addPrixModal: ModalDirective;
  @ViewChild('editPrixModal') public editPrixModal: ModalDirective;
  @ViewChild('deletePrixModal') public deletePrixModal: ModalDirective;

}
