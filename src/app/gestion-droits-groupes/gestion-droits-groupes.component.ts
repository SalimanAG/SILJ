import {Component, ViewChild, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {ModalDirective} from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { AffectDroitGroupUser } from '../../models/affectDroitGroupUser.model';
import { DroitUser } from '../../models/droitUser.model';
import { GroupUser } from '../../models/groupUser.model';
import { DroitGroupeService } from '../../services/administration/droit-groupe.service';

@Component({
  selector: 'app-gestion-droits-groupes',
  templateUrl: './gestion-droits-groupes.component.html',
  styleUrls: ['./gestion-droits-groupes.component.css']
})
export class GestionDroitsGroupesComponent implements OnInit {

  @ViewChild('primaryModal') public primaryModal: ModalDirective;
  @ViewChild('successModal') public successModal: ModalDirective;
  @ViewChild('warningModal') public warningModal: ModalDirective;
  @ViewChild('dangerModal') public dangerModal: ModalDirective;
  @ViewChild('infoModal') public infoModal: ModalDirective;

  @ViewChild('primaryModal3') public primaryModal3: ModalDirective;
  @ViewChild('successModal3') public successModal3: ModalDirective;
  @ViewChild('warningModal3') public warningModal3: ModalDirective;
  @ViewChild('dangerModal3') public dangerModal3: ModalDirective;
  @ViewChild('infoModal3') public infoModal3: ModalDirective;

  dtOptions1: DataTables.Settings = {};
  dtOptions2: DataTables.Settings = {};
  dtTrigger1: Subject<any> = new Subject<any>();
  dtTrigger2: Subject<any> = new Subject<any>();

  //Onglet associé aux groupes d'user
  groupeUsers:GroupUser[];
  editGroupUser:GroupUser;
  suprGroupUser:GroupUser;
  addGroupUserFormsGroup:FormGroup;
  editGroupUserFormsGroup:FormGroup;

  //Onglet associé à l'affectation de droit d'utilisateur à un groupe d'utilisateur
  droitUsers:DroitUser[];//Liste des droits d'utilisateur
  affectDroitGroupUsers:AffectDroitGroupUser[];
  editAffectDroitGroupUser:AffectDroitGroupUser;
  suprAffectDroitGroupUser:AffectDroitGroupUser;
  addAffectDroitGroupUserFormsGroup:FormGroup;
  editAffectDroitGroupUserFormsGroup:FormGroup;

  initDtOptions(){
    this.dtOptions1 = {
      pagingType: 'full_numbers',
      pageLength: 5,
      lengthMenu: [5, 10, 25, 50, 100],
      language: {
        lengthMenu: "Affichage de _MENU_ lignes par page",
        zeroRecords: "Aucune ligne trouvée - Desolé",
        info: "Affichage de la page _PAGE_ sur _PAGES_",
        infoEmpty: "Pas de ligne trouvée",
        infoFiltered: "(Filtré à partie de _MAX_ lignes)",
        search: "Rechercher",
        loadingRecords: "Chargement en cours...",
        paginate:{
          first:"Début",
          last: "Fin",
          next: "Suivant",
          previous: "Précédent"
        }
      }
    };
    this.dtOptions2 = {
      pagingType: 'full_numbers',
      pageLength: 5,
      lengthMenu: [5, 10, 25, 50, 100],
      language: {
        lengthMenu: "Affichage de _MENU_ lignes par page",
        zeroRecords: "Aucune ligne trouvée - Desolé",
        info: "Affichage de la page _PAGE_ sur _PAGES_",
        infoEmpty: "Pas de ligne trouvée",
        infoFiltered: "(Filtré à partie de _MAX_ lignes)",
        search: "Rechercher",
        loadingRecords: "Chargement en cours...",
        paginate:{
          first:"Début",
          last: "Fin",
          next: "Suivant",
          previous: "Précédent"
        }
      }
    };
  }

  initFormsGroup(){
    this.addGroupUserFormsGroup = this.formBulder.group({
      addIdGroupUser:['', Validators.required],
      addLibGroupUser:['', Validators.required]
    });

    this.editGroupUserFormsGroup = this.formBulder.group({
      editIdGroupUser:['', Validators.required],
      editLibGroupUser:['', Validators.required]
    });

    this.addAffectDroitGroupUserFormsGroup = this.formBulder.group({
      addDroitUser:[0, Validators.required],
      addGroupUser:[0, Validators.required]
    });

    this.editAffectDroitGroupUserFormsGroup = this.formBulder.group({
      editDroitUser:[0, Validators.required],
      editGroupUser:[0, Validators.required]
    });

  }

  constructor(private serviceDroitUser:DroitGroupeService, private formBulder:FormBuilder) {
    this.initDtOptions();
    this.initFormsGroup();
  }

  ngOnInit(): void {
  }

  initEditGroupUser(inde:number){
    this.warningModal3.show();
  }

  initDeleteGroupUser(inde:number){
    this.dangerModal3.show();
  }

  onSubmitAddGroupUserFormsGroup(){
    this.primaryModal3.hide();
  }

  onSubmitEditGroupUserFormsGroup(){
    this.warningModal3.hide();
  }

  onConfirmDeleteGroupUser(){
    this.dangerModal3.hide();
  }


  //Pour Onglet Affectation de droit d'utilisateur à un group d'user
  initEditAffectDroitGroupUser(inde:number){
    this.warningModal.show();
  }

  initDeleteAffectDroitGroupUser(inde:number){
    this.dangerModal.show();
  }

  onSubmitAddAffectDroitGroupUserFormsGroup(){
    this.primaryModal.hide();
  }

  onSubmitEditAffectDroitGroupUserFormsGroup(){
    this.warningModal.hide();
  }

  onConfirmDeleteAffectDroitGroupUser(){
    this.dangerModal.hide();
  }


}
