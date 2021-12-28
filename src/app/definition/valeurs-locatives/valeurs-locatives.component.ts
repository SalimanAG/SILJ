import {Component, ViewChild, OnInit} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap/modal';
import { AppBreadcrumbService } from '@coreui/angular/lib/breadcrumb/app-breadcrumb.service';
import { ValeurLocativeService } from '../../../services/definition/valeur-locative.service';
//import { CommuneService } from '../../../services/definition/commune.service';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { data } from 'jquery';
import { Router } from '@angular/router';
import { Immeuble } from '../../../models/immeuble.model';
import { TypeImmeuble } from '../../../models/typeImmeuble.model';
import { PrixImmeuble } from '../../../models/prixImmeuble.model';
import { Quartier } from '../../../models/quartier.model';
import { Arrondissement } from '../../../models/arrondissement.model';
import { Commune } from '../../../models/commune.model';
import { Departement } from '../../../models/departement.model';
import { Pays } from '../../../models/pays.model';
import { SiteMarcher } from '../../../models/siteMarcher.model';
import { Tools2Service } from '../../../services/utilities/tools2.service';

@Component({
  selector: 'app-valeurs-locatives',
  templateUrl: './valeurs-locatives.component.html',
  styleUrls: ['./valeurs-locatives.component.css']
})
export class ValeursLocativesComponent implements OnInit {

  dtOptions1: DataTables.Settings = {};
  dtOptions2: DataTables.Settings = {};
  dtOptions3: DataTables.Settings = {};

  //formulaires de l'onglet valeur locative
  arrondissement: Arrondissement[];
  quartier: Quartier[];
  site: SiteMarcher[];

  QuartierByArrondissement:Quartier[] = [];
  //typeImmeuble: TypeImmeuble[];
  periodes = Tools2Service.typePeriodes;
  immeuble: Immeuble[];
  Imm: Immeuble;
  immeuble200: Immeuble[]=[];
  suprValLoc: Immeuble = new Immeuble('', '', '', true, 0, '', '', new Arrondissement('', '', '', '', new Commune('', '', '', '', new Departement('', '', new Pays('', '', '')))), new Quartier('', '', '', '', new Arrondissement('', '', '', '', new Commune('', '', '', '', new Departement('', '', new Pays('', '', ''))))), new TypeImmeuble('','', false, false, false, false, 1, 'Jour'), new SiteMarcher('', '', '', new Arrondissement('', '', '', '', new Commune('', '', '', '', new Departement('', '', new Pays('', '', ''))))), '', '', true, 0, 0, '', '', '');
  editValLoc: Immeuble = new Immeuble('', '', '', true, 0, '', '', new Arrondissement('', '', '', '', new Commune('', '', '', '', new Departement('', '', new Pays('', '', '')))), new Quartier('', '', '', '', new Arrondissement('', '', '', '', new Commune('', '', '', '', new Departement('', '', new Pays('', '', ''))))), new TypeImmeuble('','', false, false, false, false, 1, 'Jour'), new SiteMarcher('', '', '', new Arrondissement('', '', '', '', new Commune('', '', '', '', new Departement('', '', new Pays('', '', ''))))), '', '', true, 0, 0, '', '', '');
  infoValLoc: Immeuble = new Immeuble('', '', '', true, 0, '', '', new Arrondissement('', '', '', '', new Commune('', '', '', '', new Departement('', '', new Pays('', '', '')))), new Quartier('', '', '', '', new Arrondissement('', '', '', '', new Commune('', '', '', '', new Departement('', '', new Pays('', '', ''))))), new TypeImmeuble('','', false, false, false, false, 1, 'Jour'), new SiteMarcher('', '', '', new Arrondissement('', '', '', '', new Commune('', '', '', '', new Departement('', '', new Pays('', '', ''))))), '', '', true, 0, 0, '', '', '');
  editValLocFormsGroup: FormGroup;
  addValLocFormsGroup: FormGroup;
  dtTrigger1: Subject<any> = new Subject<any>();

  //formulaires de l'onglet Type de valeur locative
  typeImmeuble: TypeImmeuble[];
   suprTypeIm: TypeImmeuble = new TypeImmeuble('','', false, false, false, false, 1, 'Jour');
   editTypeIm:TypeImmeuble = new TypeImmeuble('','', false, false, false, false, 1, 'Jour');
   editTypeImFormsGroup: FormGroup;
   addTypeImFormsGroup: FormGroup;
   dtTrigger2: Subject<any> = new Subject<any>();

