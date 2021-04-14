import {Component, ViewChild, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { data } from 'jquery';
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
  editGroupUser:GroupUser = new GroupUser('', '');
  suprGroupUser:GroupUser = new GroupUser('', '');
  addGroupUserFormsGroup:FormGroup;
  editGroupUserFormsGroup:FormGroup;

  //Onglet associé à l'affectation de droit d'utilisateur à un groupe d'utilisateur
  droitUsers:DroitUser[];//Liste des droits d'utilisateur
  affectDroitGroupUsers:AffectDroitGroupUser[];
  editAffectDroitGroupUser:AffectDroitGroupUser = new AffectDroitGroupUser(new DroitUser('', '', ''), new GroupUser('', ''));
  suprAffectDroitGroupUser:AffectDroitGroupUser = new AffectDroitGroupUser(new DroitUser('', '', ''), new GroupUser('', ''));
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
    this.serviceDroitUser.getAllGroupUser().subscribe(
      (data) => {
        this.groupeUsers = data;
        this.dtTrigger1.next();
      },
      (erreur) => {
        console.log('Erreur lors de la récupération de la liste des groupes dUtilisateur', erreur);
      }
    );

    this.serviceDroitUser.getAllAffectDroitGroup().subscribe(
      (data) => {
        this.affectDroitGroupUsers = data;
        this.dtTrigger2.next();
      },
      (erreur) => {
        console.log('Erreur lors du chargement de la liste des Affectations de droit au groupe dUtilisateur', erreur);
      }
    );

    this.getAllDroit();
  }

  getAllGroupUser(){
    this.serviceDroitUser.getAllGroupUser().subscribe(
      (data) => {
        this.groupeUsers = data;
        $('#dataTable1').dataTable().api().destroy();
        this.dtTrigger1.next();
      },
      (erreur) => {
        console.log('Erreur lors de la récupération de la liste des groupes dUtilisateur', erreur);
      }
    );
  }

  initEditGroupUser(inde:number){
    this.editGroupUser = this.groupeUsers[inde];
    this.warningModal3.show();
  }

  initDeleteGroupUser(inde:number){
    this.suprGroupUser = this.groupeUsers[inde];
    this.dangerModal3.show();
  }

  onSubmitAddGroupUserFormsGroup(){

    const newGroup = new GroupUser(this.addGroupUserFormsGroup.value['addIdGroupUser'], this.addGroupUserFormsGroup.value['addLibGroupUser']);
    this.serviceDroitUser.addAGroupUser(newGroup).subscribe(
      (data) => {
        //this.primaryModal3.hide();
        this.addGroupUserFormsGroup.reset();
        this.getAllGroupUser();
      },
      (erreur) => {
        console.log('Erreur lors de la création du groupe dUtilisateur', erreur);
      }
    );

  }

  onSubmitEditGroupUserFormsGroup(){
    const newGroup = new GroupUser(this.editGroupUserFormsGroup.value['editIdGroupUser'], this.editGroupUserFormsGroup.value['editLibGroupUser']);
    this.serviceDroitUser.editAGroupUser(this.editGroupUser.idGroupUser, newGroup).subscribe(
      (data) => {
        this.warningModal3.hide();
        this.getAllGroupUser();
      },
      (erreur) => {
        console.log('Erreur lors de la modification du group dUtilisateur', erreur);
      }
    );

  }

  onConfirmDeleteGroupUser(){
    this.serviceDroitUser.deleteAGroupUser(this.suprGroupUser.idGroupUser).subscribe(
      (data) => {
        this.dangerModal3.hide();
        this.getAllGroupUser();
      },
      (erreur) => {
        console.log('Erreur lors de la suppression du groupe dUtilisateur', erreur);
      }
    );

  }


  //Pour Onglet Affectation de droit d'utilisateur à un group d'user
  getAllAffectDroitToGroup(){
    this.serviceDroitUser.getAllAffectDroitGroup().subscribe(
      (data) => {
        this.affectDroitGroupUsers = data;
        $('#dataTable2').dataTable().api().destroy();
        this.dtTrigger2.next();
      },
      (erreur) => {
        console.log('Erreur lors du chargement de la liste des Affectations de droit au groupe dUtilisateur', erreur);
      }
    );
  }

  getAllDroit(){
    this.serviceDroitUser.getAllDroitUser().subscribe(
      (data) => {
        this.droitUsers = data;
      },
      (erreur) => {
        console.log('Erreur lors de la récupération de la liste des droits dUtilisateur', erreur);
      }
    );
  }

  initEditAffectDroitGroupUser(inde:number){
    this.editAffectDroitGroupUser = this.affectDroitGroupUsers[inde];
    this.warningModal.show();
  }

  initDeleteAffectDroitGroupUser(inde:number){
    this.suprAffectDroitGroupUser = this.affectDroitGroupUsers[inde];
    this.dangerModal.show();
  }

  onSubmitAddAffectDroitGroupUserFormsGroup(){

    const newAffectDroitToGroup = new AffectDroitGroupUser(
      this.droitUsers[this.addAffectDroitGroupUserFormsGroup.value['addDroitUser']],
      this.groupeUsers[this.addAffectDroitGroupUserFormsGroup.value['addGroupUser']]
    )

    this.serviceDroitUser.addAAffectDroitGroupUser(newAffectDroitToGroup).subscribe(
      (data) => {
        this.primaryModal.hide();
        this.getAllAffectDroitToGroup();
      },
      (erreur) => {
        console.log('Erreur lors de lAjout de lAffectation de droit au groupe User', erreur);
      }
    );


  }

  onSubmitEditAffectDroitGroupUserFormsGroup(){
    const newAffectDroitToGroup = new AffectDroitGroupUser(
      this.droitUsers[this.editAffectDroitGroupUserFormsGroup.value['editDroitUser']],
      this.groupeUsers[this.editAffectDroitGroupUserFormsGroup.value['editGroupUser']]
    )
    this.serviceDroitUser.editAAffectDroitGroupUser(this.editAffectDroitGroupUser.idAffectDroitGroup.toString(), newAffectDroitToGroup).subscribe(
      (data) => {
        this.warningModal.hide();
        this.getAllAffectDroitToGroup();
      },
      (erreur) => {
        console.log('Erreur lors de la modification de lAffection', erreur);
      }
    );

  }

  onConfirmDeleteAffectDroitGroupUser(){
    this.serviceDroitUser.deleteAAffectDroitGroupUser(this.suprAffectDroitGroupUser.idAffectDroitGroup.toString()).subscribe(
      (data) => {
        this.dangerModal.hide();
        this.getAllAffectDroitToGroup();
      },
      (erreur) => {
        console.log('Erreur lors de la suppression de LAffectation', erreur);
      }
    );

  }


}
