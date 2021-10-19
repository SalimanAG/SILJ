import {Component, ViewChild, OnInit} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { data } from 'jquery';
import { Router } from '@angular/router';
import { TypeAmort } from '../../../../models/comptabilite/type-amort.model';
import { EtatImmo } from '../../../../models/comptabilite/etat-immo.model';
import { Activite } from '../../../../models/comptabilite/activite.model';
import { Immo } from '../../../../models/comptabilite/immo.model';
import { Localisation } from '../../../../models/comptabilite/localisation.model';
import { Service } from '../../../../models/service.model';
import { TypeAmortService } from '../../../../services/comptabilite/type-amort.service';
import { EtatImmoService } from '../../../../services/comptabilite/etat-immo.service';
import { ActiviteService } from '../../../../services/comptabilite/activite.service';
import { ImmoService } from '../../../../services/comptabilite/immo.service';
import { LocalisationService } from '../../../../services/comptabilite/localisation.service';
import { CommuneService } from '../../../../services/definition/commune.service';
import { SiteMarcher } from '../../../../models/siteMarcher.model';
import { Arrondissement } from '../../../../models/arrondissement.model';
import { Commune } from '../../../../models/commune.model';
import { Departement } from '../../../../models/departement.model';
import { Pays } from '../../../../models/pays.model';

@Component({
  selector: 'app-immob',
  templateUrl: './immob.component.html',
  styleUrls: ['./immob.component.css']
})
export class ImmobComponent implements OnInit {

  
  dtOptions1: DataTables.Settings = {};
  dtOptions2: DataTables.Settings = {};
  dtOptions3: DataTables.Settings = {};
  dtOptions4: DataTables.Settings = {};

  
  typeAmort: TypeAmort[];
  suprTypeAmort: TypeAmort = new TypeAmort('','');
  editTypeAmort:TypeAmort = new TypeAmort('','');
  editTypeAmortFormsGroup: FormGroup;
  addTypeAmortFormsGroup: FormGroup;
  dtTrigger1: Subject<any> = new Subject<any>();

  //Etat immobilisation
  etatImmo: EtatImmo[];
  suprEtatImmo: EtatImmo = new EtatImmo('','');
  editEtatImmo: EtatImmo = new EtatImmo('','');
  editEtatImmoFormsGroup: FormGroup;
  addEtatImmoFormsGroup: FormGroup;
  dtTrigger2: Subject<any> = new Subject<any>();

  //Activite
  activite: Activite[];
  suprActivite: Activite = new Activite('','');
  editActivite: Activite = new Activite('','');
  editActiviteFormsGroup: FormGroup;
  addActiviteFormsGroup: FormGroup;
  dtTrigger3: Subject<any> = new Subject<any>();


  //Immobilisation
  localisation: Localisation[];
  service: Service[];
  immo: Immo[];
  suprImmo: Immo = new Immo('','', new Date(), 0, 0, 0, 1, 0, 0, new Localisation(0, '','',
   new SiteMarcher('', '', '',  new Arrondissement('','','','',new Commune('','','','',new Departement('','',new Pays('','','')))))),
   new Service('', ''), new Activite('', ''), new EtatImmo('', ''), new TypeAmort('', '') );

  editImmo:Immo = new Immo('','', new Date(), 0, 0, 0, 1, 0, 0, new Localisation(0, '','',
   new SiteMarcher('', '', '',  new Arrondissement('','','','',new Commune('','','','',new Departement('','',new Pays('','','')))))),
   new Service('', ''), new Activite('', ''), new EtatImmo('', ''), new TypeAmort('', '') );
  editImmoFormsGroup: FormGroup;
  addImmoFormsGroup: FormGroup;
  dtTrigger4: Subject<any> = new Subject<any>();

  @ViewChild('primaryModal') public primaryModal: ModalDirective;
  @ViewChild('successModal') public successModal: ModalDirective;
  @ViewChild('warningModal') public warningModal: ModalDirective;
  @ViewChild('dangerModal') public dangerModal: ModalDirective;
  @ViewChild('infoModal') public infoModal: ModalDirective;

  //Etat immobilisation
  @ViewChild('primaryModal2') public primaryModal2: ModalDirective;
  @ViewChild('successModal2') public successModal2: ModalDirective;
  @ViewChild('warningModal2') public warningModal2: ModalDirective;
  @ViewChild('dangerModal2') public dangerModal2: ModalDirective;
  @ViewChild('infoModal2') public infoModal2: ModalDirective;

