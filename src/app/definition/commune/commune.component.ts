import {Component, ViewChild, OnInit} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap/modal';
import { AppBreadcrumbService } from '@coreui/angular/lib/breadcrumb/app-breadcrumb.service';
import { CommuneService } from '../../../services/definition/commune.service';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { data } from 'jquery';
import { Router } from '@angular/router';
import { Pays } from '../../../models/pays.model';
import { Departement } from '../../../models/departement.model';
import { Commune } from '../../../models/commune.model';
import { Arrondissement } from '../../../models/arrondissement.model';
import { Quartier } from '../../../models/quartier.model';
import { Service } from '../../../models/service.model';
import { SiteMarcher } from '../../../models/siteMarcher.model';

@Component({
  selector: 'app-commune',
  templateUrl: './commune.component.html',
  styleUrls: ['./commune.component.css']
})
export class CommuneComponent implements OnInit {

  dtOptions1: DataTables.Settings = {};
  dtOptions2: DataTables.Settings = {};
  dtOptions3: DataTables.Settings = {};
  dtOptions4: DataTables.Settings = {};
  dtOptions5: DataTables.Settings = {};
  dtOptions6: DataTables.Settings = {};
  dtOptions7: DataTables.Settings = {};

  //formulaires de l'onglet Pays
  pays: Pays[];
  suprPayss: Pays = new Pays('','','');
  editPayss:Pays = new Pays('','','');
  editPaysFormsGroup: FormGroup;
  addPaysFormsGroup: FormGroup;
  dtTrigger1: Subject<any> = new Subject<any>();

  //formulaires de l'onglet Département
  departement: Departement[];
  suprDep: Departement =  new Departement('', '', new Pays('','',''));
  editDep: Departement =  new Departement('', '', new Pays('','',''));
  infoDep: Departement =  new Departement('', '', new Pays('','',''));
  editDepFormsGroup: FormGroup;
  addDepFormsGroup: FormGroup;
  dtTrigger2: Subject<any> = new Subject<any>();

  //formulaires de l'onglet Commune
  commune: Commune[];
  suprCom: Commune =  new Commune('', '','','', new Departement('','',new Pays('','','')));
  editCom: Commune =  new Commune('', '','','', new Departement('','',new Pays('','','')));
  infoCom: Commune =  new Commune('', '','','', new Departement('','',new Pays('','','')));
  editComFormsGroup: FormGroup;
  addComFormsGroup: FormGroup;
  dtTrigger3: Subject<any> = new Subject<any>();

  //formulaires de l'onglet Arrondissement
  arrondissement: Arrondissement[];
  suprArr: Arrondissement =  new Arrondissement('', '','','', new Commune('','','','',new Departement('','',new Pays('','',''))));
  editArr: Arrondissement =  new Arrondissement('', '','','', new Commune('','','','',new Departement('','',new Pays('','',''))));
  infoArr: Arrondissement =  new Arrondissement('', '','','', new Commune('','','','',new Departement('','',new Pays('','',''))));
  editArrFormsGroup: FormGroup;
  addArrFormsGroup: FormGroup;
  dtTrigger4: Subject<any> = new Subject<any>();

  //formulaires de l'onglet Arrondissement
  quartier: Quartier[];
  suprQua: Quartier =  new Quartier('', '','','', new Arrondissement('','','','',new Commune('','','','',new Departement('','',new Pays('','','')))));
  editQua: Quartier =  new Quartier('', '','','', new Arrondissement('','','','',new Commune('','','','',new Departement('','',new Pays('','','')))));
  infoQua: Quartier =  new Quartier('', '','','', new Arrondissement('','','','',new Commune('','','','',new Departement('','',new Pays('','','')))));
  editQuaFormsGroup: FormGroup;
  addQuaFormsGroup: FormGroup;
  dtTrigger5: Subject<any> = new Subject<any>();