  //formulaires de l'onglet Prix de valeur locative
   prixImmeuble: PrixImmeuble[];
  suprPrixImmeuble: PrixImmeuble = new PrixImmeuble(10, new Date(Date.now()), new Date(Date.now()), 200, new TypeImmeuble('','', false, false, false, false, 1, 'Jour'));
  editPrixImmeuble: PrixImmeuble = new PrixImmeuble(10, new Date(Date.now()), new Date(Date.now()), 200, new TypeImmeuble('','', false, false, false, false, 1, 'Jour'));
   editPrixImFormsGroup: FormGroup;
   addPrixImFormsGroup: FormGroup;
   dtTrigger3: Subject<any> = new Subject<any>();

  @ViewChild('primaryModal1') public primaryModal1: ModalDirective;
   @ViewChild('successModal1') public successModal1: ModalDirective;
   @ViewChild('warningModal1') public warningModal1: ModalDirective;
   @ViewChild('dangerModal1') public dangerModal1: ModalDirective;
   @ViewChild('infoModal1') public infoModal1: ModalDirective;

  @ViewChild('primaryModal2') public primaryModal2: ModalDirective;
   @ViewChild('successModal2') public successModal2: ModalDirective;
   @ViewChild('warningModal2') public warningModal2: ModalDirective;
   @ViewChild('dangerModal2') public dangerModal2: ModalDirective;
   @ViewChild('infoModal2') public infoModal2: ModalDirective;

  @ViewChild('primaryModal3') public primaryModal3: ModalDirective;
   @ViewChild('successModal3') public successModal3: ModalDirective;
   @ViewChild('warningModal3') public warningModal3: ModalDirective;
   @ViewChild('dangerModal3') public dangerModal3: ModalDirective;
   //@ViewChild('infoModal3') public infoModal3: ModalDirective;

  constructor(private valeurLocativeService:ValeurLocativeService,  private formBulder:FormBuilder,
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
    }

    initForms(){
      this.addValLocFormsGroup = this.formBulder.group(
        {
          addCodeIm: ['', Validators.required],
          addLibIm: ['', Validators.required],
          addLocalisationIm: ['', Validators.required],
          addEtataIm: false,
          addSuperficieIm: '',
          addStuctRespIm: '',
          addAutreIm: '',
          addArr: 0,
          addQua: -1,
          addSite: 0,
          addTypeValLoc: 0,
          addIlot: '',
          addParcelle: '',
          addBatie: true,
          addNbrFace: 0,
          addNbrPlace: 0,
          addActiviter: '',
          addForme: '',
          addDimensions: '',

        }
      );

      this.editValLocFormsGroup = this.formBulder.group(
        {
          editCodeIm: ['', Validators.required],
          editLibIm: ['', Validators.required],
          editLocalisationIm: ['', Validators.required],
          editEtatIm: false,
          editSuperficieIm: '',
          editStuctRespIm: '',
          editAutreIm: '',
          editArr: 0,
          editQua: -1,
          editSite: 0,
          editTypeValLoc: 0,
          editIlot: '',
          editParcelle: '',
          editBatie: true,
          editNbrFace: 0,
          editNbrPlace: 0,
          editActiviter: '',
          editForme: '',
          editDimensions: '',

        }
      );

      this.editTypeImFormsGroup = this.formBulder.group({
        editCodeTypIm:['', Validators.required],
        editLibTypIm:['', Validators.required],
        editValUnit: false,
        editValSuperfi: false,
        editValFace: false,
        editValPlace: false,
        editPeriodiciterJrs: 1,
        editNomUnePeriode: '',
        editPeriode:1,

      });
      
      this.addTypeImFormsGroup = this.formBulder.group({
        addCodeTypIm: ['', Validators.required],
        addLibTypIm: ['', Validators.required],
        addValUnit: false,
        addValSuperfi: false,
        addValFace: false,
        addValPlace: false,
        addPeriodiciterJrs: 1,
        addNomUnePeriode: '',
        addPeriode:1,

      });

      this.addPrixImFormsGroup = this.formBulder.group(
        {
          addDateDebutPrixIm: [new Date().toISOString().substring(0, 10), Validators.required],
          addDateFinPrixIm: '',
          addPrixIm: [0, Validators.required],
          addType: 0,
        }
      );

      this.editPrixImFormsGroup = this.formBulder.group(
        {
          editIdPrixIm:[0, Validators.required],
          editDateDebutPrixIm: ['',Validators.required],
          editDateFinPrixIm: '',
          editPrixIm: [15000, Validators.required],
          editType: 0,
        }
      );

    }

