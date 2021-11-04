import {Component, ViewChild, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {ModalDirective} from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import * as moment from  'moment';
import { AffectUserToArrondi } from '../../../../models/affectUserToArrondi.model';
import { Utilisateur } from '../../../../models/utilisateur.model';
import { Fonction } from '../../../../models/fonction.model';
import { Service } from '../../../../models/service.model';
import { Arrondissement } from '../../../../models/arrondissement.model';
import { Commune } from '../../../../models/commune.model';
import { Departement } from '../../../../models/departement.model';
import { Pays } from '../../../../models/pays.model';
import { Affecter } from '../../../../models/affecter.model';
import { Caisse } from '../../../../models/caisse.model';
import { AffectUserGroup } from '../../../../models/affectUserGroup.model';
import { GroupUser } from '../../../../models/groupUser.model';
import { AssocierUtilisateurService } from '../../../../services/administration/associer-utilisateur.service';
import { UtilisateurService } from '../../../../services/administration/utilisateur.service';
import { CaisseService } from '../../../../services/administration/caisse.service';
import { CommuneService } from '../../../../services/definition/commune.service';
import { DroitGroupeService } from '../../../../services/administration/droit-groupe.service';
import { Compte } from '../../../../models/comptabilite/compte.model';
import { CompteService } from '../../../../services/comptabilite/compte.service';
import { Associer } from '../../../../models/comptabilite/assossiercompte.model';
import { Article } from '../../../../models/article.model';
import { Famille } from '../../../../models/famille.model';
import { Uniter } from '../../../../models/uniter.model';
import { AssocierService } from '../../../../services/comptabilite/associer.service';
import { ArticleService } from '../../../../services/definition/article.service';
import { AffectComptToCaisse } from '../../../../models/comptabilite/affectComptToCaisse.model';
import { AffectComptToCaisseService } from '../../../../services/comptabilite/affectComptToCaisse.service';

@Component({
  selector: 'app-compte',
  templateUrl: './compte.component.html',
  styleUrls: ['./compte.component.css']
})
export class CompteComponent implements OnInit {

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

  //Onglet Compte
  comptes:Compte[] = [];
  editCompte : Compte = new Compte(null, '', '', '','');
  suprCompte:  Compte = new Compte(null, '', '', '','');
  addCompteFormsGroup: FormGroup;
  editCompteFormsGroup: FormGroup;

  //Onglet Associer Compte à Article
  associers:Associer[];
  editAssocier : Associer = new Associer(null, new Date(), new Date(),
  new Article('', '', true, true, true, true, 0, '', new Famille('',''), new Uniter('','')) ,
  new Compte(null, '', '', '',''));
  suprAssocier: Associer = new Associer(null, new Date(), new Date(),
  new Article('', '', true, true, true, true, 0, '', new Famille('',''), new Uniter('','')) ,
  new Compte(null, '', '', '',''));
  addAssocierFormsGroup: FormGroup;
  editAssocierFormsGroup: FormGroup;

  //Onglet Associer Compte à Caisse
  affectComptToCaisses: AffectComptToCaisse[];
  editAffectComptToCaisse:AffectComptToCaisse = new AffectComptToCaisse(null, new Date(), new Date(),
  new Compte(null, '', '', '',''),
  new Caisse('', '', new Arrondissement('','','','',new Commune('','','','',new Departement('','',new Pays('','',''))))));
  suprAffectComptToCaisse:AffectComptToCaisse = new AffectComptToCaisse(null, new Date(), new Date(),
  new Compte(null, '', '', '',''),
  new Caisse('', '', new Arrondissement('','','','',new Commune('','','','',new Departement('','',new Pays('','',''))))));
  addAffectComptToCaisseFormsGroup:FormGroup;
  editAffectComptToCaisseFormsGroup:FormGroup;

  //Quelques listes
  articles:Article[] = [];
  caisses:Caisse[] = [];


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
    this.addAssocierFormsGroup = this.formBulder.group({
      addIdComArt:[null],
      addDebComArt:[moment(Date.now()).format('yyyy-MM-DD'), Validators.required],
      addFinComArt:'',
      addArticle:[0, Validators.required],
      addCompte:[0, Validators.required],
      
    });

    this.editAssocierFormsGroup = this.formBulder.group({
      editIdComArt:[null],
      editDebComArt:[moment(Date.now()).format('yyyy-MM-DD'), Validators.required],
      editFinComArt:'',
      editArticle:[0, Validators.required],
      editCompte:[0, Validators.required],
      
    });

    this.addAffectComptToCaisseFormsGroup = this.formBulder.group({
      addIdAffectComptCai:[null],
      addDatDebAffComptCai:[moment(Date.now()).format('yyyy-MM-DD'), Validators.required],
      addDatFinAffComptCai:null,
      addCompte2:[0, Validators.required],
      addCaisse:[0, Validators.required],
      
    });

    this.editAffectComptToCaisseFormsGroup = this.formBulder.group({
      editIdAffectComptCai:[null],
      editDatDebAffComptCai:[moment(Date.now()).format('yyyy-MM-DD'), Validators.required],
      editDatFinAffComptCai:null,
      editCompte2:[0, Validators.required],
      editCaisse:[0, Validators.required],
      
    });

    this.addCompteFormsGroup = this.formBulder.group({
      addIdCpte: [null],
      addNumCpte:[null, Validators.required],
      addLibCpte:[null, Validators.required],
      addCollectif:[null],
    });

    this.editCompteFormsGroup = this.formBulder.group({
      editIdCpte: [null],
      editNumCpte:[null, Validators.required],
      editLibCpte:[null, Validators.required],
      editCollectif:[null],
    });

  }
  constructor(private serviceAssocierUser:AssocierUtilisateurService, private formBulder:FormBuilder,
    private serviceCaisse:CaisseService,
    private serviceCompte: CompteService, private serviceAssocier: AssocierService,
    private serviceArticle: ArticleService, private serviceAffectComptToCaisse: AffectComptToCaisseService) {
    this.initDtOptions();
    this.initForms();
  }

  ngOnInit(): void {

    this.getAllCaisse();

    this.getAllArticle();
    
    this.serviceAssocier.getAllAssocier().subscribe(
      (data) => {
        this.associers = data;
        this.dtTrigger2.next();
      },
      (erreur) => {
        console.log('Erreur lors de la récupération des affectations de Compte à Article : ', erreur);
      }
    );

    this.serviceAffectComptToCaisse.getAllAffectComptToCaisse().subscribe(
      (data) => {
        this.affectComptToCaisses = data;
        this.dtTrigger3.next();
      },
      (erreur) => {
        console.log('Erreur lors de la récupération de la liste des affectation de Compte à Caisse', erreur );
      }
    );

    this.serviceCompte.getAllCompte().subscribe(
      (data) => {
        this.comptes = data;
        this.dtTrigger1.next();
      },
      (erreur) => {
        console.log('Erreur lors de la récupération de la liste des comptes', erreur);
      }
    );

  }

  getAllAssocier(){
    this.serviceAssocier.getAllAssocier().subscribe(
      (data) => {
        this.associers = data;
        $('#dataTable2').dataTable().api().destroy();
        this.dtTrigger2.next();
      },
      (erreur) => {
        console.log('Erreur lors de la récupération des affectations de Compte à Article : ', erreur);
      }
    );
  }


  getAllArticle(){
    this.serviceArticle.getAllArticle().subscribe(
      (data) => {
        this.articles = data;
      },
      (erreur) => {
        console.log('Erreur lors de la récupération de la liste des articles : ', erreur);
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


  initEditAssocier(inde:number){
    this.editAssocier = this.associers[inde];
    this.editAssocierFormsGroup.patchValue({
      editIdComArt: this.editAssocier.idComArt,
      editDebComArt: this.editAssocier.debComArt,
      editFinComArt: this.editAssocier.finComArt,
      editArticle: this.articles.findIndex( ar => ar.codeArticle == this.editAssocier.article.codeArticle),
      editCompte: this.comptes.findIndex( cp => cp.idCpte == this.editAssocier.compte.idCpte),
    });
    this.warningModal2.show();
  }

  initDeleteAssocier(inde:number){
    this.suprAssocier = this.associers[inde];
    this.dangerModal2.show();
  }

  onSubmitAddAssocierFormsGroup(){

    const newAssocier = new Associer(null, this.addAssocierFormsGroup.value['addDebComArt'],
    this.addAssocierFormsGroup.value['addFinComArt'],
    this.articles[this.addAssocierFormsGroup.value['addArticle']],
    this.comptes[this.addAssocierFormsGroup.value['addCompte']]);

    this.serviceAssocier.addAAssocier(newAssocier).subscribe(
      (data) => {
        
        this.primaryModal2.hide();
        this.getAllAssocier();
      },
      (erreur) => {
        console.log('Erreur lors de lAjout de la nouvelle Association', erreur);
      }
    );

  }

  onSubmitEditAssocierFormsGroup(){
    const newAssocier = new Associer(null, this.editAssocierFormsGroup.value['editDebComArt'],
    this.editAssocierFormsGroup.value['editFinComArt'],
    this.articles[this.editAssocierFormsGroup.value['editArticle']],
    this.comptes[this.editAssocierFormsGroup.value['editCompte']]);

    this.serviceAssocier.editAAssocier(this.editAssocier.idComArt.toString(), newAssocier).subscribe(
      (data) => {
        this.warningModal2.hide();
        this.getAllAssocier();
      },
      (erreur) => {
        console.log('Erreur lors de la modification de l\'association', erreur);
      }
    );


  }

  onConfirmDeleteAssocier(){
    this.serviceAssocier.deleteAAssocier(this.suprAssocier.idComArt.toString()).subscribe(
      (data) => {
        this.dangerModal2.hide();
        this.getAllAssocier();
      },
      (erreur) => {
        console.log('Erreur lors de la suppression de lAffecter');
      }
    );

  }

  //Por l'onglet affectation d'un Compte à une Caisse

  getAllAffectComptToCaisse(){
    this.serviceAffectComptToCaisse.getAllAffectComptToCaisse().subscribe(
      (data) => {
        this.affectComptToCaisses = data;
        $('#dataTable3').dataTable().api().destroy();
        this.dtTrigger3.next();
      },
      (erreur) => {
        console.log('Erreur lors de la récupération de la liste des affectation de Compte à Caisse', erreur );
      }
    );
  }


  initEditAffectComptToCaisse(inde:number){
    this.editAffectComptToCaisse = this.affectComptToCaisses[inde];
    this.editAffectComptToCaisseFormsGroup.patchValue({
      editIdAffectComptCai: this.editAffectComptToCaisse.idAffectComptCai,
      editDatDebAffComptCai: this.editAffectComptToCaisse.datDebAffComptCai,
      editDatFinAffComptCai: this.editAffectComptToCaisse.datFinAffComptCai,
      editCompte2: this.comptes.findIndex(cp => this.editAffectComptToCaisse.compte.idCpte == cp.idCpte),
      editCaisse: this.caisses.findIndex(cai => this.editAffectComptToCaisse.caisse.codeCaisse == cai.codeCaisse),
    });
    this.warningModal3.show();
  }

  initDeleteAffectComptToCaisse(inde:number){
    this.suprAffectComptToCaisse = this.affectComptToCaisses[inde];
    this.dangerModal3.show();
  }

  onSubmitAddAffectComptToCaisse(){

    const newAffect = new AffectComptToCaisse(null, this.addAffectComptToCaisseFormsGroup.value['addDatDebAffComptCai'],
    this.addAffectComptToCaisseFormsGroup.value['addDatFinAffComptCai'],
    this.comptes[this.addAffectComptToCaisseFormsGroup.value['addCompte2']],
    this.caisses[this.addAffectComptToCaisseFormsGroup.value['addCaisse']]);

    this.serviceAffectComptToCaisse.addAAffectComptToCaisse(newAffect).subscribe(
      (data) => {
        this.primaryModal3.hide();
        this.getAllAffectComptToCaisse();
      },
      (erreur) => {
        console.log('Erreur lors de l\'Affectation du Compte à la Caisse', erreur);
      }
    );

  }

  onSubmitEditAffectComptToCaisse(){
    const newAffect = new AffectComptToCaisse(null, this.editAffectComptToCaisseFormsGroup.value['editDatDebAffComptCai'],
    this.editAffectComptToCaisseFormsGroup.value['editDatFinAffComptCai'],
    this.comptes[this.editAffectComptToCaisseFormsGroup.value['editCompte2']],
    this.caisses[this.editAffectComptToCaisseFormsGroup.value['editCaisse']]);

    this.serviceAffectComptToCaisse.editAAffectComptToCaisse(this.editAffectComptToCaisse.idAffectComptCai.toString(), newAffect).subscribe(
      (data) => {
        this.warningModal3.hide();
        this.getAllAffectComptToCaisse();
      },
      (erreur) => {
        console.log('Erreur lors de la modificatation de l\'Affectation du Compte à la Caisse', erreur);
      }
    );

  }

  onConfirmDeleteAffectComptToCaisse(){
    this.serviceAffectComptToCaisse.deleteAAffectComptToCaisse(this.suprAffectComptToCaisse.idAffectComptCai.toString()).subscribe(
      (data) => {
        this.dangerModal3.hide();
        this.getAllAffectComptToCaisse();
      },
      (erreur) => {
        console.log('Erreur lors de la suppression de lAffectation', erreur);
      }
    );

  }

  //Por l'onglet de compte
  getAllComptes(){
    this.serviceCompte.getAllCompte().subscribe(
      (data) => {
        this.comptes = data;
        $('#dataTable1').dataTable().api().destroy();
        this.dtTrigger1.next();
      },
      (erreur) => {
        console.log('Erreur lors de la récupération de la liste des comptes', erreur);
      }
    );
  }

  initEditCompte(inde:number){
    this.editCompte = this.comptes[inde];
    this.editCompteFormsGroup.patchValue({
      editNumCpte :this.editCompte.numCpte, 
      editLibCpte :this.editCompte.libCpte, 
      editCollectif :this.editCompte.collectif, 
    });
    this.warningModal.show();
  }

  initDeleteCompte(inde:number){
    this.suprCompte = this.comptes[inde];
    this.dangerModal.show();
  }

  onSubmitAddCompteFormsGroup(){
    const newCompt = new Compte(null, this.addCompteFormsGroup.value['addNumCpte'],
    this.addCompteFormsGroup.value['addLibCpte'],
    this.addCompteFormsGroup.value['addCollectif'], 'E');

    this.serviceCompte.addACompte(newCompt).subscribe(
      (data) => {
        this.getAllComptes();
        this.primaryModal.hide();
      },
      (erreur) => {
        console.log('Erreur lors de l\'Ajout du compte', erreur);
      }
    );


  }

  onSubmitEditCompteFormsGroup(){
    const newCompt = new Compte(null, this.editCompteFormsGroup.value['editNumCpte'],
    this.editCompteFormsGroup.value['editLibCpte'],
    this.editCompteFormsGroup.value['editCollectif'], this.editCompte.typCpte);

    this.serviceCompte.editACompte(this.editCompte.idCpte.toString(), newCompt).subscribe(
      (data) => {
        this.getAllComptes();
        this.warningModal.hide();
      },
      (erreur) => {
        console.log('Erreur lors de l\'Edition du compte', erreur);
      }
    );
    
  }

  onConfirmDeleteCompte(){
    this.serviceCompte.deleteACompte(this.suprCompte.idCpte.toString()).subscribe(
      (data) => {
        this.dangerModal.hide();
        this.getAllComptes();
      },
      (erreur) => {
        console.log('Erreur lors de la suppression du compte', erreur);
      }
    );
  }

}