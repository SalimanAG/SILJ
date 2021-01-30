import {Component, ViewChild, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { data } from 'jquery';
import {ModalDirective} from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { Correspondant } from '../../../models/Correspondant.model';
import { EtreAffecte } from '../../../models/etreAffecte.model';
import { Magasinier } from '../../../models/magasinier.model';
import { TypCorres } from '../../../models/typCorres.model';
import { Utilisateur } from '../../../models/utilisateur.model';
import { UtilisateurService } from '../../../services/administration/utilisateur.service';
import { CorrespondantService } from '../../../services/definition/correspondant.service';

@Component({
  selector: 'app-correspondants',
  templateUrl: './correspondants.component.html',
  styleUrls: ['./correspondants.component.css']
})
export class CorrespondantsComponent implements OnInit {

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

  //Onglet Correspondant
  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;

  dtOptions1: DataTables.Settings = {};
  dtTrigger1: Subject<any> = new Subject<any>();
  addCorresFormsGroup: FormGroup;
  editCorresFormsGroup: FormGroup;
  correspondants:Correspondant[];
  editCorres:Correspondant = new Correspondant('', false, new Magasinier('', '', ''),
  new TypCorres('', ''), new Utilisateur('', '', '', '', '', false, ''));
  suprCorres:Correspondant = new Correspondant('', false, new Magasinier('', '', ''),
  new TypCorres('', ''), new Utilisateur('', '', '', '', '', false, ''));
  infosCorres:Correspondant = new Correspondant('', false, new Magasinier('', '', ''),
  new TypCorres('', ''), new Utilisateur('', '', '', '', '', false, ''));

  utilisateurs: Utilisateur[];
  typCorrespondants: TypCorres[];
  //Il reste la liste des Sites***********


  //Onglet Affecter Correspondant
  dtOptions2: DataTables.Settings = {};
  dtTrigger2: Subject<any> = new Subject<any>();
  addAffecteSiteFormsGroup: FormGroup;
  editAffecteSiteFormsGroup: FormGroup;
  etreAffectes:EtreAffecte[];
  editEtreAffecte:EtreAffecte = new EtreAffecte(new Date(), new Date(), new Correspondant('', false, new Magasinier('', '', ''),
  new TypCorres('', ''), new Utilisateur('', '', '', '', '', false, '')), '');
  suprEtreAffecte:EtreAffecte = new EtreAffecte(new Date(), new Date(), new Correspondant('', false, new Magasinier('', '', ''),
  new TypCorres('', ''), new Utilisateur('', '', '', '', '', false, '')), '');
  infoEtreAffecte:EtreAffecte = new EtreAffecte(new Date(), new Date(), new Correspondant('', false, new Magasinier('', '', ''),
  new TypCorres('', ''), new Utilisateur('', '', '', '', '', false, '')), '');


  constructor(private serviceCorres:CorrespondantService, private serviceUser:UtilisateurService,
    private formBulder:FormBuilder) {
      this.initDtOptions();
      this.initFormsGroup();
    }

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
      this.addCorresFormsGroup = this.formBulder.group({
        addIdCorrespondant:['', Validators.required],
        addImputableCorres:false,
        addTypCorres:[0, Validators.required],
        addUtilisateur:[0, Validators.required],
        addNomMagasinier:['', Validators.required],
        addPrenomMagasinier:['', Validators.required],
        addTelMagasinier:''
      });

      this.editCorresFormsGroup = this.formBulder.group({
        editIdCorrespondant:['', Validators.required],
        editImputableCorres:false,
        editTypCorres:[0, Validators.required],
        editUtilisateur:[0, Validators.required],
        editNomMagasinier:['', Validators.required],
        editPrenomMagasinier:['', Validators.required],
        editTelMagasinier:''
      });

      this.addAffecteSiteFormsGroup = this.formBulder.group({
        addDateArrivee:[new Date(), Validators.required],
        addDateDepart:new Date(),
        addCorres:[0, Validators.required],
        addSite:[0, Validators.required]
      });

      this.editAffecteSiteFormsGroup = this.formBulder.group({
        editDateArrivee:[new Date(), Validators.required],
        editDateDepart:new Date(),
        editCorres:[0, Validators.required],
        editSite:[0, Validators.required]
      });

    }

  ngOnInit(): void {

    this.serviceCorres.getAllCorres().subscribe(
      (data) => {
        this.correspondants = data;
        this.dtTrigger1.next();
      },
      (erreur) => {
        console.log('Erreur lors de la récupération de la liste des correspondant', erreur);
      }
    );

    this.serviceUser.getAllUsers().subscribe(
      (data) => {
        this.utilisateurs = data;
      },
      (erreur) => {
        console.log('Erreur lors de la récupération de la liste des users', erreur);
      }
    );

    this.serviceCorres.getAllTypCorres().subscribe(
      (data) => {
        this.typCorrespondants = data;

      },
      (erreur) => {
        console.log('Erreur lors de la récupération de la liste des type de corresponsdant', erreur)
      }
    );

    this.serviceCorres.getAllEtreAffecte().subscribe(
      (data) => {
        this.etreAffectes = data;
        this.dtTrigger2.next();
      }
    );
  }

  //Onglet Correspondant
  getAllCorres(){
    this.serviceCorres.getAllCorres().subscribe(
      (data) => {
        this.correspondants = data;

      },
      (erreur) => {
        console.log('Erreur lors de la récupération de la liste des correspondant', erreur);
      }
    );
  }

  getAllUsers(){
    this.serviceUser.getAllUsers().subscribe(
      (data) => {
        this.utilisateurs = data;
      },
      (erreur) => {
        console.log('Erreur lors de la récupération de la liste des users', erreur);
      }
    );


  }

  getAllTypCorres(){
    this.serviceCorres.getAllTypCorres().subscribe(
      (data) => {
        this.typCorrespondants = data;

      },
      (erreur) => {
        console.log('Erreur lors de la récupération de la liste des type de corresponsdant', erreur)
      }
    );
  }


  initEditCorres(inde:number){
    //this.editCorres = this.correspondants[inde];
    this.warningModal.show();
  }

  initDeleteCorres(inde:number){
    //this.suprCorres = this.correspondants[inde];
    this.dangerModal.show();
  }

  initInfosCorres(inde:number){
    //this.infosCorres = this.correspondants[inde];
    this.infoModal.show();
  }

  onSubmitAddCorresFormsGroup(){

    this.primaryModal.hide();
  }

  onSubmitEditCorresFormsGroup(){

    this.warningModal.hide();
  }

  onConfirmDeleteCorres(){

    this.dangerModal.hide();
  }


  //Onglet Affectation
  getAllEtreAffectes(){
    this.serviceCorres.getAllEtreAffecte().subscribe(
      (data) => {
        this.etreAffectes = data;

      }
    );
  }

  initEditEtreAffecte(inde:number){
    //this.editEtreAffecte = this.etreAffectes[inde];
    this.warningModal2.show();
  }

  initDeleteEtreAffecte(inde:number){
    //this.suprEtreAffecte = this.etreAffectes[inde];
    this.dangerModal2.show();
  }

  onSubmitAddEtreAffecte(){

    this.primaryModal2.hide();
  }

  onSubmitEditEtreAffecte(){

    this.warningModal2.hide();
  }

  onConfirmDeleteEtreAffecte(){

    this.dangerModal2.hide();
  }

}