  ngOnInit(): void {

    // listes des prix valeurs locatives à l'initialisation
    this.valeurLocativeService.getAllPrixImmeuble()
    .subscribe(
      (data) => {
        this.prixImmeuble = data;
        this.dtTrigger3.next();
        //console.log('****+++++ Dans le ngOnInit',this.commune);
      },
      (erreur) => {
        console.log('Erreur', erreur);
      }
    );

    // listes des valeurs locatives à l'initialisation
    this.valeurLocativeService.getAllTypeImmeuble()
    .subscribe(
      (data) => {
        this.typeImmeuble = data;
        this.dtTrigger2.next();
        //console.log('****+++++ Dans le ngOnInit',this.commune);
      },
      (erreur) => {
        console.log('Erreur', erreur);
      }
    );
    // listes des valeurs locatives à l'initialisation
    this.valeurLocativeService.getAllImmeuble()
    .subscribe(
      (data) => {
        this.immeuble = data;

         //$('#valLocative').dataTable().api().destroy();
         //this.dtTrigger1.next();
        this.dtTrigger1.next();
        //console.log('****+++++ Dans le ngOnInit',this.commune);
      },
      (erreur) => {
        console.log('Erreur', erreur);
      }
    );

    // listes des quartier à l'initialisation
    this.valeurLocativeService.getAllQuartier()
    .subscribe(
      (data) => {
        this.quartier = data;

        this.valeurLocativeService.getAllArrondissement().subscribe(
          (data2) => {
            this.arrondissement = data2;
            if(this.arrondissement.length !=0)
            this.getAllQuartierByCodeArrondi(this.arrondissement[0].codeArrondi);
          },
          (erreur) => {
            console.log('Erreur lors de la récupération de la liste des arrondissements : ', erreur);
          }
        );
      },
      (erreur) => {
        console.log('Erreur', erreur);
      }
    );

    // listes des sites à l'initialisation
    this.valeurLocativeService.getAllSiteMarcher()
    .subscribe(
      (data) => {
        this.site = data;
        //this.dtTrigger7.next();
        //console.log('****+++++ Dans le ngOnInit',this.commune);
      },
      (erreur) => {
        console.log('Erreur', erreur);
      }
    );


  }


  getAllQuartierByCodeArrondi(code:String){
    this.QuartierByArrondissement = [];
    this.quartier.forEach(element => {
      if(element.arrondissement.codeArrondi===code){
        this.QuartierByArrondissement.push(element);
      }
    });

  }

  getAllQuartierByFormsArrondi1(){
    this.getAllQuartierByCodeArrondi(this.arrondissement.find(l => l.codeArrondi == this.addValLocFormsGroup.value['addArr']).codeArrondi);
  }
  getAllQuartierByFormsArrondi2(){
    this.getAllQuartierByCodeArrondi(this.arrondissement.find(l => l.codeArrondi == this.editValLocFormsGroup.value['editArr']).codeArrondi);
  }
  // Gestion de valeur locative
  getAllImmeuble(){
    this.valeurLocativeService.getAllImmeuble()
    .subscribe(
      (data) => {
        this.immeuble = data;
        $('#valLocative').dataTable().api().destroy();
         this.dtTrigger1.next();
      },
      (erreur) => {
        console.log('Erreur de récupération ', erreur);
      }
    );
  }

  initEditValLoc(ind: string)
  {
    this.editValLoc = this.immeuble[ind];
    this.getAllQuartierByCodeArrondi(this.editValLoc.arrondissement.codeArrondi);
    this.editValLocFormsGroup.patchValue({
      editCodeIm: this.editValLoc.codeIm,
      editLibIm: this.editValLoc.libIm,
      editLocalisationIm: this.editValLoc.localisationIm,
      editEtatIm: this.editValLoc.etatIm,
      editSuperficieIm: this.editValLoc.superficie,
      editStuctRespIm: this.editValLoc.stuctResp,
      editAutreIm: this.editValLoc.autre,
      editArr: this.editValLoc.arrondissement.codeArrondi,
      editQua: this.editValLoc.quartier?.codeQuartier,
      editSite: this.editValLoc.siteMarcher.codeSite,
      editTypeValLoc: this.editValLoc.typeImmeuble.codeTypIm,
      editIlot: this.editValLoc.ilot,
      editParcelle: this.editValLoc.parcelle,
      editBatie: this.editValLoc.batie,
      editNbrFace: this.editValLoc.nbrFace,
      editNbrPlace: this.editValLoc.nbrPlace,
      editActiviter: this.editValLoc.activiter,
      editForme: this.editValLoc.forme,
      editDimensions: this.editValLoc.dimensions,
      
    });
    this.warningModal1.show();
  }

