import { Component, OnInit, ViewChild } from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-demande-approvisionnement',
  templateUrl: './demande-approvisionnement.component.html',
  styleUrls: ['./demande-approvisionnement.component.css']
})
export class DemandeApprovisionnementComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

 //Valeurs locative
  @ViewChild('addDAModal') public addDAModal: ModalDirective;
  @ViewChild('editDAModal') public editDAModal: ModalDirective;
  @ViewChild('deleteDAModal') public deleteDAModal: ModalDirective;

}
