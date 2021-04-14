import {Component, ViewChild, OnInit} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap/modal';
import { AppBreadcrumbService } from '@coreui/angular/lib/breadcrumb/app-breadcrumb.service';
import { ArticleService } from '../../../services/definition/article.service';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { Uniter } from '../../../models/uniter.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { data } from 'jquery';
import { Router } from '@angular/router';
import { Famille } from '../../../models/famille.model';
import { Article } from '../../../models/article.model';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css']
})
export class ArticleComponent implements OnInit {

   dtOptions1: DataTables.Settings = {};
   dtOptions2: DataTables.Settings = {};
   dtOptions3: DataTables.Settings = {};

  //formulaire de l'onglet Article
  articles: Article[];
  suprArti: Article = new Article('', '', true, true, true, true, 0, '', new Famille('',''),
  new Uniter('',''));
  editArti: Article = new Article('', '', true, true, true, true, 0, '', new Famille('',''),
  new Uniter('',''));
  infoArti: Article = new Article('', '', true, true, true, true, 0, '', new Famille('',''),
  new Uniter('',''));
  addArticleFormsGroup : FormGroup;
  editArticleFormsGroup : FormGroup;
  dtTrigger1: Subject<any> = new Subject<any>();

  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;

   //formulaires de l'onglet Unité de comptage
   unites: Uniter[];
   suprUnit: Uniter = new Uniter('','');
   editUnit:Uniter = new Uniter('','');
   editUniterFormsGroup: FormGroup;
   addUnitFormsGroup: FormGroup;
   dtTrigger2: Subject<any> = new Subject<any>();

   //formulaire de l'onglet Famille d'article
   familles: Famille[];
   suprFamil: Famille = new Famille('','');
   editFamil: Famille = new Famille('', '');
   editFamilleFormsGroup : FormGroup;
   addFamilleFormsGroup: FormGroup;
   dtTrigger3: Subject<any> = new Subject<any>();

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

  constructor( private articleService:ArticleService, private formBulder:FormBuilder,
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
     this.editUniterFormsGroup = this.formBulder.group({
       editCodeUnit:['', Validators.required],
       editLibUnit:['', Validators.required]
     });
     this.addUnitFormsGroup = this.formBulder.group({
       addCodeUnit: ['', Validators.required],
       addLibUnit: ['', Validators.required]
     });
     this.addFamilleFormsGroup = this.formBulder.group({
        addCodeFamille: ['', Validators.required],
        addLibFamille: ['', Validators.required]
     });
     this.editFamilleFormsGroup = this.formBulder.group({
      editCodeFamille: ['', Validators.required],
      editLibFamille: ['', Validators.required]
      });
     this.addArticleFormsGroup = this.formBulder.group(
       {
        addCodeArticle: ['', Validators.required],
        addLibArticle: ['', Validators.required],
        addStockerArticle: false,
        addNumSerieArticle: false,
        addLivrableArticle: false,
        addConsommableArticle: false,
        addPrixVenteArticle: [0, Validators.required],
        addCouleurArticle: '',
        addFamille: 0,
        addUniter: 0
       }
     );
     this.editArticleFormsGroup = this.formBulder.group(
       {
        editCodeArticle: ['', Validators.required],
        editLibArticle: ['', Validators.required],
        editStockerArticle: false,
        editNumSerieArticle: false,
        editLivrableArticle: false,
        editConsommableArticle: false,
        editPrixVenteArticle: [0, Validators.required],
        editCouleurArticle: '',
        editFamille: 0,
        editUniter: 0
       }
     );

    }

  ngOnInit(): void {
    this.articleService.getAllUniter()
    .subscribe(
      (data) => {
        this.unites = data;
        this.dtTrigger3.next();
      },
      (erreur) => {
        console.log('Erreur : '+erreur);
      }
    );

    this.articleService.getAllFamille()
    .subscribe(
      (data) => {
        this.familles = data;
        this.dtTrigger2.next();
      },
      (erreur) => {
        console.log('Erreur', erreur);
      }
    )

    this.articleService.getAllArticle()
    .subscribe(
      (data) => {
        this.articles = data;
        this.dtTrigger1.next();
      },
      (erreur) => {
        console.log('Erreur lors de la récupération de la liste des articles', erreur);
      }
    );
  }

