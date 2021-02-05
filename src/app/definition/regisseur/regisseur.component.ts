import {Component, ViewChild, OnInit} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap/modal';
import { AppBreadcrumbService } from '@coreui/angular/lib/breadcrumb/app-breadcrumb.service';
import { RegisseurService } from '../../../services/definition/regisseur.service';
import { UtilisateurService } from '../../../services/administration/utilisateur.service';
import { CorrespondantService } from '../../../services/definition/correspondant.service';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { data } from 'jquery';
import { Router } from '@angular/router';
import { Utilisateur } from '../../../models/utilisateur.model';
import { Magasinier } from '../../../models/magasinier.model';
import { Regisseur } from '../../../models/regisseur.model';

@Component({
  selector: 'app-regisseur',
  templateUrl: './regisseur.component.html',
  styleUrls: ['./regisseur.component.css']
})
export class RegisseurComponent implements OnInit {

  //dtOptions1: DataTables.Settings = {};

  constructor() { }

  ngOnInit(): void {
  }

}
