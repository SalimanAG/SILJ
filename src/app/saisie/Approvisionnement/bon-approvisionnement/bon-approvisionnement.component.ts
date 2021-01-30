import { Component, OnInit, ViewChild } from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-bon-approvisionnement',
  templateUrl: './bon-approvisionnement.component.html',
  styleUrls: ['./bon-approvisionnement.component.css']
})
export class BonApprovisionnementComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  //Valeurs locative
  @ViewChild('addBonModal') public addBonModal: ModalDirective;
  @ViewChild('editBonModal') public editBonModal: ModalDirective;
  @ViewChild('deleteBonModal') public deleteBonModal: ModalDirective;
}