  //-------------Articles
  getAllArticle(){
    this.articleService.getAllArticle()
    .subscribe(
      (data) => {
        this.articles = data;
        $('#dataTable1').dataTable().api().destroy();
        this.dtTrigger1.next();
        /*this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
          this.dtTrigger1.next();
        });*/
      },
      (erreur) => {
        console.log('Erreur lors de la récupération de la liste des articles', erreur);
      }
    );
  }

  initDeleteArticle(inde:number){
    this.suprArti = this.articles[inde];
    this.dangerModal.show();

  }

  initEditArticle(inde:number){
    this.editArti = this.articles[inde];
    this.warningModal.show();
  }

  initInfosArticle(inde:number){
    this.infoArti = this.articles[inde];
    this.infoModal.show();
  }

  onSubmitAddArtiFormsGroup(){
    const newArti = new Article(this.addArticleFormsGroup.value['addCodeArticle'], this.addArticleFormsGroup.value['addLibArticle'],
    this.addArticleFormsGroup.value['addStockerArticle'], this.addArticleFormsGroup.value['addNumSerieArticle'],
    this.addArticleFormsGroup.value['addLivrableArticle'], this.addArticleFormsGroup.value['addConsommableArticle'],
    this.addArticleFormsGroup.value['addPrixVenteArticle'], this.addArticleFormsGroup.value['addCouleurArticle'],
    this.familles[this.addArticleFormsGroup.value['addFamille']], this.unites[this.addArticleFormsGroup.value['addUniter']]);

    this.articleService.addArticle(newArti)
    .subscribe(
      (data) => {
        //this.primaryModal.hide();
        this.addArticleFormsGroup.patchValue({
          addCodeArticle:null,
          addLibArticle:null,
          addPrixVenteArticle:0,
          addCouleurArticle:''
        });
        //this.getAllFamille();
        //this.getAllUnites();
        this.getAllArticle();

      },
      (erreur) => {
        console.log('Erreur : ', erreur);
      }
    );

  }

  onSubmitEditArtiFormsGroup(){
    const newArti = new Article(this.editArticleFormsGroup.value['editCodeArticle'], this.editArticleFormsGroup.value['editLibArticle'],
    this.editArticleFormsGroup.value['editStockerArticle'], this.editArticleFormsGroup.value['editNumSerieArticle'],
    this.editArticleFormsGroup.value['editLivrableArticle'], this.editArticleFormsGroup.value['editConsommableArticle'],
    this.editArticleFormsGroup.value['editPrixVenteArticle'], this.editArticleFormsGroup.value['editCouleurArticle'],
    this.familles[this.editArticleFormsGroup.value['editFamille']], this.unites[this.editArticleFormsGroup.value['editUniter']]);

    this.articleService.editArticle(this.editArti.codeArticle, newArti)
    .subscribe(
      (data) => {
        this.warningModal.hide();
        this.getAllArticle();
        this.getAllFamille();
        this.getAllUnites();
      },
      (erreur) => {
        console.log('Erreur lors de l\'édition d\'article : ', erreur);
      }
    );

  }

  onConfirmDeleteArti(){
    this.articleService.deleteArticle(this.suprArti.codeArticle)
    .subscribe(
      (data) => {
        this.dangerModal.hide();
        this.getAllArticle();
        this.getAllFamille();
        this.getAllUnites();
      },
      (erreur) => {
        console.log('Erreur lors de la supression : ', erreur);
      }
    );

  }

  //-------------Familles
  getAllFamille(){
    this.articleService.getAllFamille()
    .subscribe(
      (data) => {
        this.familles = data;
        $('#dataTable2').dataTable().api().destroy();
        this.dtTrigger2.next();
        /*this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
          this.dtTrigger2.next();
        });*/
      },
      (erreur) => {
        console.log('Erreur', erreur);
      }
    )
  }