  initDeleteValLoc(ind: string)
  {
    this.suprValLoc = this.immeuble[ind];
    this.dangerModal1.show();
  }

  initInfosValLoc(ind: string)
  {
    this.infoValLoc = this.immeuble[ind];
    this.infoModal1.show();
  }


  onSubmitAddValLocFormsGroup()
  {
    

    const newValLoc = new Immeuble(this.addValLocFormsGroup.value['addCodeIm'], this.addValLocFormsGroup.value['addLibIm'],this.addValLocFormsGroup.value['addLocalisationIm'],
    this.addValLocFormsGroup.value['addEtataIm'],this.addValLocFormsGroup.value['addSuperficieIm'], this.addValLocFormsGroup.value['addStuctRespIm'],
    this.addValLocFormsGroup.value['addAutreIm'], this.arrondissement.find( l => l.codeArrondi == this.addValLocFormsGroup.value['addArr']), this.quartier.find(l => l.codeQuartier == this.addValLocFormsGroup.value['addQua']),
    this.typeImmeuble.find(l => l.codeTypIm == this.addValLocFormsGroup.value['addTypeValLoc']), this.site.find(l => l.codeSite == this.addValLocFormsGroup.value['addSite'])
    , this.addValLocFormsGroup.value['addIlot'], this.addValLocFormsGroup.value['addParcelle'], this.addValLocFormsGroup.value['addBatie']
    , this.addValLocFormsGroup.value['addNbrFace'], this.addValLocFormsGroup.value['addNbrPlace'], this.addValLocFormsGroup.value['addActiviter']
    , this.addValLocFormsGroup.value['addForme'], this.addValLocFormsGroup.value['addDimensions']);

    this.valeurLocativeService.addImmeuble(newValLoc)
    .subscribe(
      (data) => {
        this.addValLocFormsGroup.reset();
        this.initForms();
        this.primaryModal1.hide();
        console.log('Réussie : ', data);
        this.getAllImmeuble();
      },
      (erreur) => {
        console.log('Erreur : ', erreur);
      }
    );

  }

  onSubmitEditValLocFormsGroup()
  {
    const newValLoc = new Immeuble(this.editValLocFormsGroup.value['editCodeIm'], this.editValLocFormsGroup.value['editLibIm'],this.editValLocFormsGroup.value['editLocalisationIm'],
    false,this.editValLocFormsGroup.value['editSuperficieIm'], this.editValLocFormsGroup.value['editStuctRespIm'],
    this.editValLocFormsGroup.value['editAutreIm'], this.arrondissement.find( l => l.codeArrondi == this.editValLocFormsGroup.value['editArr']), this.quartier.find(l => l.codeQuartier == this.editValLocFormsGroup.value['editQua']),
    this.typeImmeuble.find(l => l.codeTypIm == this.editValLocFormsGroup.value['editTypeValLoc']), this.site.find(l => l.codeSite == this.editValLocFormsGroup.value['editSite'])
    , this.editValLocFormsGroup.value['editIlot'], this.editValLocFormsGroup.value['editParcelle'], this.editValLocFormsGroup.value['editBatie']
    , this.editValLocFormsGroup.value['editNbrFace'], this.editValLocFormsGroup.value['editNbrPlace'], this.editValLocFormsGroup.value['editActiviter']
    , this.editValLocFormsGroup.value['editForme'], this.editValLocFormsGroup.value['editDimensions']);

    this.valeurLocativeService.editImmeuble(this.editValLoc.codeIm, newValLoc)
    .subscribe(
      (data) => {
        this.warningModal1.hide();
        this.getAllImmeuble();
      },
      (erreur) => {
        console.log('Erreur lors de l\'édition du département: ', erreur);
      }
    );

  }