  //formulaires de l'onglet Service
  service: Service[];
  suprService: Service = new Service('','');
  editService:Service = new Service('','');
  editServiceFormsGroup: FormGroup;
  addServiceFormsGroup: FormGroup;
  dtTrigger6: Subject<any> = new Subject<any>();

  //formulaires de l'onglet Site
  site: SiteMarcher[];
  suprSite:SiteMarcher = new SiteMarcher('','','',new Arrondissement('','','','',new Commune('','','','',new Departement('','',new Pays('','','')))));
  editSite:SiteMarcher = new SiteMarcher('','','',new Arrondissement('','','','',new Commune('','','','',new Departement('','',new Pays('','','')))));
  infoSite:SiteMarcher = new SiteMarcher('','','',new Arrondissement('','','','',new Commune('','','','',new Departement('','',new Pays('','','')))));
  editSiteFormsGroup: FormGroup;
  addSiteFormsGroup: FormGroup;
  dtTrigger7: Subject<any> = new Subject<any>();

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

   @ViewChild('primaryModal4') public primaryModal4: ModalDirective;
   @ViewChild('successModal4') public successModal4: ModalDirective;
   @ViewChild('warningModal4') public warningModal4: ModalDirective;
   @ViewChild('dangerModal4') public dangerModal4: ModalDirective;
   @ViewChild('infoModal4') public infoModal4: ModalDirective;

   @ViewChild('primaryModal5') public primaryModal5: ModalDirective;
   @ViewChild('successModal5') public successModal5: ModalDirective;
   @ViewChild('warningModal5') public warningModal5: ModalDirective;
   @ViewChild('dangerModal5') public dangerModal5: ModalDirective;
   @ViewChild('infoModal5') public infoModal5: ModalDirective;

   @ViewChild('primaryModal6') public primaryModal6: ModalDirective;
   @ViewChild('successModal6') public successModal6: ModalDirective;
   @ViewChild('warningModal6') public warningModal6: ModalDirective;
   @ViewChild('dangerModal6') public dangerModal6: ModalDirective;
   @ViewChild('infoModal6') public infoModal6: ModalDirective;

   @ViewChild('primaryModal7') public primaryModal7: ModalDirective;
   @ViewChild('successModal7') public successModal7: ModalDirective;
   @ViewChild('warningModal7') public warningModal7: ModalDirective;
   @ViewChild('dangerModal7') public dangerModal7: ModalDirective;
   @ViewChild('infoModal7') public infoModal7: ModalDirective;