  initDeleteFamille(inde:number){
    this.suprFamil = this.familles[inde];
    this.dangerModal2.show();
  }

  initEditFamille(inde:number){
    this.editFamil = this.familles[inde];
    this.warningModal2.show();
    console.log(this.editFamil);
  }

  onSubmitAddFamilleForm(){
    const newFamil = new Famille(this.addFamilleFormsGroup.value['addCodeFamille'], this.addFamilleFormsGroup.value['addLibFamille']);
    this.articleService.addAFamille(newFamil)
    .subscribe(
      (data) => {
        //console.log('Réussie : ', data);
        //this.primaryModal2.hide();
        this.addFamilleFormsGroup.reset();
        this.getAllFamille();
      },
      (erreur) => {
        console.log('Erreur lors de l\'enrégistrement', erreur);
      }
    );
  }

  onSubmitEditFamilleForm(){
    const newFamil = new Famille(this.editFamilleFormsGroup.value['editCodeFamille'], this.editFamilleFormsGroup.value['editLibFamille']);
    this.articleService.editAFamille(this.editFamil.codeFamille, newFamil)
    .subscribe(
      (data) => {
        console.log('Modification Réussie : ', data, this.editFamil.codeFamille, newFamil);
        this.warningModal2.hide();
        this.getAllFamille();
      },
      (erreur) => {
        console.log('Erreur lors de la modification : ', erreur);
      }
    );
  }

  onConfirmDeleteFamille(){
    this.articleService.deleteAFamille(this.suprFamil.codeFamille)
    .subscribe(
      (data) => {
        console.log('Réussie : ', data);
        this.dangerModal2.hide();
        this.getAllFamille();
      },
      (erreur) => {
        console.log('Erreur : ', erreur);
      }
    );
  }


  //-----------------Unité
  getAllUnites(){
    this.articleService.getAllUniter()
    .subscribe(
      (data) => {
        this.unites = data;
        $('#dataTable3').dataTable().api().destroy();
        this.dtTrigger3.next();
        /*this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
          this.dtTrigger3.next();
        });*/
      },
      (erreur) => {
        console.log('Erreur : '+erreur);
      }
    );
  }

  onSubmitEditUnitForm(){
    const editUnitFormValue = this.editUniterFormsGroup.value;
    const newUnit = new Uniter(editUnitFormValue['editCodeUnit'], editUnitFormValue['editLibUnit']);
    console.log(newUnit);
    this.articleService.editAUniter(this.editUnit.codeUniter, newUnit)
    .subscribe(
      (data) => {
        //console.log('Objet Modifier : ', data);
        this.warningModal3.hide();
        this.getAllUnites();
      },
      (erreur) => {
        console.log('Erreur : ', erreur);
      }
    );

  }

  onSubmitAddUnitForm(){

    const newUnit = new Uniter(this.addUnitFormsGroup.value['addCodeUnit'],
    this.addUnitFormsGroup.value['addLibUnit']);
    this.articleService.addAUniter(newUnit).subscribe(
      (data) => {
        //console.log('Réussie : ', data);
        //this.primaryModal3.hide();
        //this.router.navigate(['/article']);
        this.addUnitFormsGroup.reset();
        this.getAllUnites();
      },
      (erreur) => {
        console.log("Echec : ", erreur);
      }
    )
  }

  onConfirmDeleteUnit(){
    this.articleService.deleteAUniter(this.suprUnit.codeUniter)
    .subscribe(
      (data) => {
        if(data==false){
          this.dangerModal3.hide();
          this.getAllUnites();
          console.log('Réussie : ', data);
        }
        else{
          console.log('Erreur : ', data);
        }
      },
      (erreur) => {
        console.log('Erreur : ', erreur);
      }
    );
  }

  initDeleteUniter(inde:number){
    this.suprUnit = this.unites[inde];
    this.dangerModal3.show();
  }

  initEditUniter(inde:number){
    this.editUnit = this.unites[inde];
    //this.carct = this.editUnit.codeUniter;
    console.log(this.editUnit);
    this.warningModal3.show();
  }





}