  onConfirmDeleteValLoc()
  {
    this.valeurLocativeService.deleteImmeuble(this.suprValLoc.codeIm)
    .subscribe(
      (data) => {
        this.dangerModal1.hide();
        this.getAllImmeuble();
      },
      (erreur) => {
        console.log('Erreur lors de la supression : ', erreur);
      }
    );

  }



  // Gestion de Type valeur locative
  getAllTypeImmeuble(){
    this.valeurLocativeService.getAllTypeImmeuble()
    .subscribe(
      (data) => {
        this.typeImmeuble = data;
        $('#TypevalLocative').dataTable().api().destroy();
         this.dtTrigger2.next();

      },
      (erreur) => {
        console.log('Erreur de récupération ', erreur);
      }
    );
  }

  initEditTypeIm(ind: number)
  {
    this.editTypeIm = this.typeImmeuble[ind];
    this.editTypeImFormsGroup.patchValue({
      editCodeTypIm: this.editTypeIm.codeTypIm,
      editLibTypIm: this.editTypeIm.libTypIm,
      editValUnit: this.editTypeIm.valUnit,
      editValSuperfi: this.editTypeIm.valSuperfi,
      editValFace: this.editTypeIm.valFace,
      editValPlace: this.editTypeIm.valPlace,
      editPeriodiciterJrs: this.editTypeIm.periodiciterJrs,
      editNomUnePeriode: this.editTypeIm.nomUnePeriode,
      editPeriode: this.editTypeIm.periodiciterJrs,
    })
    this.warningModal2.show();
  }

  initDeleteTypeIm(ind: number)
  {
    this.suprTypeIm = this.typeImmeuble[ind];
    this.dangerModal2.show();
  }

  onSubmitAddTypeImForm(){
    
    const newTypeIm = new TypeImmeuble(this.addTypeImFormsGroup.value['addCodeTypIm'], this.addTypeImFormsGroup.value['addLibTypIm']
    , this.addTypeImFormsGroup.value['addValUnit'], this.addTypeImFormsGroup.value['addValSuperfi'], this.addTypeImFormsGroup.value['addValFace']
    , this.addTypeImFormsGroup.value['addValPlace'], this.addTypeImFormsGroup.value['addPeriode'], this.periodes.find(l => l.code == this.addTypeImFormsGroup.value['addPeriode'])?.name);
    this.valeurLocativeService.addTypeImmeuble(newTypeIm)
    .subscribe(
      (data) => {
        this.addTypeImFormsGroup.reset();
        this.initForms();
        console.log('Réussie : ', data);
        this.primaryModal2.hide();
        this.getAllTypeImmeuble();
      },
      (erreur) => {
        console.log('Erreur lors de l\'enrégistrement', erreur);
      }
    );
  }

  onSubmitEditTypeImForm(){
    const newTypeIm = new TypeImmeuble(this.editTypeImFormsGroup.value['editCodeTypIm'], this.editTypeImFormsGroup.value['editLibTypIm']
    , this.editTypeImFormsGroup.value['editValUnit'], this.editTypeImFormsGroup.value['editValSuperfi'], this.editTypeImFormsGroup.value['editValFace']
    , this.editTypeImFormsGroup.value['editValPlace'], this.editTypeImFormsGroup.value['editPeriode'], this.periodes.find(l => l.code == this.editTypeImFormsGroup.value['editPeriode'])?.name);
    this.valeurLocativeService.editTypeImmeuble(this.editTypeIm.codeTypIm, newTypeIm)
    .subscribe(
      (data) => {
        console.log('Modification Réussie : ', data);
        this.warningModal2.hide();
        this.getAllTypeImmeuble();
      },
      (erreur) => {
        console.log('Erreur lors de la modification : ', erreur);
      }
    );
  }

  onConfirmDeleteTypeIm(){
    this.valeurLocativeService.deleteTypeImmeuble(this.suprTypeIm.codeTypIm)
    .subscribe(
      (data) => {
        console.log('Réussie : ', data);
        this.dangerModal2.hide();
        this.getAllTypeImmeuble();
      },
      (erreur) => {
        console.log('Erreur : ', erreur);
      }
    );
  }

   // Gestion de prix valeur locative
   getAllPrixImmeuble(){
    this.valeurLocativeService.getAllPrixImmeuble()
    .subscribe(
      (data) => {
        this.prixImmeuble = data;
        $('#PrixvalLocative').dataTable().api().destroy();
         this.dtTrigger3.next();
      },
      (erreur) => {
        console.log('Erreur de récupération ', erreur);
      }
    );
  }

