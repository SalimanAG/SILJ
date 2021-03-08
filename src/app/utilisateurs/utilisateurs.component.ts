import {Component, ViewChild, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { data } from 'jquery';
import {ModalDirective} from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { Service } from '../../models/service.model';
import { Utilisateur } from '../../models/utilisateur.model';
import { UtilisateurService } from '../../services/administration/utilisateur.service';
import { CommuneService } from '../../services/definition/commune.service';

@Component({
  selector: 'app-utilisateurs',
  templateUrl: './utilisateurs.component.html',
  styleUrls: ['./utilisateurs.component.css']
})
export class UtilisateursComponent implements OnInit {

  @ViewChild('primaryModal') public primaryModal: ModalDirective;
  @ViewChild('successModal') public successModal: ModalDirective;
  @ViewChild('warningModal') public warningModal: ModalDirective;
  @ViewChild('dangerModal') public dangerModal: ModalDirective;
  @ViewChild('infoModal') public infoModal: ModalDirective;

  dtOptions1: DataTables.Settings = {};
  dtTrigger1: Subject<any> = new Subject<any>();
  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;
  addUserFormsGroup: FormGroup;
  editUserFormsGroup: FormGroup;
  utilisateurs:Utilisateur[];
  editUser:Utilisateur = new Utilisateur('', '', '', '', '', false, new Service('',''));
  suprUser:Utilisateur = new Utilisateur('', '', '', '', '', false, new Service('',''));
  infosUser:Utilisateur = new Utilisateur('', '', '', '', '', false, new Service('',''));

  //liste des services
  services:Service[];

  constructor(private serviceUser:UtilisateurService, private formBulder:FormBuilder, private serviceCommune:CommuneService) {
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

    this.addUserFormsGroup = this.formBulder.group({
      addLogin:['', Validators.required],
      addMotDePass:'',
      addNomUtilisateur:['', Validators.required],
      addPrenomUtilisateur:['', Validators.required],
      addFonctionUtilisateur:'',
      addActiveUtilisateur:false,
      addService:0
    });

    this.editUserFormsGroup = this.formBulder.group({
      editLogin:['', Validators.required],
      editMotDePass:'',
      editNomUtilisateur:['', Validators.required],
      editPrenomUtilisateur:['', Validators.required],
      editFonctionUtilisateur:'',
      editActiveUtilisateur:false,
      editService:0,
      editAskMdp:false
    });
  }

  ngOnInit(): void {
    this.serviceUser.getAllUsers().subscribe(
      (data) => {
        this.utilisateurs = data;
        this.dtTrigger1.next();
      },
      (erreur) => {
        console.log('Erreur lors de la récupération de la liste des utilisateurs : ', erreur);
      }
    );

    this.getAllService();

  }

  getAllService(){
    this.serviceCommune.getAllService().subscribe(
      (data) => {
        this.services = data;
      },
      (erreur) => {
        console.log('Erreur lors de la récupération de la liste des services : ', erreur);
      }
    );
  }

  getAllUser(){
    this.serviceUser.getAllUsers().subscribe(
      (data) => {
        this.utilisateurs = data;
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
          this.dtTrigger1.next();
        });
      },
      (erreur) => {
        console.log('Erreur lors de la récupération de la liste des utilisateurs : ', erreur);
      }
    );

  }

  initEditUser(inde:number){
    this.editUser = this.utilisateurs[inde];
    this.warningModal.show();
  }

  initInfosUser(inde:number){
    this.infosUser = this.utilisateurs[inde];
    this.infoModal.show();
  }

  initDeleteUser(inde:number){
    this.suprUser = this.utilisateurs[inde];
    this.dangerModal.show();
  }

  onSubmitAddUserFormsGroup(){
    const newUser = new Utilisateur(this.addUserFormsGroup.value['addLogin'], null,
    this.addUserFormsGroup.value['addNomUtilisateur'], this.addUserFormsGroup.value['addPrenomUtilisateur'],
    this.addUserFormsGroup.value['addFonctionUtilisateur'], this.addUserFormsGroup.value['addActiveUtilisateur'],
    this.services[this.addUserFormsGroup.value['addService']], true);

    this.serviceUser.addAUser(newUser).subscribe(
      (data) => {
        this.primaryModal.hide();
        this.getAllUser();
      },
      (erreur) => {
        console.log('Erreur lors de lAjout de lUtilisateur : ', erreur);
      }
    );


  }

  onSubmitEditUserFormsGroup(){
    const newUser = new Utilisateur(this.editUserFormsGroup.value['editLogin'], null,
    this.editUserFormsGroup.value['editNomUtilisateur'], this.editUserFormsGroup.value['editPrenomUtilisateur'],
    this.editUserFormsGroup.value['editFonctionUtilisateur'], this.editUserFormsGroup.value['editActiveUtilisateur'],
    this.services[this.editUserFormsGroup.value['editService']], this.editUserFormsGroup.value['editAskMdp']);//editAskMdp

    newUser.idUtilisateur = this.editUser.idUtilisateur;

    this.serviceUser.editAUser(this.editUser.idUtilisateur.toString(), newUser).subscribe(
      (data) => {
        this.warningModal.hide();
        this.getAllUser();
      },
      (erreur) => {
        console.log('Erreur lors de la modification de lUser : ', erreur);
      }
    );

  }

  onConfirmDeleteUser(){

    this.serviceUser.deleteAUser(this.suprUser.idUtilisateur.toString()).subscribe(
      (data) => {
        this.dangerModal.hide();
        this.getAllUser();
      },
      (erreur) => {
        console.log('Erreur lors de la suppression : ', erreur);
      }
    );


  }



}