  constructor(private communeService:CommuneService, private formBulder:FormBuilder,
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

      this.dtOptions5 = {
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

      this.dtOptions6 = {
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

      this.dtOptions7 = {
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

      this.addPaysFormsGroup = this.formBulder.group({
        addCodePays: ['', Validators.required],
        addLibPays: ['', Validators.required],
        addLibCompPays: ['', Validators.required]
        });

      this.editPaysFormsGroup = this.formBulder.group({
        editCodePays:['', Validators.required],
        editLibPays:['', Validators.required],
        editLibCompPays:['', Validators.required]
      });

      this.addDepFormsGroup = this.formBulder.group(
        {
          addCodeDepartement: ['', Validators.required],
          addNomDepartement: ['', Validators.required],
          addPays: 0
        }
      );

      this.editDepFormsGroup = this.formBulder.group(
        {
          editCodeDepartement: ['', Validators.required],
          editNomDepartement: ['', Validators.required],
          editPays: 0
        }
      );

      this.addComFormsGroup = this.formBulder.group(
        {
          addCodeCommune: ['', Validators.required],
          addNomCommune: ['', Validators.required],
          addTelCommune: ['', Validators.required],
          addAdrCommune: ['', Validators.required],
          addDep: 0,
        }
      );

      this.editComFormsGroup = this.formBulder.group(
        {
          editCodeCommune: ['', Validators.required],
          editNomCommune: ['', Validators.required],
          editTelCommune: ['', Validators.required],
          editAdrCommune: ['', Validators.required],
          editDep: 0
        }
      );

      this.addArrFormsGroup = this.formBulder.group(
        {
          addCodeArr: ['', Validators.required],
          addNomArr: ['', Validators.required],
          addTelArr: ['', Validators.required],
          addAdrArr: ['', Validators.required],
          addCom: 0,
        }
      );

      this.editArrFormsGroup = this.formBulder.group(
        {
          editCodeArr: ['', Validators.required],
          editNomArr: ['', Validators.required],
          editTelArr: ['', Validators.required],
          editAdrArr: ['', Validators.required],
          editCom: 0,
        }
      );

      this.addQuaFormsGroup = this.formBulder.group(
        {
          addCodeQua: ['', Validators.required],
          addNomQua: ['', Validators.required],
          addTelQua: ['', Validators.required],
          addAdrQua: ['', Validators.required],
          addArr: 0,
        }
      );

      this.editQuaFormsGroup = this.formBulder.group(
        {
          editCodeQua: ['', Validators.required],
          editNomQua: ['', Validators.required],
          editTelQua: ['', Validators.required],
          editAdrQua: ['', Validators.required],
          editArr: 0,
        }
      );

      this.addServiceFormsGroup = this.formBulder.group({
        addCodeService: ['', Validators.required],
        addLibService: ['', Validators.required]
        });

      this.editServiceFormsGroup = this.formBulder.group({
        editCodeService:['', Validators.required],
        editLibService:['', Validators.required]
      });

      //site
      this.addSiteFormsGroup = this.formBulder.group(
        {
          addCodeSite: ['', Validators.required],
          addLibSite: ['', Validators.required],
          addDescriSite: ['', Validators.required],
          addArr: 0,
        }
      );

      this.editSiteFormsGroup = this.formBulder.group(
        {
          editCodeSite: ['', Validators.required],
          editLibSite: ['', Validators.required],
          editDescriSite: ['', Validators.required],
          editArr: 0,
        }
      );

    }

  ngOnInit(): void {


     // listes des sites à l'initialisation
     this.communeService.getAllSiteMarcher()
     .subscribe(
       (data) => {
         this.site = data;
         this.dtTrigger7.next();
         //console.log('****+++++ Dans le ngOnInit',this.commune);
       },
       (erreur) => {
         console.log('Erreur', erreur);
       }
     );

    // listes des service à l'initialisation
    this.communeService.getAllService()
    .subscribe(
      (data) => {
        this.service = data;
        this.dtTrigger6.next();
        //console.log('****+++++ Dans le ngOnInit',this.commune);
      },
      (erreur) => {
        console.log('Erreur', erreur);
      }
    );
    // listes des quartier à l'initialisation
    this.communeService.getAllQuartier()
    .subscribe(
      (data) => {
        this.quartier = data;
        this.dtTrigger5.next();
        //console.log('****+++++ Dans le ngOnInit',this.commune);
      },
      (erreur) => {
        console.log('Erreur', erreur);
      }
    );

    // listes des arrondissement à l'initialisation
    this.communeService.getAllArrondissement()
    .subscribe(
      (data) => {
        this.arrondissement = data;
        this.dtTrigger4.next();
        //console.log('****+++++ Dans le ngOnInit',this.commune);
      },
      (erreur) => {
        console.log('Erreur', erreur);
      }
    );

     // listes des communes à l'initialisation
     this.communeService.getAllCommune()
     .subscribe(
       (data) => {
         this.commune = data;
         this.dtTrigger3.next();
         //console.log('****+++++ Dans le ngOnInit',this.commune);
       },
       (erreur) => {
         console.log('Erreur', erreur);
       }
     );

    // listes des départements à l'initialisation
    this.communeService.getAllDepartement()
    .subscribe(
      (data) => {
        this.departement = data;
        this.dtTrigger2.next();
      },
      (erreur) => {
        console.log('Erreur', erreur);
      }
    );

    // listes des pays à l'initialisation
    this.communeService.getAllPays()
    .subscribe(
      (data) => {
        console.log('Récuperation: ', data);
        this.pays = data;
        this.dtTrigger1.next();
      },
      (erreur) => {
        console.log('Erreur : '+erreur);
      }
    );

  }

// Gestion de pays
  getAllPays(){
    this.communeService.getAllPays()
    .subscribe(
      (data) => {
        this.pays = data;
      },
      (erreur) => {
        console.log('Erreur de récupération ', erreur);
      }
    );
  }

  initEditPays(ind: number)
  {
    this.editPayss = this.pays[ind];
    this.warningModal2.show();
  }

  initDeletePays(ind: number)
  {
    this.suprPayss = this.pays[ind];
    this.dangerModal2.show();
  }

  onSubmitAddPaysForm(){

    const newPay = new Pays(this.addPaysFormsGroup.value['addCodePays'],
    this.addPaysFormsGroup.value['addLibPays'],this.addPaysFormsGroup.value['addLibCompPays']);
    this.communeService.addAPays(newPay).subscribe(
      (data) => {
        console.log('Réussie : ', data);
        this.primaryModal2.hide();
        //this.router.navigate(['/article']);
        this.getAllPays();
      },
      (erreur) => {
        console.log("Echec : ", erreur);
      }
    )
  }

  onSubmitEditPaysForm()
  {
    const editPaysFormValue = this.editPaysFormsGroup.value;
    const newPay = new Pays(editPaysFormValue['editCodePays'], editPaysFormValue['editLibPays'],editPaysFormValue['editLibCompPays']);
    console.log(newPay);
    this.communeService.editPays(this.editPayss.codePays, newPay)
    .subscribe(
      (data) => {
        console.log('Objet Modifier : ', data);
        this.warningModal2.hide();
        this.getAllPays();
      },
      (erreur) => {
        console.log('Erreur : ', erreur);
      }
    );
  }

  onConfirmDeletePays(){
    this.communeService.deletePays(this.suprPayss.codePays)
    .subscribe(
      (data) => {
        console.log('Réussie : ', data);
        this.dangerModal2.hide();
        this.getAllPays();
      },
      (erreur) => {
        console.log('Erreur : ', erreur);
      }
    );
  }


  // Gestion des départements
  getAllDepartement(){
    this.communeService.getAllDepartement()
    .subscribe(
      (data) => {
        this.departement = data;
      },
      (erreur) => {
        console.log('Erreur', erreur);
      }
    )
  }

  initDeleteDep(ind:number){
    this.suprDep = this.departement[ind];
    this.dangerModal.show();

  }

  initEditDep(ind:number){
    this.editDep = this.departement[ind];
    this.warningModal.show();
  }

  initInfosDep(ind:number){
    this.infoDep = this.departement[ind];
    this.infoModal.show();
  }

  onSubmitAddDepFormsGroup()
  {
    const newDep = new Departement(this.addDepFormsGroup.value['addCodeDepartement'], this.addDepFormsGroup.value['addNomDepartement'],
   this.pays[this.addDepFormsGroup.value['addPays']]);

    this.communeService.addDepartement(newDep)
    .subscribe(
      (data) => {
        this.primaryModal.hide();
        console.log('Réussie : ', data);
        this.getAllDepartement();
      },
      (erreur) => {
        console.log('Erreur : ', erreur);
      }
    );

  }

  onSubmitEditDepFormsGroup()
  {
    const newDep = new Departement(this.editDepFormsGroup.value['editCodeDepartement'], this.editDepFormsGroup.value['editNomDepartement'],
     this.pays[this.editDepFormsGroup.value['editPays']]);
    this.communeService.editDepartement(this.editDep.codeDepartement, newDep)
    .subscribe(
      (data) => {
        this.warningModal.hide();
        this.getAllDepartement();
      },
      (erreur) => {
        console.log('Erreur lors de l\'édition du département: ', erreur);
      }
    );

  }

  onConfirmDeleteDep()
  {
    this.communeService.deleteDepartement(this.suprDep.codeDepartement)
    .subscribe(
      (data) => {
        this.dangerModal.hide();
        this.getAllDepartement();
      },
      (erreur) => {
        console.log('Erreur lors de la supression : ', erreur);
      }
    );

  }

  // Gestion des communes
  getAllCommune(){
    this.communeService.getAllCommune()
    .subscribe(
      (data) => {
        this.commune = data;
        console.log('****+++++ Dans le get All',this.commune);
      },
      (erreur) => {
        console.log('Erreur', erreur);
      }
    )
  }

  initDeleteCom(ind:number){
    this.suprCom = this.commune[ind];
    this.dangerModal3.show();

  }

  initEditCom(ind:number){
    this.editCom = this.commune[ind];
    this.warningModal3.show();
  }

  initInfosCom(ind:number){
    this.infoCom = this.commune[ind];
    this.infoModal3.show();
  }



  onSubmitAddComFormsGroup()
  {
    const newCom = new Commune(this.addComFormsGroup.value['addCodeCommune'], this.addComFormsGroup.value['addNomCommune'],
    this.addComFormsGroup.value['addTelCommune'],this.addComFormsGroup.value['addAdrCommune'],
    this.departement[this.addComFormsGroup.value['addDep']]);
    console.log('****+++++',newCom );

    this.communeService.addCommune(newCom)
    .subscribe(
      (data) => {
        this.primaryModal3.hide();
        console.log('Réussie : ', data);
        this.getAllCommune();
        console.log('****+++++',this.commune);
      },
      (erreur) => {
        console.log('Erreur : ', erreur);
      }
    );

  }

  onSubmitEditComFormsGroup()
  {
    const newCom = new Commune(this.editComFormsGroup.value['editCodeCommune'], this.editComFormsGroup.value['editNomCommune'],
    this.editComFormsGroup.value['editTelCommune'],this.editComFormsGroup.value['editAdrCommune'],
    this.departement[this.editComFormsGroup.value['editDep']]);

    this.communeService.editCommune(this.editCom.codeCommune,newCom)
    .subscribe(
      (data) => {
        this.warningModal3.hide();
        console.log('Réussie : ', data);
        this.getAllCommune();
      },
      (erreur) => {
        console.log('Erreur : ', erreur);
      }
    );

  }

  onConfirmDeleteCom()
  {
    this.communeService.deleteCommune(this.suprCom.codeCommune)
    .subscribe(
      (data) => {
        this.dangerModal3.hide();
        this.getAllCommune();
      },
      (erreur) => {
        console.log('Erreur lors de la supression : ', erreur);
      }
    );

  }

  // Gestion arrondissement

  getAllArrondissement(){
    this.communeService.getAllArrondissement()
    .subscribe(
      (data) => {
        this.arrondissement = data;
        //console.log('****+++++ Dans le get All',this.commune);
      },
      (erreur) => {
        console.log('Erreur', erreur);
      }
    )
  }

  initDeleteArr(ind:number){
    this.suprArr = this.arrondissement[ind];
    this.dangerModal4.show();

  }

  initEditArr(ind:number){
    this.editArr = this.arrondissement[ind];
    this.warningModal4.show();
  }

  initInfosArr(ind:number){
    this.infoArr = this.arrondissement[ind];
    this.infoModal4.show();
  }

  onSubmitAddArrFormsGroup()
  {
    const newArr = new Arrondissement(this.addArrFormsGroup.value['addCodeArr'], this.addArrFormsGroup.value['addNomArr'],
    this.addArrFormsGroup.value['addTelArr'],this.addArrFormsGroup.value['addAdrArr'],
    this.commune[this.addArrFormsGroup.value['addCom']]);
    console.log('****+++++',newArr );

    this.communeService.addArrondissement(newArr)
    .subscribe(
      (data) => {
        this.primaryModal4.hide();
        console.log('Réussie : ', data);
        this.getAllArrondissement();
        //console.log('****+++++',this.commune);
      },
      (erreur) => {
        console.log('Erreur : ', erreur);
      }
    );

  }

  onSubmitEditArrFormsGroup()
  {
    const newArr = new Arrondissement(this.editArrFormsGroup.value['editCodeArr'], this.editArrFormsGroup.value['editNomArr'],
    this.editArrFormsGroup.value['editTelArr'],this.editArrFormsGroup.value['editAdrArr'],
    this.commune[this.editArrFormsGroup.value['editCom']]);

    this.communeService.editArrondissement(this.editArr.codeArrondi,newArr)
    .subscribe(
      (data) => {
        this.warningModal4.hide();
        console.log('Réussie : ', data);
        this.getAllArrondissement();
      },
      (erreur) => {
        console.log('Erreur : ', erreur);
      }
    );

  }

  onConfirmDeleteArr()
  {
    this.communeService.deleteArrondissement(this.suprArr.codeArrondi)
    .subscribe(
      (data) => {
        this.dangerModal4.hide();
        this.getAllArrondissement();
      },
      (erreur) => {
        console.log('Erreur lors de la supression : ', erreur);
      }
    );

  }

  // Gestion des quartiers

  getAllQuartier(){
    this.communeService.getAllQuartier()
    .subscribe(
      (data) => {
        this.quartier = data;
        //console.log('****+++++ Dans le get All',this.commune);
      },
      (erreur) => {
        console.log('Erreur', erreur);
      }
    )
  }

  initDeleteQua(ind:number){
    this.suprQua = this.quartier[ind];
    this.dangerModal5.show();

  }

  initEditQua(ind:number){
    this.editQua = this.quartier[ind];
    this.warningModal5.show();
  }

  initInfosQua(ind:number){
    this.infoQua = this.quartier[ind];
    this.infoModal5.show();
  }

  onSubmitAddQuaFormsGroup()
  {
    const newQua = new Quartier(this.addQuaFormsGroup.value['addCodeQua'], this.addQuaFormsGroup.value['addNomQua'],
    this.addQuaFormsGroup.value['addTelQua'],this.addQuaFormsGroup.value['addAdrQua'],
    this.arrondissement[this.addQuaFormsGroup.value['addArr']]);
    console.log('****+++++',newQua );

    this.communeService.addQuartier(newQua)
    .subscribe(
      (data) => {
        this.primaryModal5.hide();
        console.log('Réussie : ', data);
        this.getAllQuartier();
        //console.log('****+++++',this.commune);
      },
      (erreur) => {
        console.log('Erreur : ', erreur);
      }
    );

  }

  onSubmitEditQuaFormsGroup()
  {
    const newQua = new Quartier(this.editQuaFormsGroup.value['editCodeQua'], this.editQuaFormsGroup.value['editNomQua'],
    this.editQuaFormsGroup.value['editTelQua'],this.editQuaFormsGroup.value['editAdrQua'],
    this.arrondissement[this.editQuaFormsGroup.value['editArr']]);

    this.communeService.editQuartier(this.editQua.codeQuartier,newQua)
    .subscribe(
      (data) => {
        this.warningModal5.hide();
        console.log('Réussie : ', data);
        this.getAllQuartier();
      },
      (erreur) => {
        console.log('Erreur : ', erreur);
      }
    );

  }

  onConfirmDeleteQua()
  {
    this.communeService.deleteQuartier(this.suprQua.codeQuartier)
    .subscribe(
      (data) => {
        this.dangerModal5.hide();
        this.getAllQuartier();
      },
      (erreur) => {
        console.log('Erreur lors de la supression : ', erreur);
      }
    );

  }

  // Gestion de service

  getAllService(){
    this.communeService.getAllService()
    .subscribe(
      (data) => {
        this.service = data;
        //console.log('****+++++ Dans le get All',this.commune);
      },
      (erreur) => {
        console.log('Erreur', erreur);
      }
    )
  }

  initDeleteService(ind:number){
    this.suprService = this.service[ind];
    this.dangerModal6.show();

  }

  initEditService(ind:number){
    this.editService = this.service[ind];
    this.warningModal6.show();
  }

  onSubmitAddServiceForm(){

    const newSev = new Service(this.addServiceFormsGroup.value['addCodeService'],
    this.addServiceFormsGroup.value['addLibService']);
    this.communeService.addService(newSev).subscribe(
      (data) => {
        console.log('Réussie : ', data);
        this.primaryModal6.hide();
        //this.router.navigate(['/article']);
        this.getAllService();
      },
      (erreur) => {
        console.log("Echec : ", erreur);
      }
    )
  }

  onSubmitEditServiceForm()
  {
    const editServiceFormValue = this.editServiceFormsGroup.value;
    const newSev = new Service(editServiceFormValue['editCodeService'], editServiceFormValue['editLibService']);
    console.log(newSev);
    this.communeService.editService(this.editService.codeService, newSev)
    .subscribe(
      (data) => {
        console.log('Objet Modifier : ', data);
        this.warningModal6.hide();
        this.getAllService();
      },
      (erreur) => {
        console.log('Erreur : ', erreur);
      }
    );
  }

  onConfirmDeleteService(){
    this.communeService.deleteService(this.suprService.codeService)
    .subscribe(
      (data) => {
        console.log('Réussie : ', data);
        this.dangerModal6.hide();
        this.getAllService();
      },
      (erreur) => {
        console.log('Erreur : ', erreur);
      }
    );
  }

  //Gestion de site 

  getAllSiteMarcher(){
    this.communeService.getAllSiteMarcher()
    .subscribe(
      (data) => {
        this.site = data;
      },
      (erreur) => {
        console.log('Erreur de récupération ', erreur);
      }
    );
  }

  initEditSite(ind: number)
  {
    this.editSite = this.site[ind];
    this.warningModal7.show();
  }

  initDeleteSite(ind: number)
  {
    this.suprSite = this.site[ind];
    this.dangerModal7.show();
  }

  initInfosSite(ind:number){
    this.infoSite = this.site[ind];
    this.infoModal7.show();
  }

  onSubmitAddSiteFormsGroup(){

    const newSite = new SiteMarcher(this.addSiteFormsGroup.value['addCodeSite'],
    this.addSiteFormsGroup.value['addLibSite'],this.addSiteFormsGroup.value['addDescriSite'],
    this.arrondissement[this.addSiteFormsGroup.value['addArr']]);
    this.communeService.addSiteMarcher(newSite).subscribe(
      (data) => {
        console.log('Réussie : ', data);
        this.primaryModal7.hide();
        //this.router.navigate(['/article']);
        this.getAllSiteMarcher();
      },
      (erreur) => {
        console.log("Echec : ", erreur);
      }
    )
  }

  onSubmitEditSiteFormsGroup()
  {
    const editSiteFormValue = this.editSiteFormsGroup.value;
    const newSite = new SiteMarcher(editSiteFormValue['editCodeSite'], editSiteFormValue['editLibSite'],
    editSiteFormValue['editDescriSite'], this.arrondissement[editSiteFormValue.value['editArr']]);
    console.log(newSite);
    this.communeService.editSiteMarcher(this.editSite.codeSite, newSite)
    .subscribe(
      (data) => {
        console.log('Objet Modifier : ', data);
        this.warningModal7.hide();
        this.getAllSiteMarcher();
      },
      (erreur) => {
        console.log('Erreur : ', erreur);
      }
    );
  }

  onConfirmDeleteSite(){
    this.communeService.deleteSiteMarcher(this.suprSite.codeSite)
    .subscribe(
      (data) => {
        console.log('Réussie : ', data);
        this.dangerModal7.hide();
        this.getAllSiteMarcher();
      },
      (erreur) => {
        console.log('Erreur : ', erreur);
      }
    );
  }


}