  initEditPrixIm(ind: number)
  {
    this.editPrixImmeuble = this.prixImmeuble[ind];
    this.editPrixImFormsGroup.patchValue({
      editIdPrixIm: this.editPrixImmeuble.idPrixIm,
      editDateDebutPrixIm: this.editPrixImmeuble.dateDebPrixIm,
      editDateFinPrixIm: this.editPrixImmeuble.dateFinPrixIm,
      editPrixIm: this.editPrixImmeuble.prixIm,
      editType: this.editPrixImmeuble.typeImmeuble.codeTypIm,
    });
    this.warningModal3.show();
  }

  initDeletePrixIm(ind: number)
  {
    this.suprPrixImmeuble = this.prixImmeuble[ind];
    this.dangerModal3.show();
  }

  onSubmitAddPrixImForm(){
    const newPrixIm = new PrixImmeuble(1, this.addPrixImFormsGroup.value['addDateDebutPrixIm'],
    this.addPrixImFormsGroup.value['addDateFinPrixIm'], this.addPrixImFormsGroup.value['addPrixIm'],
    this.typeImmeuble.find(l => l.codeTypIm == this.addPrixImFormsGroup.value['addType']));

    let exist:boolean = false;
    //this.typeImmeuble.push(this.typeImmeuble.find( l => l.codeTypIm == this.addPrixImFormsGroup.value['addType'])) ;
    console.log('880',this.typeImmeuble);


    this.valeurLocativeService.getAllPrixImmeuble().subscribe(
      (data)=>{
        data.forEach(element =>{
          if(element.dateFinPrixIm == null && element.typeImmeuble.codeTypIm == this.typeImmeuble.find(l => l.codeTypIm == this.addPrixImFormsGroup.value['addType']).codeTypIm)
          {
           // console.log(new Date(this.addPrixImFormsGroup.value['addDateDebutPrixIm']).getDate() -1);
            element.dateFinPrixIm =  new Date(this.addPrixImFormsGroup.value['addDateDebutPrixIm']);
            element.dateFinPrixIm.setDate(new Date(this.addPrixImFormsGroup.value['addDateDebutPrixIm']).getDate() -1);
            //console.log(element.dateFinPrixIm);

            this.valeurLocativeService.editPrixImmeuble(element.idPrixIm, element).subscribe(
            (data) => {
            console.log('Modification Réussie : ',data);
                },
            (erreur) => {
            console.log('Erreur lors de la modification : ', erreur);
                }
             );
          }

        });
        //this.caisses=data;
      },
      (err)=>{
        console.log('Caisses:', err)
      }
    );
    this.valeurLocativeService.addPrixImmeuble(newPrixIm)
    .subscribe(
      (data) => {
        this.addPrixImFormsGroup.reset();
        this.initForms();
        console.log('Réussie : ', data);
        this.primaryModal3.hide();
        this.getAllPrixImmeuble();
      },
      (erreur) => {
        console.log('Erreur lors de l\'enrégistrement', erreur);
      }
    );
  }

  onSubmitEditPrixImForm(){
    const newPrixIm = new PrixImmeuble(this.editPrixImFormsGroup.value['editIdPrixIm'], this.editPrixImFormsGroup.value['editDateDebutPrixIm'],
    this.editPrixImFormsGroup.value['editDateFinPrixIm'], this.editPrixImFormsGroup.value['editPrixIm'],
    this.typeImmeuble.find(l => l.codeTypIm == this.editPrixImFormsGroup.value['editType']));
    console.log('++++', newPrixIm);

    this.valeurLocativeService.editPrixImmeuble(this.editPrixImmeuble.idPrixIm, newPrixIm)
    .subscribe(
      (data) => {
        console.log('Modification Réussie : ',data);
        this.warningModal3.hide();
        this.getAllPrixImmeuble();
      },
      (erreur) => {
        console.log('Erreur lors de la modification : ', erreur);
      }
    );
  }

  onConfirmDeletePrixIm(){
    this.valeurLocativeService.deletePrixImmeuble(this.suprPrixImmeuble.idPrixIm)
    .subscribe(
      (data) => {
        console.log('Réussie : ', data);
        this.dangerModal3.hide();
        this.getAllPrixImmeuble();
      },
      (erreur) => {
        console.log('Erreur : ', erreur);
      }
    );
  }



}
