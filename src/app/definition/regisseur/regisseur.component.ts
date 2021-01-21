import { Component, OnInit, ViewChild } from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-regisseur',
  templateUrl: './regisseur.component.html',
  styleUrls: ['./regisseur.component.css']
})
export class RegisseurComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  //Valeurs locative
  @ViewChild('addregModal') public addregModal: ModalDirective;
  @ViewChild('editregModal') public editregModal: ModalDirective;
  @ViewChild('deleteregModal') public deleteregModal: ModalDirective;

}
