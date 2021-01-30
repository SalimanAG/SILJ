import {Component, ViewChild, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import {ModalDirective} from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { Utilisateur } from '../../models/utilisateur.model';
import { UtilisateurService } from '../../services/administration/utilisateur.service';

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
  editUser:Utilisateur = new Utilisateur('', '', '', '', '', false, '');
  suprUser:Utilisateur = new Utilisateur('', '', '', '', '', false, '');
  infosUser:Utilisateur = new Utilisateur('', '', '', '', '', false, '');

  constructor(private serviceUser:UtilisateurService, private formBulder:FormBuilder) {
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
      addService:''
    });

    this.editUserFormsGroup = this.formBulder.group({
      editLogin:['', Validators.required],
      editMotDePass:['', Validators.required],
      editNomUtilisateur:['', Validators.required],
      editPrenomUtilisateur:['', Validators.required],
      editFonctionUtilisateur:'',
      editActiveUtilisateur:false,
      editService:''
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
    const newUser = new Utilisateur(this.addUserFormsGroup.value['addLogin'], this.addUserFormsGroup.value['addMotDePass'],
    this.addUserFormsGroup.value['addNomUtilisateur'], this.addUserFormsGroup.value['addPrenomUtilisateur'],
    this.addUserFormsGroup.value['addFonctionUtilisateur'], this.addUserFormsGroup.value['addActiveUtilisateur'],
    this.addUserFormsGroup.value['addService']);

    console.log('Objet à Ajouter : ', newUser);

    this.utilisateurs.push(newUser);
    this.primaryModal.hide();
    
  }

  onSubmitEditUserFormsGroup(){
    const newUser = new Utilisateur(this.editUserFormsGroup.value['editLogin'], this.editUserFormsGroup.value['editMotDePass'],
    this.editUserFormsGroup.value['editNomUtilisateur'], this.editUserFormsGroup.value['editPrenomUtilisateur'],
    this.editUserFormsGroup.value['editFonctionUtilisateur'], this.editUserFormsGroup.value['editActiveUtilisateur'],
    this.editUserFormsGroup.value['editService']);

    console.log('Objet à Modifier : ', this.editUser);
    console.log('Objet à Obtenu : ', newUser);

    this.warningModal.hide();

  }

  onConfirmDeleteUser(){
    /*
    this.serviceUser.deleteAUser(this.suprUser.idUtilisateur.toString()).subscribe(
      (data) => {
        this.dangerModal.hide();
      },
      (erreur) => {
        console.log('Erreur lors de la suppression : ', erreur);
      }
    );*/
    console.log('Objet à Supprimer : ', this.suprUser);
    this.dangerModal.hide();

  }



}
