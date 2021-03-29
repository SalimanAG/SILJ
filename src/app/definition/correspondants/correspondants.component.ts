import {Component, ViewChild, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { data } from 'jquery';
import {ModalDirective} from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { Arrondissement } from '../../../models/arrondissement.model';
import { Commune } from '../../../models/commune.model';
import { Correspondant } from '../../../models/Correspondant.model';
import { Departement } from '../../../models/departement.model';
import { EtreAffecte } from '../../../models/etreAffecte.model';
import { Gerer } from '../../../models/gerer.model';
import { Magasin } from '../../../models/magasin.model';
import { Magasinier } from '../../../models/magasinier.model';
import { Pays } from '../../../models/pays.model';
import { Service } from '../../../models/service.model';
import { SiteMarcher } from '../../../models/siteMarcher.model';
import { TypCorres } from '../../../models/typCorres.model';
import { Utilisateur } from '../../../models/utilisateur.model';
import { UtilisateurService } from '../../../services/administration/utilisateur.service';
import { CommuneService } from '../../../services/definition/commune.service';
import { CorrespondantService } from '../../../services/definition/correspondant.service';
import * as moment from  'moment';

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
  new TypCorres('', ''), new Utilisateur('', '', '', '', '', false, new Service('', '')));
  suprCorres:Correspondant = new Correspondant('', false, new Magasinier('', '', ''),
  new TypCorres('', ''), new Utilisateur('', '', '', '', '', false, new Service('', '')));
  infosCorres:Correspondant = new Correspondant('', false, new Magasinier('', '', ''),
  new TypCorres('', ''), new Utilisateur('', '', '', '', '', false, new Service('', '')));

  //Quelques listes
  utilisateurs: Utilisateur[];
  typCorrespondants: TypCorres[];
  sites: SiteMarcher[];
  magasins:Magasin[];
  magasiniers:Magasinier[];
  gerers:Gerer[];


  //Onglet Affecter Correspondant
  dtOptions2: DataTables.Settings = {};
  dtTrigger2: Subject<any> = new Subject<any>();
  addAffecteSiteFormsGroup: FormGroup;
  editAffecteSiteFormsGroup: FormGroup;
  etreAffectes:EtreAffecte[];
  editEtreAffecte:EtreAffecte = new EtreAffecte(new Date(), new Date(), new Correspondant('', false, new Magasinier('', '', ''),
  new TypCorres('', ''), new Utilisateur('', '', '', '', '', false, new Service('', ''))), new SiteMarcher('', '', '',
  new Arrondissement('','','','',new Commune('','','','',new Departement('','',new Pays('','',''))))));
  suprEtreAffecte:EtreAffecte = new EtreAffecte(new Date(), new Date(), new Correspondant('', false, new Magasinier('', '', ''),
  new TypCorres('', ''), new Utilisateur('', '', '', '', '', false, new Service('', ''))), new SiteMarcher('', '', '',
  new Arrondissement('','','','',new Commune('','','','',new Departement('','',new Pays('','',''))))));
  infoEtreAffecte:EtreAffecte = new EtreAffecte(new Date(), new Date(), new Correspondant('', false, new Magasinier('', '', ''),
  new TypCorres('', ''), new Utilisateur('', '', '', '', '', false, new Service('', ''))), new SiteMarcher('', '', '',
  new Arrondissement('','','','',new Commune('','','','',new Departement('','',new Pays('','',''))))));



  constructor(private serviceCorres:CorrespondantService, private serviceUser:UtilisateurService,
    private formBulder:FormBuilder, private serviceCom:CommuneService) {
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
        addDateArrivee:[moment(Date.now()).format('yyyy-MM-DD'), Validators.required],
        addDateDepart:'',
        addCorres:[0, Validators.required],
        addSite:[0, Validators.required]
      });

      this.editAffecteSiteFormsGroup = this.formBulder.group({
        editDateArrivee:[new Date(), Validators.required],
        editDateDepart:'',
        editCorres:[0, Validators.required],
        editSite:[0, Validators.required]
      });

    }

  ngOnInit(): void {

    this.getAllSite();

    this.getAllTypCorres();

    this.getAllMagasin();

    this.getAllMagasinier();

    this.getAllGerer();

    this.getAllUsers();

    this.serviceCorres.getAllCorres().subscribe(
      (data) => {
        this.correspondants = data;
        this.dtTrigger1.next();
      },
      (erreur) => {
        console.log('Erreur lors de la récupération de la liste des correspondant', erreur);
      }
    );

    this.serviceCorres.getAllEtreAffecte().subscribe(
      (data) => {
        this.etreAffectes = data;
        this.dtTrigger2.next();
      }
    );

  }

  getAllSite(){
    this.serviceCom.getAllSiteMarcher().subscribe(
      (data) => {
        this.sites = data;
      },
      (erreur) => {
        console.log('Erreur lors de la récupération de la liste des Sites', erreur);
      }
    );
  }

  //Onglet Correspondant
  getAllCorres(){
    this.serviceCorres.getAllCorres().subscribe(
      (data) => {
        this.correspondants = data;
        $('#dataTable1').dataTable().api().destroy();
        this.dtTrigger1.next();
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

  getAllMagasin(){
    this.serviceCorres.getAllMagasin().subscribe(
      (data) => {
        this.magasins=data;
      },
      (erreur) => {
        console.log('Erreur lors de la récupération de la liste des magasins', erreur);
      }
    );
  }

  getAllMagasinier(){
    this.serviceCorres.getAllMagasinier().subscribe(
      (data) => {
        this.magasiniers = data;
      },
      (erreur) => {
        console.log('Erreur lors du chargement des magasiniers', erreur);
      }
    );
  }


  getAllGerer(){
    this.serviceCorres.getAllGerer().subscribe(
      (data) => {
        this.gerers = data;
      },
      (erreur) => {
        console.log('Erreur lors du chargement de la liste des gérer : ', erreur);
      }
    );
  }

  getMagasinByCodeMagasinier(code:String){
    let result : Magasin[] = [];
    this.getAllGerer();
    this.gerers.forEach(element => {
      if(element.magasinier.numMAgasinier.toString()==code){
        result.push(element.magasin);
      }
    });

    return result;
  }

  getGererByCodeMagasinier(code:String){
    let result: Gerer[] = [];
    this.getAllGerer();
    this.gerers.forEach(element => {
      if(element.magasinier.numMAgasinier.toString()==code){
        result.push(element);
      }
    });

    return result;
  }

  initEditCorres(inde:number){
    this.editCorres = this.correspondants[inde];
    this.warningModal.show();
  }

  initDeleteCorres(inde:number){
    this.suprCorres = this.correspondants[inde];
    console.log(this.suprCorres);
    this.dangerModal.show();
  }

  initInfosCorres(inde:number){
    this.infosCorres = this.correspondants[inde];
    this.infoModal.show();
  }

  onSubmitAddCorresFormsGroup(){


    const newMagasinier = new Magasinier(this.addCorresFormsGroup.value['addNomMagasinier'],
    this.addCorresFormsGroup.value['addPrenomMagasinier'],
    this.addCorresFormsGroup.value['addTelMagasinier']
    )



    const newMagasin = new Magasin(newMagasinier.telMagasinier, newMagasinier.nomMagasinier.concat(newMagasinier.prenomMagasinier.valueOf()))

    this.serviceCorres.addAMagasinier(newMagasinier).subscribe(
      (data) => {
        this.serviceCorres.addAMagasin(newMagasin).subscribe(
          (data2) => {
            this.serviceCorres.addAGerer(new Gerer(new Date(), new Date(), data, data2)).subscribe(
              (data3) => {
                const newCorres = new Correspondant(this.addCorresFormsGroup.value['addIdCorrespondant'],
                                  this.addCorresFormsGroup.value['addImputableCorres'],
                                  data,
                                  this.typCorrespondants[this.addCorresFormsGroup.value['addTypCorres']],
                                  this.utilisateurs[this.addCorresFormsGroup.value['addUtilisateur']]);
                this.serviceCorres.addACorres(newCorres).subscribe(
                  (data4) => {
                    this.primaryModal.hide();
                    this.getAllCorres();
                  },
                  (erreur) => {
                    console.log('Erreur lors de la création du correspondant : ', erreur);
                  }
                );
              },
              (erreur) => {
                console.log('Erreur lors de la création de la relation gérer : ', erreur);
              }
            );
          },
          (erreur) => {
            console.log('Erreur lors de la création du magasin : ', erreur);
          }
        );
      },
      (erreur) => {
        console.log('Erreur lors de la création du magasinier', erreur);
      }
    );




  }

  onSubmitEditCorresFormsGroup(){

    this.warningModal.hide();
  }

  onConfirmDeleteCorres(){

    let processed:boolean = true;
    let magasin = this.getMagasinByCodeMagasinier(this.suprCorres.magasinier.numMAgasinier.toString());
    let gerer = this.getGererByCodeMagasinier(this.suprCorres.magasinier.numMAgasinier.toString());

    gerer.forEach(element => {
      this.serviceCorres.deleteAGerer(element.idGerer.toString()).subscribe(
        (data) => {

        },
        (erreur) => {
          console.log('Erreur lors de la suppression dUn gerer', erreur);
          processed = false;
        }
      );
    });

    if(processed===true)
    magasin.forEach(element => {
      this.serviceCorres.deleteAMagasin(element.codeMagasin).subscribe(
        (data) => {

        },
        (erreur) => {
          console.log('Erreur lors de la suppression dUn magasin : ', erreur);
          processed = false;
        }
      );
    });

    if(processed===true)
    this.serviceCorres.deleteACorres(this.suprCorres.idCorrespondant).subscribe(
      (data) => {

        this.getAllCorres();

      },
      (erreur) => {
        console.log('Erreur lors de la suppression du correspondant : ', erreur);
        processed = false;
      }
    );

    if(processed===true)
    this.serviceCorres.deleteAMagasinier(this.suprCorres.magasinier.numMAgasinier.toString()).subscribe(
      (data) => {
        this.dangerModal.hide();
      },
      (erreur) => {
        console.log('Erreur lors de la suppression dUn magasinier', erreur);
        processed = false;
      }
    );


  }


  //Onglet Affectation
  getAllEtreAffectes(){
    this.serviceCorres.getAllEtreAffecte().subscribe(
      (data) => {
        this.etreAffectes = data;
        $('#dataTable2').dataTable().api().destroy();
        this.dtTrigger2.next();
      }
    );
  }

  initEditEtreAffecte(inde:number){
    this.editEtreAffecte = this.etreAffectes[inde];
    this.warningModal2.show();
  }

  initDeleteEtreAffecte(inde:number){
    this.suprEtreAffecte = this.etreAffectes[inde];
    this.dangerModal2.show();
  }

  onSubmitAddEtreAffecte(){

    const newEtreAff = new EtreAffecte(this.addAffecteSiteFormsGroup.value['addDateArrivee'],
    this.addAffecteSiteFormsGroup.value['addDateDepart'],
    this.correspondants[this.addAffecteSiteFormsGroup.value['addCorres']],
    this.sites[this.addAffecteSiteFormsGroup.value['addSite']]);

    this.serviceCorres.addAEtreAffecte(newEtreAff).subscribe(
      (data) => {
        this.primaryModal2.hide();
        this.getAllEtreAffectes();
      },
      (erreur) => {
        console.log('Erreur lors de lEnregistrement de lAffectation : ', erreur);
      }
    );

  }

  onSubmitEditEtreAffecte(){

    const newEtreAff = new EtreAffecte(this.editAffecteSiteFormsGroup.value['editDateArrivee'],
    this.editAffecteSiteFormsGroup.value['editDateDepart'],
    this.correspondants[this.editAffecteSiteFormsGroup.value['editCorres']],
    this.sites[this.editAffecteSiteFormsGroup.value['editSite']]);

    this.serviceCorres.editAEtreAffecte(this.editEtreAffecte.idAffecte.toString(), newEtreAff).subscribe(
      (data) => {
        this.warningModal2.hide();
        this.getAllEtreAffectes();
      },
      (erreur) => {
        console.log('Erreur lors de la modification de lAffectation : ', erreur);
      }
    );


  }

  onConfirmDeleteEtreAffecte(){

    this.serviceCorres.deleteAEtreAffecte(this.suprEtreAffecte.idAffecte.toString()).subscribe(
      (data) => {
        this.dangerModal2.hide();
        this.getAllEtreAffectes();
      },
      (erreur) => {
        console.log('Erreur lors de la suppression de lAffectation : ', erreur);
      }
    );

  }

}