  //Activité
  @ViewChild('primaryModal3') public primaryModal3: ModalDirective;
  @ViewChild('successModal3') public successModal3: ModalDirective;
  @ViewChild('warningModal3') public warningModal3: ModalDirective;
  @ViewChild('dangerModal3') public dangerModal3: ModalDirective;
  @ViewChild('infoModal3') public infoModal3: ModalDirective;


  //Immobilisation
  @ViewChild('primaryModal4') public primaryModal4: ModalDirective;
  @ViewChild('successModal4') public successModal4: ModalDirective;
  @ViewChild('warningModal4') public warningModal4: ModalDirective;
  @ViewChild('dangerModal4') public dangerModal4: ModalDirective;
  @ViewChild('infoModal4') public infoModal4: ModalDirective;

  constructor(
    private typeAmortService:TypeAmortService,
    private etatImmoService:EtatImmoService,
    private activiteService:ActiviteService,
    private immoService:ImmoService,
    private communeService:CommuneService,
    private localisationService:LocalisationService,
    private formBulder:FormBuilder,
    private router:Router) { 
      this.initForms();
      this.initDtOptions();
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

      this.dtOptions4 = {
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

      this.addTypeAmortFormsGroup = this.formBulder.group({
        addCodeTypAmor: ['', Validators.required],
        addLibTypAmo: ['', Validators.required]
        });

      this.editTypeAmortFormsGroup = this.formBulder.group({
          editCodeTypAmor:['', Validators.required],
          editLibTypAmo:['', Validators.required]
        });

      this.addEtatImmoFormsGroup = this.formBulder.group({
          addCodeEtatImo: ['', Validators.required],
          addLibEtatImo: ['', Validators.required]
          });
  
      this.editEtatImmoFormsGroup = this.formBulder.group({
          editCodeEtatImo:['', Validators.required],
          editLibEtatImo:['', Validators.required]
          });

          //Activité formulaire add and delete
      this.addActiviteFormsGroup = this.formBulder.group({
          addCodeAct: ['', Validators.required],
          addLibAct: ['', Validators.required]
          });
  
      this.editActiviteFormsGroup = this.formBulder.group({
          editCodeAct:['', Validators.required],
          editLibAct:['', Validators.required]
          });


           //Immobilisation formulaire add and delete
      this.addImmoFormsGroup = this.formBulder.group({
          addElement:['', Validators.required],
          addIntitule:['', Validators.required],
          addDatEntree:[new Date().toISOString().substring(0, 10), Validators.required],
          addValBrute:[0, Validators.required],
          addValResid:[0, Validators.required],
          addValAmortissable:[0, Validators.required],
          addNbAnne:[0, Validators.required],
          addNbMois:[0, Validators.required],
          addNbJrs:[0, Validators.required],
          addTaux:[0, Validators.required],
          addLocalisation:0,
          addService:0,
          addActivite:0,
          addEtatImmo:0,
          addTypeAmort:0

        });

      this.editImmoFormsGroup = this.formBulder.group({
        editElement:['', Validators.required],
        editIntitule:['', Validators.required],
        editDatEntree:['', Validators.required],
        editValBrute:[0, Validators.required],
        editValResid:[0, Validators.required],
        editValAmortissable:[0, Validators.required],
        editNbAnne:[0, Validators.required],
        editNbMois:[0, Validators.required],
        editNbJrs:[0, Validators.required],
        editTaux:[0, Validators.required],
        editLocalisation:0,
        editService:0,
        editActivite:0,
        editEtatImmo:0,
        editTypeAmort:0

        });
    }

  ngOnInit(): void {

    // get all Type Amortissement
    this.typeAmortService.getAllTypeAmort()
    .subscribe(
      (data) => {
        this.typeAmort = data;

        this.dtTrigger1.next();
      },
      (erreur) => {
        console.log('Erreur de récupération ', erreur);
      }
    );

    // get all etat immobilisation

    this.etatImmoService.getAllEtatImmo()
    .subscribe(
      (data) => {
        this.etatImmo = data;

        this.dtTrigger2.next();
      },
      (erreur) => {
        console.log('Erreur de récupération ', erreur);
      }
    );

    //get all activité
    this.activiteService.getAllActivite()
    .subscribe(
      (data) => {
        this.activite = data;

        this.dtTrigger3.next();
      },
      (erreur) => {
        console.log('Erreur de récupération ', erreur);
      }
    );

      //get all immobilisation
      this.immoService.getAllImmo()
      .subscribe(
        (data) => {
          this.immo = data;
  
          this.dtTrigger4.next();
        },
        (erreur) => {
          console.log('Erreur de récupération ', erreur);
        }
      );

      //get all localisation
      this.localisationService.getAllLocalisation()
      .subscribe(
        (data) => {
          this.localisation = data;
        },
        (erreur) => {
          console.log('Erreur de récupération ', erreur);
        }
      );

       //get all service
       this.communeService.getAllService()
       .subscribe(
         (data) => {
           this.service = data;
         },
         (erreur) => {
           console.log('Erreur de récupération ', erreur);
         }
       );


  }

  //
  getAllTypeAmortissement(){
    this.typeAmortService.getAllTypeAmort()
    .subscribe(
      (data) => {
        this.typeAmort = data;
        $('#typeAmortDataTable').dataTable().api().destroy();
        this.dtTrigger1.next();
      },
      (erreur) => {
        console.log('Erreur de récupération ', erreur);
      }
    );
  }

  //
  getAllEtatImmobilisation(){
    this.etatImmoService.getAllEtatImmo()
    .subscribe(
      (data) => {
        this.etatImmo = data;
        $('#etatImmoDataTable').dataTable().api().destroy();
        this.dtTrigger2.next();
      },
      (erreur) => {
        console.log('Erreur de récupération ', erreur);
      }
    );
  }

  // Function get all activité
  getAllActivite(){
    this.activiteService.getAllActivite()
    .subscribe(
      (data) => {
        this.activite = data;
        $('#activiteDataTable').dataTable().api().destroy();
        this.dtTrigger3.next();
      },
      (erreur) => {
        console.log('Erreur de récupération ', erreur);
      }
    );
  }


  // Function get all immobilisation
  getAllImmobilisation(){
    this.immoService.getAllImmo()
    .subscribe(
      (data) => {
        this.immo = data;
        $('#immoDataTable').dataTable().api().destroy();
        this.dtTrigger4.next();
      },
      (erreur) => {
        console.log('Erreur de récupération ', erreur);
      }
    );
  }

  //
  initEditTypeAmort(ind: number)
  {
    this.editTypeAmort = this.typeAmort[ind];
    this.warningModal.show();
  }

  initDeleteTypeAmort(ind: number)
  {
    this.suprTypeAmort = this.typeAmort[ind];
    this.dangerModal.show();
  }

  //Initialisation des modals de Etat immobilisation
  initEditEtatImmo(ind: number)
  {
    this.editEtatImmo = this.etatImmo[ind];
    this.warningModal2.show();
  }

  initDeleteEtatImmo(ind: number)
  {
    this.suprEtatImmo = this.etatImmo[ind];
    this.dangerModal2.show();
  }


  //Initialisation des modals de l'activité
  initEditActivite(ind: number)
  {
    this.editActivite = this.activite[ind];
    this.warningModal3.show();
  }

  initDeleteActivite(ind: number)
  {
    this.suprActivite = this.activite[ind];
    this.dangerModal3.show();
  }

   //Initialisation des modals de l'immobilisation
   initEditImmo(ind: number)
   {
     this.editImmo = this.immo[ind];
     this.warningModal4.show();
   }
 
   initDeleteImmo(ind: number)
   {
     this.suprImmo = this.immo[ind];
     this.dangerModal4.show();
   }

  //Enregistrement du Type Amortissement
  onSubmitAddTypeAmortForm(){

    const newTypeAmort = new TypeAmort(this.addTypeAmortFormsGroup.value['addCodeTypAmor'],
    this.addTypeAmortFormsGroup.value['addLibTypAmo']);
    this.typeAmortService.addATypeAmort(newTypeAmort).subscribe(
      (data) => {
        console.log('Réussie : ', data);
        this.addTypeAmortFormsGroup.reset();
        this.initForms();
        this.primaryModal.hide();
        this.getAllTypeAmortissement();
      },
      (erreur) => {
        console.log("Echec : ", erreur);
      }
    )
  }

  // Modification du Type d' amortissement
  onSubmitEditTypeAmortForm()
  {
    const editTypeAmortFormsGroupValue = this.editTypeAmortFormsGroup.value;
    const modifiedTypeAmort = new TypeAmort(editTypeAmortFormsGroupValue['editCodeTypAmor'], editTypeAmortFormsGroupValue['editLibTypAmo']);
    console.log(modifiedTypeAmort);
    this.typeAmortService.editATypeAmort(this.editTypeAmort.idTypAmo.toString(), modifiedTypeAmort)
    .subscribe(
      (data) => {
        console.log('Objet Modifier : ', data);
        this.warningModal.hide();
        this.getAllTypeAmortissement();
      },
      (erreur) => {
        console.log('Erreur : ', erreur);
      }
    );
  }

  //Suppression du Type Amortissement
  onConfirmDeleteTypeAmort(){
    this.typeAmortService.deleteATypeAmort(this.suprTypeAmort.idTypAmo.toString())
    .subscribe(
      (data) => {
        console.log('Réussie : ', data);
        this.dangerModal.hide();
        this.getAllTypeAmortissement();
      },
      (erreur) => {
        console.log('Erreur : ', erreur);
      }
    );
  }

   //Enregistrement etat immobilisation
   onSubmitAddEtatImmoForm(){

    const newEtatImmo = new EtatImmo(this.addEtatImmoFormsGroup.value['addCodeEtatImo'],
    this.addEtatImmoFormsGroup.value['addLibEtatImo']);
    this.etatImmoService.addAEtatImmo(newEtatImmo).subscribe(
      (data) => {
        console.log('Réussie : ', data);
        this.addEtatImmoFormsGroup.reset();
        this.initForms();
        this.primaryModal2.hide();
        this.getAllEtatImmobilisation();
      },
      (erreur) => {
        console.log("Echec : ", erreur);
      }
    )
  }

  // Modification état immobilisation
  onSubmitEditEtatImmoForm()
  {
    const editEtatImmoFormsGroupValue = this.editEtatImmoFormsGroup.value;
    const modifiedEtatImmo = new EtatImmo(editEtatImmoFormsGroupValue['editCodeEtatImo'], editEtatImmoFormsGroupValue['editLibEtatImo']);
    console.log(modifiedEtatImmo);
    this.etatImmoService.editAEtatImmo(this.editEtatImmo.idEtatImmo.toString(), modifiedEtatImmo)
    .subscribe(
      (data) => {
        console.log('Objet Modifier : ', data);
        this.warningModal2.hide();
        this.getAllEtatImmobilisation();
      },
      (erreur) => {
        console.log('Erreur : ', erreur);
      }
    );
  }

  //Suppression etat immobilisation
  onConfirmDeleteEtatImmo(){
    this.etatImmoService.deleteAEtatImmo(this.suprEtatImmo.idEtatImmo.toString())
    .subscribe(
      (data) => {
        console.log('Réussie : ', data);
        this.dangerModal2.hide();
        this.getAllEtatImmobilisation();
      },
      (erreur) => {
        console.log('Erreur : ', erreur);
      }
    );
  }


  //
  //Enregistrement activité
  onSubmitAddActiviteForm(){

    const newActivite = new Activite(this.addActiviteFormsGroup.value['addCodeAct'],
    this.addActiviteFormsGroup.value['addLibAct']);
    this.activiteService.addAActivite(newActivite).subscribe(
      (data) => {
        console.log('Réussie : ', data);
        this.addActiviteFormsGroup.reset();
        this.initForms();
        this.primaryModal3.hide();
        this.getAllActivite();
      },
      (erreur) => {
        console.log("Echec : ", erreur);
      }
    )
  }

  // Modification activité
  onSubmitEditActiviteForm()
  {
    const editActiviteFormsGroupValue = this.editActiviteFormsGroup.value;
    const modifiedActivite = new Activite(editActiviteFormsGroupValue['editCodeAct'], editActiviteFormsGroupValue['editLibAct']);
    console.log(modifiedActivite);
    this.activiteService.editAActivite(this.editActivite.idAct.toString(), modifiedActivite)
    .subscribe(
      (data) => {
        console.log('Objet Modifier : ', data);
        this.warningModal3.hide();
        this.getAllActivite();
      },
      (erreur) => {
        console.log('Erreur : ', erreur);
      }
    );
  }

  //Suppression activite
  onConfirmDeleteActivite(){
    this.activiteService.deleteAActivite(this.suprActivite.idAct.toString())
    .subscribe(
      (data) => {
        console.log('Réussie : ', data);
        this.dangerModal3.hide();
        this.getAllActivite();
      },
      (erreur) => {
        console.log('Erreur : ', erreur);
      }
    );
  }

  // Calcul de la valeur amortissable ou base amortissable
  calculValeurAmortissable(){
    this.addImmoFormsGroup.patchValue({addValAmortissable: this.addImmoFormsGroup.value['addValBrute'] - this.addImmoFormsGroup.value['addValResid'] } );
  }
  // calcum à la modification
  calculValeurAmortissableEdit(){
    this.editImmoFormsGroup.patchValue({editValAmortissable: this.editImmoFormsGroup.value['editValBrute'] - this.editImmoFormsGroup.value['editValResid'] } );
  }

  //Calculer le taux
  calculTaux(){
    this.addImmoFormsGroup.patchValue({addTaux: 100/this.addImmoFormsGroup.value['addNbAnne']} );
  }

  calculTauxEdit(){
    this.editImmoFormsGroup.patchValue({editTaux: 100/this.editImmoFormsGroup.value['editNbAnne']} );
  }


  //Eregistrer immobilisation
  onSubmitAddImmoFormsGroup(){

    const newImmo = new Immo(this.addImmoFormsGroup.value['addElement'],
    this.addImmoFormsGroup.value['addIntitule'], this.addImmoFormsGroup.value['addDatEntree'], this.addImmoFormsGroup.value['addValBrute'],
    this.addImmoFormsGroup.value['addValResid'], this.addImmoFormsGroup.value['addValAmortissable'], this.addImmoFormsGroup.value['addNbAnne'], 
    this.addImmoFormsGroup.value['addNbMois'], this.addImmoFormsGroup.value['addNbJrs'], this.localisation[this.addImmoFormsGroup.value['addLocalisation']], 
    this.service[this.addImmoFormsGroup.value['addService']], this.activite[this.addImmoFormsGroup.value['addActivite']],
    this.etatImmo[this.addImmoFormsGroup.value['addEtatImmo']], this.typeAmort[this.addImmoFormsGroup.value['addTypeAmort']] );

    this.immoService.addAImmo(newImmo).subscribe(
      (data) => {
        console.log('Réussie : ', data);
        this.addImmoFormsGroup.reset();
        this.initForms();
        this.primaryModal4.hide();
        this.getAllImmobilisation();
      },
      (erreur) => {
        console.log("Echec : ", erreur);
      }
    )
  }

  // Modification immobilisation
  onSubmitEditImmoForm()
  {
    const editImmoFormsGroupValue = this.editImmoFormsGroup.value;

    const modifiedImmo = new Immo(editImmoFormsGroupValue['editElement'],
    editImmoFormsGroupValue['editIntitule'], editImmoFormsGroupValue['editDatEntree'], editImmoFormsGroupValue['editValBrute'],
    editImmoFormsGroupValue['editValResid'], editImmoFormsGroupValue['editValAmortissable'], editImmoFormsGroupValue['editNbAnne'], 
    editImmoFormsGroupValue['editNbMois'], editImmoFormsGroupValue['editNbJrs'], this.localisation[editImmoFormsGroupValue['editLocalisation']], 
    this.service[editImmoFormsGroupValue['editService']], this.activite[editImmoFormsGroupValue['editActivite']],
    this.etatImmo[editImmoFormsGroupValue['editEtatImmo']], this.typeAmort[editImmoFormsGroupValue['editTypeAmort']] );
    console.log(modifiedImmo);
    this.immoService.editAImmo(this.editImmo.idImmo.toString(), modifiedImmo)
    .subscribe(
      (data) => {
        console.log('Objet Modifier : ', data);
        this.warningModal4.hide();
        this.getAllImmobilisation();
      },
      (erreur) => {
        console.log('Erreur : ', erreur);
      }
    );
  }

  //Suppression immobilisation
  onConfirmDeleteImmo(){
    this.immoService.deleteAImmo(this.suprImmo.idImmo.toString())
    .subscribe(
      (data) => {
        console.log('Réussie : ', data);
        this.dangerModal4.hide();
        this.getAllImmobilisation();
      },
      (erreur) => {
        console.log('Erreur : ', erreur);
      }
    );
  }


}
