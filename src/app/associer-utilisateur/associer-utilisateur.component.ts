import {Component, ViewChild, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {ModalDirective} from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { Affecter } from '../../models/affecter.model';
import { AffectUserGroup } from '../../models/affectUserGroup.model';
import { Caisse } from '../../models/caisse.model';
import { GroupUser } from '../../models/groupUser.model';
import { Utilisateur } from '../../models/utilisateur.model';
import { AssocierUtilisateurService } from '../../services/administration/associer-utilisateur.service';
import { CaisseService } from '../../services/administration/caisse.service';
import { DroitGroupeService } from '../../services/administration/droit-groupe.service';
import { UtilisateurService } from '../../services/administration/utilisateur.service';
import { CommuneService } from '../../services/definition/commune.service';

@Component({
  selector: 'app-associer-utilisateur',
  templateUrl: './associer-utilisateur.component.html',
  styleUrls: ['./associer-utilisateur.component.css']
})
export class AssocierUtilisateurComponent implements OnInit {

  @ViewChild('primaryModal') public primaryModal: ModalDirective;
  @ViewChild('successModal') public successModal: ModalDirective;
  @ViewChild('warningModal') public warningModal: ModalDirective;
  @ViewChild('dangerModal') public dangerModal: ModalDirective;
  @ViewChild('infoModal') public infoModal: ModalDirective;

  @ViewChild('primaryModal2') public primaryModal2: ModalDirective;
  @ViewChild('successModal2') public successModal2: ModalDirective;
  @ViewChild('warningModal2') public warningModal2: ModalDirective;
  @ViewChild('dangerModal2') public dangerModal2: ModalDirective;
  @ViewChild('infoModal2') public infoModal2: ModalDirective;

  @ViewChild('primaryModal3') public primaryModal3: ModalDirective;
  @ViewChild('successModal3') public successModal3: ModalDirective;
  @ViewChild('warningModal3') public warningModal3: ModalDirective;
  @ViewChild('dangerModal3') public dangerModal3: ModalDirective;
  @ViewChild('infoModal3') public infoModal3: ModalDirective;

  dtOptions1: DataTables.Settings = {};
  dtOptions2: DataTables.Settings = {};
  dtOptions3: DataTables.Settings = {};
  dtTrigger1: Subject<any> = new Subject<any>();
  dtTrigger2: Subject<any> = new Subject<any>();
  dtTrigger3: Subject<any> = new Subject<any>();

  //Onglet Associer user à Arrondissement


  //Onglet Associer user à Caisse
  affecters:Affecter[];
  editAffecter : Affecter;
  suprAffecter: Affecter;
  addAffecterFormsGroup: FormGroup;
  editAffecterFormsGroup: FormGroup;

  //Onglet Associer user à Groupe d'Utilisateur
  affectUserToGroups: AffectUserGroup[];
  editAffectUserToGroup:AffectUserGroup;
  suprAffectUserToGroup:AffectUserGroup;
  addAffectUserToGroupFormsGroup:FormGroup;
  editAffectUserToGroupFormsGroup:FormGroup;

  //Quelques listes
  utilisateurs:Utilisateur[];
  arrondissements:String;
  groupUsers:GroupUser[];
  caisses:Caisse[];
  caissesByAArrondissement:Caisse[];


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
    this.dtOptions3 = {
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

  initForms(){
    this.addAffecterFormsGroup = this.formBulder.group({
      addDateDebAffecter:[new Date(), Validators.required],
      addDateFinAffecter:new Date(),
      addCaisse:[0, Validators.required],
      addUtilisateur:[0, Validators.required],
      addArrondissement:[0, Validators.required]
    });

    this.editAffecterFormsGroup = this.formBulder.group({
      editDateDebAffecter:[new Date(), Validators.required],
      editDateFinAffecter:new Date(),
      editCaisse:[0, Validators.required],
      editUtilisateur:[0, Validators.required],
      editArrondissement:[0, Validators.required]
    });

    this.addAffectUserToGroupFormsGroup = this.formBulder.group({
      addUtilisateur2:[0, Validators.required],
      addGroupUser:[0, Validators.required]
    });

    this.editAffectUserToGroupFormsGroup = this.formBulder.group({
      editUtilisateur2:[0, Validators.required],
      editGroupUser:[0, Validators.required]
    });

  }
  constructor(private serviceAssocierUser:AssocierUtilisateurService, private formBulder:FormBuilder,
    private serviceCaisse:CaisseService, private serviceUser:UtilisateurService,
    private serviceCommune:CommuneService, private serviceDroitGroup:DroitGroupeService) {
    this.initDtOptions();
    this.initForms();
  }

  ngOnInit(): void {

  }

  initEditAffecter(inde:number){
    this.warningModal2.show();
  }

  initDeleteAffecter(inde:number){
    this.dangerModal2.show();
  }

  onSubmitAddAffecterFormsGroup(){
    this.primaryModal2.hide();
  }

  onSubmitEditAffecterFormsGroup(){
    this.warningModal2.hide();
  }

  onConfirmDeleteAffecter(){
    this.dangerModal2.hide();
  }

  //Por l'onglet affectation d'un User à un group

  initEditAffecterUserToGroup(inde:number){
    this.warningModal3.show();
  }

  initDeleteAffecterUserToGroup(inde:number){
    this.dangerModal3.show();
  }

  onSubmitAddAffecterUserToGroup(){
    this.primaryModal3.hide();
  }

  onSubmitEditAffecterUserToGroup(){
    this.warningModal3.hide();
  }

  onConfirmDeleteAffecterUserToGroup(){
    this.dangerModal3.hide();
  }

}
