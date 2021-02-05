import {Component, ViewChild, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {ModalDirective} from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { Affecter } from '../../models/affecter.model';
import { AffectUserGroup } from '../../models/affectUserGroup.model';
import { Arrondissement } from '../../models/arrondissement.model';
import { Caisse } from '../../models/caisse.model';
import { Commune } from '../../models/commune.model';
import { Departement } from '../../models/departement.model';
import { GroupUser } from '../../models/groupUser.model';
import { Pays } from '../../models/pays.model';
import { Service } from '../../models/service.model';
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
  editAffecter : Affecter = new Affecter(new Date(), new Date(), new Caisse('', '', new Arrondissement('','','','',new Commune('','','','',new Departement('','',new Pays('','',''))))),
  new Utilisateur('', '', '', '', '', false, new Service('', '')));
  suprAffecter: Affecter = new Affecter(new Date(), new Date(), new Caisse('', '', new Arrondissement('','','','',new Commune('','','','',new Departement('','',new Pays('','',''))))),
  new Utilisateur('', '', '', '', '', false, new Service('', '')));
  addAffecterFormsGroup: FormGroup;
  editAffecterFormsGroup: FormGroup;

  //Onglet Associer user à Groupe d'Utilisateur
  affectUserToGroups: AffectUserGroup[];
  editAffectUserToGroup:AffectUserGroup = new AffectUserGroup(new Utilisateur('', '', '', '', '', false, new Service('', '')), new GroupUser('', ''));
  suprAffectUserToGroup:AffectUserGroup = new AffectUserGroup(new Utilisateur('', '', '', '', '', false, new Service('', '')), new GroupUser('', ''));
  addAffectUserToGroupFormsGroup:FormGroup;
  editAffectUserToGroupFormsGroup:FormGroup;

  //Quelques listes
  utilisateurs:Utilisateur[] = [];
  arrondissements:Arrondissement[] = [];
  groupUsers:GroupUser[] = [];
  caisses:Caisse[] = [];
  caissesByAArrondissement:Caisse[] = [];


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

    this.getAllUser();
    this.getAllCaisse();
    this.getAllUserGroup();
    this.serviceCommune.getAllArrondissement().subscribe(
      (data) => {
        this.arrondissements = data;
        if(this.arrondissements.length !=0)
        this.getAllCaisseByCodeArrondi(this.arrondissements[0].codeArrondi);
      },
      (erreur) => {
        console.log('Erreur lors de la récupération de la liste des arrondissements : ', erreur);
      }
    );


    this.serviceAssocierUser.getAllAffecter().subscribe(
      (data) => {
        this.affecters = data;
        this.dtTrigger2.next();
      },
      (erreur) => {
        console.log('Erreur lors de la récupération des affectations de User à Caisse : ', erreur);
      }
    );

    this.serviceAssocierUser.getAllAffectUserGroup().subscribe(
      (data) => {
        this.affectUserToGroups = data;
        this.dtTrigger3.next();
      },
      (erreur) => {
        console.log('Erreur lors de la récupération de la liste des affectation des utilisateurs au groupes', erreur );
      }
    );

  }

  getAllAffecter(){
    this.serviceAssocierUser.getAllAffecter().subscribe(
      (data) => {
        this.affecters = data;
      },
      (erreur) => {
        console.log('Erreur lors de la récupération des affectations de User à Caisse : ', erreur);
      }
    );
  }

  getAllUser(){
    this.serviceUser.getAllUsers().subscribe(
      (data) => {
        this.utilisateurs = data;
      },
      (erreur) => {
        console.log('Erreur lors de la récupération de la liste des utilisateurs : ', erreur);
      }
    );
  }

  getAllArrondissement(){
    this.serviceCommune.getAllArrondissement().subscribe(
      (data) => {
        this.arrondissements = data;
      },
      (erreur) => {
        console.log('Erreur lors de la récupération de la liste des arrondissements : ', erreur);
      }
    );
  }

  getAllCaisse(){
    this.serviceCaisse.getAllCaisse().subscribe(
      (data) => {
        this.caisses = data;
      },
      (erreur) => {
        console.log('Erreur lors de la récupération de la liste des caisses', erreur);
      }
    );

  }

  getAllCaisseByCodeArrondi(code:String){
    this.caissesByAArrondissement = [];
    this.caisses.forEach(element => {
      if(element.arrondissement.codeArrondi===code){
        this.caissesByAArrondissement.push(element);
      }
    });

  }

  getAllCaisseByFormsArrondi1(){
    this.getAllCaisseByCodeArrondi(this.arrondissements[this.addAffecterFormsGroup.value['addArrondissement']].codeArrondi);
  }

  getAllCaisseByFormsArrondi2(){
    this.getAllCaisseByCodeArrondi(this.arrondissements[this.editAffecterFormsGroup.value['editArrondissement']].codeArrondi);
  }

  initEditAffecter(inde:number){
    this.editAffecter = this.affecters[inde];
    this.warningModal2.show();
  }

  initDeleteAffecter(inde:number){
    this.suprAffecter = this.affecters[inde];
    this.dangerModal2.show();
  }

  onSubmitAddAffecterFormsGroup(){

    const newAffec = new Affecter(this.addAffecterFormsGroup.value['addDateDebAffecter'],
    this.addAffecterFormsGroup.value['addDateFinAffecter'],
    this.caissesByAArrondissement[this.addAffecterFormsGroup.value['addCaisse']],
    this.utilisateurs[this.addAffecterFormsGroup.value['addUtilisateur']]);

    this.serviceAssocierUser.addAAffecter(newAffec).subscribe(
      (data) => {
        this.primaryModal2.hide();
        this.getAllAffecter();
      },
      (erreur) => {
        console.log('Erreur lors de lAjout de la nouvelle Affecter', erreur);
      }
    );

  }

  onSubmitEditAffecterFormsGroup(){
    const newAffec = new Affecter(this.editAffecterFormsGroup.value['editDateDebAffecter'],
    this.editAffecterFormsGroup.value['editDateFinAffecter'],
    this.caissesByAArrondissement[this.editAffecterFormsGroup.value['editCaisse']],
    this.utilisateurs[this.editAffecterFormsGroup.value['editUtilisateur']]);

    this.serviceAssocierUser.editAAffecter(this.editAffecter.idAffecter.toString(), newAffec).subscribe(
      (data) => {
        this.warningModal2.hide();
        this.getAllAffecter();
      },
      (erreur) => {
        console.log('Erreur lors de la modification de lAffecter', erreur);
      }
    );


  }

  onConfirmDeleteAffecter(){
    this.serviceAssocierUser.deleteAAffecter(this.suprAffecter.idAffecter.toString()).subscribe(
      (data) => {
        this.dangerModal2.hide();
        this.getAllAffecter();
      },
      (erreur) => {
        console.log('Erreur lors de la suppression de lAffecter');
      }
    );

  }

  //Por l'onglet affectation d'un User à un group

  getAllAffecterUserToGroup(){
    this.serviceAssocierUser.getAllAffectUserGroup().subscribe(
      (data) => {
        this.affectUserToGroups = data;

      },
      (erreur) => {
        console.log('Erreur lors de la récupération de la liste des affectation des utilisateurs au groupes', erreur );
      }
    );
  }

  getAllUserGroup(){
    this.serviceDroitGroup.getAllGroupUser().subscribe(
      (data) => {
        this.groupUsers = data;
      },
      (erreur) => {
        console.log('Erreur lors de la récupération de la liste des groupes dUtilisateur ', erreur);
      }
    );
  }

  initEditAffecterUserToGroup(inde:number){
    this.editAffectUserToGroup = this.affectUserToGroups[inde];
    this.warningModal3.show();
  }

  initDeleteAffecterUserToGroup(inde:number){
    this.suprAffectUserToGroup = this.affectUserToGroups[inde];
    this.dangerModal3.show();
  }

  onSubmitAddAffecterUserToGroup(){

    const newAffectUserToGrou = new AffectUserGroup(
      this.utilisateurs[this.addAffectUserToGroupFormsGroup.value['addUtilisateur2']],
      this.groupUsers[this.addAffectUserToGroupFormsGroup.value['addGroupUser']]);
    this.serviceAssocierUser.addAAffectUserGroup(newAffectUserToGrou).subscribe(
      (data) => {
        this.primaryModal3.hide();
        this.getAllAffecterUserToGroup();
      },
      (erreur) => {
        console.log('Erreur lors de lAffectation de lUtilisateur au groupe', erreur);
      }
    );

  }

  onSubmitEditAffecterUserToGroup(){
    const newAffectUserToGrou = new AffectUserGroup(
      this.utilisateurs[this.editAffectUserToGroupFormsGroup.value['editUtilisateur2']],
      this.groupUsers[this.editAffectUserToGroupFormsGroup.value['editGroupUser']]);
    this.serviceAssocierUser.editAAffectUserGroup(this.editAffectUserToGroup.idAffectUserGroup.toString(), newAffectUserToGrou).subscribe(
      (data) => {
        this.warningModal3.hide();
        this.getAllAffecterUserToGroup();
      },
      (erreur) => {
        console.log('Erreur lors de la modificatation de lAffectation au group dUtilisateur', erreur);
      }
    );

  }

  onConfirmDeleteAffecterUserToGroup(){
    this.serviceAssocierUser.deleteAAffectUserGroup(this.suprAffectUserToGroup.idAffectUserGroup.toString()).subscribe(
      (data) => {
        this.dangerModal3.hide();
        this.getAllAffecterUserToGroup();
      },
      (erreur) => {
        console.log('Erreur lors de la suppression de lAffectation', erreur);
      }
    );

  }

}
