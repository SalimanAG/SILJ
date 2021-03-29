import {Component, ViewChild, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { data } from 'jquery';
import {ModalDirective} from 'ngx-bootstrap/modal';
import { exit } from 'process';
import { Subject } from 'rxjs';
import { Article } from '../../models/article.model';
import { Exercice } from '../../models/exercice.model';
import { Famille } from '../../models/famille.model';
import { Fournisseur } from '../../models/fournisseur.model';
import { Gerer } from '../../models/gerer.model';
import { Magasin } from '../../models/magasin.model';
import { Magasinier } from '../../models/magasinier.model';
import { Regisseur } from '../../models/regisseur.model';
import { Stocker } from '../../models/stocker.model';
import { Uniter } from '../../models/uniter.model';
import { ExerciceService } from '../../services/administration/exercice.service';
import { ArticleService } from '../../services/definition/article.service';
import { CorrespondantService } from '../../services/definition/correspondant.service';
import { FournisseurService } from '../../services/definition/fournisseur.service';
import { RegisseurService } from '../../services/definition/regisseur.service';

@Component({
  selector: 'app-si-caveau-tresor',
  templateUrl: './si-caveau-tresor.component.html',
  styleUrls: ['./si-caveau-tresor.component.css']
})
export class SiCaveauTresorComponent implements OnInit {

  @ViewChild('primaryModal') public primaryModal: ModalDirective;
  @ViewChild('successModal') public successModal: ModalDirective;
  @ViewChild('warningModal') public warningModal: ModalDirective;
  @ViewChild('dangerModal') public dangerModal: ModalDirective;
  @ViewChild('infoModal') public infoModal: ModalDirective;

  dtOptions1: DataTables.Settings = {};
  dtTrigger1: Subject<any> = new Subject<any>();
  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;
  //+++++++++++++++++++++++++++++++++++++++
  addFrsFormsGroup: FormGroup;
  editFrsFormsGroup: FormGroup;
  fournisseurs:Fournisseur[];
  editFrs:Fournisseur = new Fournisseur('', '', '', '', '', '', '');
  suprFrs:Fournisseur = new Fournisseur('', '', '', '', '', '', '');
  infosFrs:Fournisseur = new Fournisseur('', '', '', '', '', '', '');//++++++++++++++++++++++

  articles:Article[] = [];
  articlesByExoNotNull:Article[] = [];
  articlesByExoNull:Article[] = [];
  selectedArticle:Article = new Article('', '', true, true, true, true, 0, '', new Famille('',''),
  new Uniter('',''));
  regisseurs:Regisseur[] = [];
  magasiniers:Magasinier[] = [];
  stockers:Stocker[] = [];
  gerers:Gerer[] = [];
  magasins:Magasin[] = [];
  carveauxTresor:Magasin = new Magasin('', '');
  addStockFormsGroup: FormGroup;
  editStockFormsGroup: FormGroup;

  editSI:Article = new Article('', '', true, true, true, true, 0, '', new Famille('',''),
  new Uniter('',''));
  suprSI:Article = new Article('', '', true, true, true, true, 0, '', new Famille('',''),
  new Uniter('',''));
  infosSI:Article = new Article('', '', true, true, true, true, 0, '', new Famille('',''),
  new Uniter('',''), 0, 0, new Date(), new Exercice('','', new Date(), new Date(), '', false));

  constructor(private formBulder: FormBuilder, private frsService:FournisseurService,
    private serviceCorres:CorrespondantService, private serviceRegisseur:RegisseurService,
    private serviceArticle:ArticleService, private serviceExo:ExerciceService) {

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
    //+++++++++++++++++++++++++++++++++
    this.addFrsFormsGroup = this.formBulder.group({
      addCodeFrs:['', Validators.required],
      addIdentiteFrs:['', Validators.required],
      addAdresseFrs:'',
      addRaisonSociale:'',
      addNumIfuFrs:'',
      addTelFRS:'',
      addDescription:''
    });

    this.editFrsFormsGroup = this.formBulder.group({
      editCodeFrs:['', Validators.required],
      editIdentiteFrs:['', Validators.required],
      editAdresseFrs:'',
      editRaisonSociale:'',
      editNumIfuFrs:'',
      editTelFRS:'',
      editDescription:''
    });//++++++++++++++++++++++++++++++++++++++++++

    this.addStockFormsGroup = this.formBulder.group({
      addArticle:[0, Validators.required],
      addStockInit:[0, Validators.required],
      addPrixUnit:[0, Validators.required],
      addDate:[new Date(), Validators.required]
    });

    this.editStockFormsGroup = this.formBulder.group({
      editArticle:[0, Validators.required],
      editStockInit:[0, Validators.required],
      editPrixUnit:[0, Validators.required],
      editDate:[new Date(), Validators.required]
    });



  }

  ngOnInit(): void {

    this.serviceArticle.getAllArticle().subscribe(
      (data) => {
        this.articles = data;
        console.log('All Article ', this.articles);
        this.articlesByExoNotNull = [];
        this.articlesByExoNull = [];
        data.forEach(element => {
          if(element.exo === null){
            this.articlesByExoNull.push(element);
            this.selectedArticle = this.articlesByExoNull[0];
          }
          else{
            this.articlesByExoNotNull.push(element);
          }
        });
        this.dtTrigger1.next();
      },
      (erreur) => {
        console.log('Erreur lors de la récupération de la liste des articles', erreur);
      }
    );

    this.serviceRegisseur.getAllRegisseur().subscribe(
      (data) => {
        data.forEach(element => {
          let exit1:boolean = false;
          let exit2:boolean = false;
          this.serviceCorres.getAllGerer().subscribe(
            (data2) => {
              data2.forEach(element2 => {
                if(element.magasinier.numMAgasinier === element2.magasinier.numMAgasinier && element2.magasin.codeMagasin != null){
                  this.carveauxTresor = element2.magasin;
                  exit1 = true;
                  exit;
                }
              });

            },
            (erreur) => {
              console.log('Erreur lors de la récupération des gérer')
            }
          );

          if(exit1){
            exit;
          }

        });
      },
      (erreur) => {
        console.log('Erreur lors de la récupération des régisseurs', erreur);

      }
    );

  }

  //+++++++++++++++++++++++++++++++++++
  getAllFrs(){
    this.frsService.getAllFrs().subscribe(
      (data) => {
        this.fournisseurs = data;
        $('#dataTable1').dataTable().api().destroy();
        this.dtTrigger1.next();
        /*this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
          this.dtTrigger1.next();
        });*/
      },
      (erreur) => {
        console.log('Erreur lors de la récupération des Frs', erreur);
      }
    );
  }//+++++++++++++++++++++++++++++++++++++++++

  getAllStockInitial(){
    this.serviceArticle.getAllArticle().subscribe(
      (data) => {
        this.articles = data;
        this.articlesByExoNotNull = [];
        $('#dataTable1').dataTable().api().destroy();
        this.dtTrigger1.next();
        this.articlesByExoNull = [];
        data.forEach((element, index) => {
          if(element.exo === null){
            this.articlesByExoNull.push(element);
          }
          else{
            this.articlesByExoNotNull.push(element);

          }

          if(index == data.length-1){
            /*$('#dataTable1').dataTable().api().destroy();
            this.dtTrigger1.next();*/
          }

        });
      },
      (erreur) => {
        console.log('Erreur lors de la récupération de la liste des articles', erreur);
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

  articleSelected1(){
    this.selectedArticle = this.articlesByExoNull[this.addStockFormsGroup.value['addArticle']];
  }

  //+++++++++++++++++++++++++++++
  initInfosFrs(inde:number){
    this.infosFrs = this.fournisseurs[inde];
    this.infoModal.show();
  }

  initEditFrs(inde:number){
    this.editFrs = this.fournisseurs[inde];
    this.warningModal.show();
  }

  initDeleteFrs(inde:number){
    this.suprFrs = this.fournisseurs[inde];
    this.dangerModal.show();
  }//+++++++++++++++++++++++++++++++++++++++++

  initInfosSI(inde:number){
    this.infosSI = this.articlesByExoNotNull[inde];
    this.infoModal.show();
  }

  initEditSI(inde:number){
    this.editSI = this.articlesByExoNotNull[inde];
    this.warningModal.show();
  }

  initDeleteSI(inde:number){
    this.suprSI = this.articlesByExoNotNull[inde];
    this.dangerModal.show();
  }

  //++++++++++++++++++++++++++++++++++++++
  onSubmitAddFrsFormsGroup(){
    const newFrs = new Fournisseur(this.addFrsFormsGroup.value['addCodeFrs'], this.addFrsFormsGroup.value['addIdentiteFrs'], this.addFrsFormsGroup.value['addAdresseFrs'],
    this.addFrsFormsGroup.value['addRaisonSociale'], this.addFrsFormsGroup.value['addNumIfuFrs'], this.addFrsFormsGroup.value['addTelFRS'], this.addFrsFormsGroup.value['addDescription']);
    this.frsService.addAFrs(newFrs).subscribe(
      (data) => {
        this.primaryModal.hide();
        this.getAllFrs();
      },
      (erreur) => {
        console.log('Erreur lors de l\'enrégistrement', erreur);
      }
    );

  }//+++++++++++++++++++++++++++++

  onSubmitAddSIFormsGroup(){

    this.selectedArticle = this.articlesByExoNull[this.addStockFormsGroup.value['addArticle']];

    this.serviceCorres.getAllStocker().subscribe(
      (data) => {
        let exist:boolean = false;
        var concernedStocker:Stocker = null
        data.forEach(element => {
          if(element.magasin.codeMagasin == this.carveauxTresor.codeMagasin
             && element.article.codeArticle == this.selectedArticle.codeArticle){
               concernedStocker = element;
               exist = true;
               exit;
             }
        });

        if(!exist){
          this.serviceCorres.addAStocker(new Stocker(0, 0, 0, 0, this.selectedArticle, this.carveauxTresor)).subscribe(
            (data2) => {
              concernedStocker = data2;
              this.selectedArticle.puStIniTres = this.addStockFormsGroup.value['addPrixUnit'];
              this.selectedArticle.qteStIniTres = this.addStockFormsGroup.value['addStockInit'];
              this.selectedArticle.datStInitArtTres = this.addStockFormsGroup.value['addDate'];
              this.selectedArticle.exo = this.serviceExo.exoSelectionner;
              this.serviceArticle.editArticle(this.selectedArticle.codeArticle, this.selectedArticle).subscribe(
                (data3) => {
                  concernedStocker.quantiterStocker = concernedStocker.quantiterStocker+data3.qteStIniTres;
                  this.serviceCorres.editAStocker(concernedStocker.idStocker.toString(), concernedStocker).subscribe(
                    (data4) => {
                      this.getAllStockInitial();
                      this.primaryModal.hide();
                    },
                    (erreur) => {
                      console.log('Erreur lors de la modification du Stocker pour Ajout', erreur);
                    }
                  );
                },
                (erreur) => {
                  console.log('Erreur lors de la modification du stock de lArticle', erreur);
                }
              );
            },
            (erreur) => {
              console.log('Erreur lors de lAjout du stocker', erreur);
            }
          );
        }
        else{
              this.selectedArticle.puStIniTres = this.addStockFormsGroup.value['addPrixUnit'];
              this.selectedArticle.qteStIniTres = this.addStockFormsGroup.value['addStockInit'];
              this.selectedArticle.datStInitArtTres = this.addStockFormsGroup.value['addDate'];
              this.selectedArticle.exo = this.serviceExo.exoSelectionner;
              this.serviceArticle.editArticle(this.selectedArticle.codeArticle, this.selectedArticle).subscribe(
                (data3) => {
                  concernedStocker.quantiterStocker = concernedStocker.quantiterStocker+data3.qteStIniTres;
                  this.serviceCorres.editAStocker(concernedStocker.idStocker.toString(), concernedStocker).subscribe(
                    (data4) => {
                      this.getAllStockInitial();
                      this.primaryModal.hide();
                    },
                    (erreur) => {
                      console.log('Erreur lors de la modification du Stocker pour Ajout', erreur);
                    }
                  );
                },
                (erreur) => {
                  console.log('Erreur lors de la modification du stock de lArticle', erreur);
                }
              );

        }

      },
      (erreur) => {
        console.log('Erreur lors de la récupération des stockés', erreur);
      }
    );

  }

  onSubmitEditSIFormsGroup(){
    this.serviceCorres.getAllStocker().subscribe(
      (data) => {
        let exist:boolean = false;
        var concernedStocker:Stocker = null
        data.forEach(element => {
          if(element.magasin.codeMagasin == this.carveauxTresor.codeMagasin
             && element.article.codeArticle == this.editSI.codeArticle){
               concernedStocker = element;
               exist = true;
               exit;
             }
        });

        if(exist){

          concernedStocker.quantiterStocker = concernedStocker.quantiterStocker - this.editSI.qteStIniTres + this.editStockFormsGroup.value['editStockInit'];
          this.serviceCorres.editAStocker(concernedStocker.idStocker.toString(), concernedStocker).subscribe(
            (data2) => {
              this.editSI.qteStIniTres = this.editStockFormsGroup.value['editStockInit'];
              this.editSI.puStIniTres = this.editStockFormsGroup.value['editPrixUnit'];
              this.editSI.datStInitArtTres = this.editStockFormsGroup.value['editDate'];
              this.serviceArticle.editArticle(this.editSI.codeArticle, this.editSI).subscribe(
                (data3) => {
                  this.getAllStockInitial();
                  this.warningModal.hide();
                },
                (erreur) => {
                  console.log('Erreur lors de lEdition du SI de lArticle', erreur);
                }
              );

            },
            (erreur) => {
              console.log('Erreur lors de lAjustement du Stock', erreur);
            }
          );
        }
        else {
          console.log('Erreur, Il nY a pas de relation stocké pour ce que vous voulez Editer');
        }

      },
      (erreur) => {
        console.log('Erreur lors de la récupération de la liste des stockés', erreur);
      }
    );

  }

  onConfirmDeleteSI(){
    this.serviceCorres.getAllStocker().subscribe(
      (data) => {
        let exist:boolean = false;
        var concernedStocker:Stocker = null
        data.forEach(element => {
          if(element.magasin.codeMagasin == this.carveauxTresor.codeMagasin
             && element.article.codeArticle == this.suprSI.codeArticle){
               concernedStocker = element;
               exist = true;
               exit;
             }
        });

        if(exist){

          concernedStocker.quantiterStocker = concernedStocker.quantiterStocker - this.suprSI.qteStIniTres;
          this.serviceCorres.editAStocker(concernedStocker.idStocker.toString(), concernedStocker).subscribe(
            (data2) => {
              this.suprSI.qteStIniTres = 0;
              this.suprSI.puStIniTres = 0;
              this.suprSI.datStInitArtTres = null;
              this.suprSI.exo = null;
              this.serviceArticle.editArticle(this.suprSI.codeArticle, this.suprSI).subscribe(
                (data3) => {
                  this.getAllStockInitial();
                  this.dangerModal.hide();
                },
                (erreur) => {
                  console.log('Erreur lors de la suppression du SI de lArticle', erreur);
                }
              );

            },
            (erreur) => {
              console.log('Erreur lors de lAjustement du Stock', erreur);
            }
          );
        }
        else {
          console.log('Erreur, Il nY a pas de relation stocké pour ce que vous voulez supprimer');
        }

      },
      (erreur) => {
        console.log('Erreur lors de la récupération de la liste des stockés', erreur);
      }
    );
  }

  //+++++++++++++++++++++++++++++++++++
  onSubmitEditFrsFormsGroup(){
    const newFrs = new Fournisseur(this.editFrsFormsGroup.value['editCodeFrs'], this.editFrsFormsGroup.value['editIdentiteFrs'], this.editFrsFormsGroup.value['editAdresseFrs'],
    this.editFrsFormsGroup.value['editRaisonSociale'], this.editFrsFormsGroup.value['editNumIfuFrs'], this.editFrsFormsGroup.value['editTelFRS'], this.editFrsFormsGroup.value['editDescription']);
    this.frsService.editAFrs(this.editFrs.codeFrs, newFrs).subscribe(
      (data) => {

        this.warningModal.hide();
        this.getAllFrs();
      },
      (erreur) => {
        console.log('Erreur lors de la modification : ', erreur);
      }
    );

  }//+++++++++++++++++++++++++

  //+++++++++++++++++++++++++
  onConfirmDeleteFrs(){
    this.frsService.deleteAFrs(this.suprFrs.codeFrs).subscribe(
      (data) => {
        this.dangerModal.hide();
        this.getAllFrs();
      },
      (erreur) => {
        console.log('Erreur lors de la suppression : ', erreur);
      }
    );

  }//++++++++++++++++++++++++++++++++++



}
