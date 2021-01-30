import { Component, OnInit, ViewChild } from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-reception',
  templateUrl: './reception.component.html',
  styleUrls: ['./reception.component.css']
})
export class ReceptionComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  //Valeurs locative
  @ViewChild('addRecepModal') public addRecepModal: ModalDirective;
  @ViewChild('editRecepModal') public editRecepModal: ModalDirective;
  @ViewChild('deleteRecepModal') public deleteRecepModal: ModalDirective;

}
