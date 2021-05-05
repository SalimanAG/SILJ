import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { data } from 'jquery';
import {ModalDirective} from 'ngx-bootstrap/modal';
import { exit } from 'process';
import { Subject } from 'rxjs';
import { Article } from '../../../../models/article.model';
import { PointVente } from '../../../../models/pointVente.model';
import { Exercice } from '../../../../models/exercice.model';
import { Famille } from '../../../../models/famille.model';
//import { Fournisseur } from '../../../../models/fournisseur.model';
import { LignePointVente } from '../../../../models/lignePointVente.model';
import { Uniter } from '../../../../models/uniter.model';
import { ExerciceService } from '../../../../services/administration/exercice.service';
import { ArticleService } from '../../../../services/definition/article.service';
import { RegisseurService } from '../../../../services/definition/regisseur.service';
import { CorrespondantService } from '../../../../services/definition/correspondant.service';
import { Correspondant } from '../../../../models/Correspondant.model';
import { Magasinier } from '../../../../models/magasinier.model';
import { Magasin } from '../../../../models/magasin.model';
import { TypCorres } from '../../../../models/typCorres.model';
import { Gerer } from '../../../../models/gerer.model';
import { Regisseur } from '../../../../models/regisseur.model';
import { Utilisateur } from '../../../../models/utilisateur.model';
import { Service } from '../../../../models/service.model';
import { Stocker } from '../../../../models/stocker.model';
import { PointVenteService } from '../../../../services/saisie/point-vente.service';
import {jsPDF} from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as moment from 'moment';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'app-point-vente',
  templateUrl: './point-vente.component.html',
  styleUrls: ['./point-vente.component.css']
})
export class PointVenteComponent implements OnInit {

  pdfToShow = null;

  //Commune
  @ViewChild('addComModal') public addComModal: ModalDirective;
  @ViewChild('editComModal') public editComModal: ModalDirective;
  @ViewChild('deleteComModal') public deleteComModal: ModalDirective;
  @ViewChild('addArticle1') public addArticle1: ModalDirective;
  @ViewChild('addArticle2') public addArticle2: ModalDirective;
  @ViewChild('annulerPvModal') public annulerPvModal: ModalDirective;

  //
  @ViewChild('viewPdfModal') public viewPdfModal: ModalDirective;

  dtOptions1: DataTables.Settings = {};
  dtOptions2: DataTables.Settings = {};
  dtOptions3: DataTables.Settings = {};
  dtTrigger1: Subject<any> = new Subject<any>();
  dtTrigger2: Subject<any> = new Subject<any>();
  dtTrigger3: Subject<any> = new Subject<any>();

  pointVente:PointVente[] = [];
  addPointVenteFormGroup:FormGroup;
  editPointVenteFormGroup:FormGroup;
  editPointVente:PointVente = new PointVente('', new Date(), false,new Exercice('', '', new Date(), new Date(), '', false),new Correspondant('', false, new Magasinier('', '', ''),
  new TypCorres('', ''), new Utilisateur('', '', '', '', '', false, new Service('', ''))), new Regisseur('',new Magasinier('','',''),
  new Utilisateur('','','','','',false, new Service('',''))) );

  suprPointVente:PointVente = new PointVente('', new Date(), false,new Exercice('', '', new Date(), new Date(), '', false),new Correspondant('', false, new Magasinier('', '', ''),
  new TypCorres('', ''), new Utilisateur('', '', '', '', '', false, new Service('', ''))), new Regisseur('',new Magasinier('','',''),
  new Utilisateur('','','','','',false, new Service('',''))) );

  anulPointVente:PointVente = new PointVente('', new Date(), false,new Exercice('', '', new Date(), new Date(), '', false),new Correspondant('', false, new Magasinier('', '', ''),
  new TypCorres('', ''), new Utilisateur('', '', '', '', '', false, new Service('', ''))), new Regisseur('',new Magasinier('','',''),
  new Utilisateur('','','','','',false, new Service('',''))) );

  tempAddLignePointVente:LignePointVente[] = [];
  tempEditLignePointVente:LignePointVente[] = [];
  tempDeleteLignePointVente:LignePointVente[] = [];

  lignePointVente:LignePointVente[] = [];
  editLignePointVente :LignePointVente = new LignePointVente(0,0,0,0,new PointVente('', new Date(), false,new Exercice('', '', new Date(), new Date(), '', false),new Correspondant('', false, new Magasinier('', '', ''),
  new TypCorres('', ''), new Utilisateur('', '', '', '', '', false, new Service('', ''))), new Regisseur('',new Magasinier('','',''),
  new Utilisateur('','','','','',false, new Service('',''))) ),new Article('', '', false, false, false, false, 0, '', new Famille('', ''), new Uniter('', '')));

  suprLignePointVente :LignePointVente = new LignePointVente(0,0,0,0,new PointVente('', new Date(), false,new Exercice('', '', new Date(), new Date(), '', false),new Correspondant('', false, new Magasinier('', '', ''),
  new TypCorres('', ''), new Utilisateur('', '', '', '', '', false, new Service('', ''))), new Regisseur('',new Magasinier('','',''),
  new Utilisateur('','','','','',false, new Service('',''))) ),new Article('', '', false, false, false, false, 0, '', new Famille('', ''), new Uniter('', '')));


  exercices:Exercice[] = [];
  articles:Article[] = [];
  regisseur:Regisseur[] = [];
  correspondant:Correspondant[] = [];
  magasinier:Magasinier[] = [];
  gererlist : Gerer [] = [];

    gererli : Gerer [] = [];

  articlesOfAConcernedPointVenteAddingPv:Article[] = [];
  articlesOfAConcernedPointVenteEditingPv:Article[] = [];

  concernedPointVente: PointVente = new PointVente('', new Date(), false,new Exercice('', '', new Date(), new Date(), '', false),new Correspondant('', false, new Magasinier('', '', ''),
  new TypCorres('', ''), new Utilisateur('', '', '', '', '', false, new Service('', ''))), new Regisseur('',new Magasinier('','',''),
  new Utilisateur('','','','','',false, new Service('',''))) );


  constructor(private servicePointVente:PointVenteService, private serviceRegisseur:RegisseurService, private serviceExercice:ExerciceService, 
    private serviceArticle:ArticleService, private serviceCorres:CorrespondantService, private formBulder:FormBuilder,
    private sanitizer:DomSanitizer ){ 
      this.initDtOptions();
      this.initFormsGroup();
      moment.locale('fr');
      console.log('+++++', this.serviceExercice.exoSelectionner);
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

   initFormsGroup(){
    this.addPointVenteFormGroup = this.formBulder.group({
      addNumPv:['PV-20000001', Validators.required],
      addDatePv:[new Date().toISOString().substring(0, 10), Validators.required], 
     // addpayPoint:[0, Validators.required],
      addCorres:[0, Validators.required],
      addReg:[0, Validators.required]
    });

    this.editPointVenteFormGroup = this.formBulder.group({
      editNumPv:['', Validators.required],
      editDatePv:[new Date(), Validators.required], 
     // editpayPoint:[0, Validators.required],
      editCorres:[0, Validators.required],
      editReg:[0, Validators.required]
    });
  }

  ngOnInit(): void {

    this.getAllLignePointVente();
    this.getAllExercice();
    this.getAllRegisseur();
    this.getAllCorrespondant();

    this.servicePointVente.getAllPointVente().subscribe(
      (data) => {
        this.pointVente = data;
        this.dtTrigger1.next();
      },
      (erreur) => {
        console.log('Erreur lors de la récupération de la liste des points ventes', erreur);
      }
    );
    //this.getAllArticle();
    this.serviceArticle.getAllArticle().subscribe(
      (data) => {
        this.articles = data;
        this.dtTrigger2.next();
        this.dtTrigger3.next();
      },
      (erreur) => {
        console.log('Erreur lors de la récupération de la liste des articles', erreur);
      }
    );
    this.getAllLignePointVente();

  }

  getAllPointVente(){
    this.servicePointVente.getAllPointVente().subscribe(
      (data) => {
        //data.forEach
        this.pointVente = data;
        //$('#PvDataTable').dataTable().api().destroy();
        //this.dtTrigger1.next();
        //this.dtTrigger1.next();
      },
      (erreur) => {
        console.log('Erreur lors de la récupération de la liste des points ventes', erreur);
      }
    );

  }

  getAllLignePointVente(){
    this.servicePointVente.getAllLignePointVente().subscribe(
      (data) => {
        this.lignePointVente = data;
      },
      (erreur) => {
        console.log('Erreur lors de la récuparation de la liste des lignes de commande', erreur);
      }
    );
  }

  getAllExercice(){
    this.serviceExercice.getAllExo().subscribe(
      (data) => {
        this.exercices = data;
      },
      (erreur) => {
        console.log('Erreur lors de la récupération de la liste des exercices', erreur);
      }
    );
  }

  getAllRegisseur(){
    this.serviceRegisseur.getAllRegisseur().subscribe(
      (data) => {
        this.regisseur = data;
      },
      (erreur) => {
        console.log('Erreur lors de la récupération de la liste des regisseur', erreur);
      }
    );
  }

  getAllCorrespondant(){
    this.serviceCorres.getAllCorres().subscribe(
      (data) => {
        data.forEach(element =>{
          if(element.typecorres.codeTypCorres != "LIV")
          this.correspondant.push(element);
        });
        
      },
      (erreur) => {
        console.log('Erreur lors de la récupération de la liste des correspondants', erreur);
      }
    );
  }

  getAllArticle(){
    this.serviceArticle.getAllArticle().subscribe(
      (data) => {
        this.articles = data;
        $('#tabListArt1').dataTable().api().destroy();
        this.dtTrigger2.next();
        $('#tabListArt2').dataTable().api().destroy();
        this.dtTrigger3.next();
      }, 
      (erreur) => {
        console.log('Erreur lors de la récupération de la liste des articles', erreur);
      }
    );
  }

  

  popArticleAddingOfPointVente(inde:number){
    this.tempAddLignePointVente.splice(inde, 1);
  }

  popArticleEditingOfPointVente(inde:number){
    this.tempEditLignePointVente.splice(inde, 1);
  }

  initDeletePointVente(inde:number){
    this.suprPointVente = this.pointVente[inde];
    this.deleteComModal.show();
  }

  initAnnulerPointVente(inde:number){

    this.anulPointVente = this.pointVente[inde];
    this.annulerPvModal.show();
  }
  

  initAddPointVente(){
    //this.onConcernedCommandSelected();
    this.addComModal.show()
  }

  onShowAddArticleModalAddingPointVente(){
   
      this.addArticle1.show();
      this.getAllArticle();
  
  }

  onShowAddArticleModalEditingPointVente(){
    this.addArticle2.show();
    this.getAllArticle();
  
  }

  addArticleForAddingOfPointVente(inde:number){
    let exist:boolean = false;
    this.tempAddLignePointVente.forEach(element => {
      if(element.article.codeArticle==this.articles[inde].codeArticle){
        exist = true;
        exit;
      }
    });

    if(exist===false){
      this.tempAddLignePointVente.push(new LignePointVente(0, this.articles[inde].prixVenteArticle, 0, 0,
         new PointVente('', new Date(), false,new Exercice('', '', new Date(), new Date(), '', false),new Correspondant('', false, new Magasinier('', '', ''),
        new TypCorres('', ''), new Utilisateur('', '', '', '', '', false, new Service('', ''))), new Regisseur('',new Magasinier('','',''),
        new Utilisateur('','','','','',false, new Service('',''))) ),
        this.articles[inde]));
    }


  }

  addArticleForEditingOfPointVente(inde:number){
    let exist:boolean = false;
    this.tempEditLignePointVente.forEach(element => {
      if(element.article.codeArticle==this.articles[inde].codeArticle){
        exist = true;
        exit;
      }
    });
  
    if(exist===false){
      this.tempEditLignePointVente.push(new LignePointVente(0, this.articles[inde].prixVenteArticle, 0,0,
      new PointVente('', new Date(), false,new Exercice('', '', new Date(), new Date(), '', false),new Correspondant('', false, new Magasinier('', '', ''),
  new TypCorres('', ''), new Utilisateur('', '', '', '', '', false, new Service('', ''))), new Regisseur('',new Magasinier('','',''),
  new Utilisateur('','','','','',false, new Service('',''))) ),
        this.articles[inde]));
    }
  
  }

  onSubmitAddPointVenteFormsGroup(){
    var concernedStocker:Stocker = null
    var magasinStock:Gerer = null ;
    

    const newPointVente= new PointVente(this.addPointVenteFormGroup.value['addNumPv'],
    this.addPointVenteFormGroup.value['addDatePv'],false,
    this.serviceExercice.exoSelectionner, this.correspondant[this.addPointVenteFormGroup.value['addCorres']],
    this.regisseur[this.addPointVenteFormGroup.value['addReg']]);
    newPointVente.validePoint = true;
    console.log(this.tempAddLignePointVente, newPointVente);
    this.servicePointVente.addPointVente(newPointVente).subscribe(
      (data) => {
        console.log('********',data);
        
        this.tempAddLignePointVente.forEach(element => {
          element.pointVente = data;
          this.servicePointVente.addLignePointVente(element).subscribe(
            (data2) => {
              console.log('********',data2);
              

            },
            (erreur) => {
              console.log('Erreur lors de la création de la ligne de point vente',erreur );
            }
          );

           //Début reajustement de stock au sein du magasin du correspondant
              this.serviceCorres.getAllGerer().subscribe(
                (datagererlist) => {
                  datagererlist.forEach(gererl =>{
                    if(gererl.magasinier.numMAgasinier == this.correspondant[this.addPointVenteFormGroup.value['addCorres']].magasinier.numMAgasinier )
                    {
                       //this.gererli.push(gererl);
                       magasinStock = gererl;
                       exit;
                    }
    
                  });

                  //coding
                  this.serviceCorres.getAllStocker().subscribe(
                    (data) => {
                      let exist1:boolean = false;
                      console.log('********',data);
                      data.forEach(quant =>{
                        if(element.article.codeArticle == quant.article.codeArticle && magasinStock.magasin.codeMagasin == quant.magasin.codeMagasin)
                        {
                          concernedStocker = quant;
                          exist1 = true;
                          
                         
        
                        }
                        if(exist1){
                           //concernedStocker.quantiterStocker = element;
                           concernedStocker.quantiterStocker = concernedStocker.quantiterStocker+(- element.quantiteLignePointVente);
                           this.serviceCorres.editAStocker(concernedStocker.idStocker.toString(), concernedStocker).subscribe(
                             (dataStock) => {
                               console.log("QA",dataStock); 
                               
                             },
                             (erreur) => {
                               console.log('Erreur lors de la modification du Stocker pour réajustement du stock', erreur);
                             }
                           );
                        }
                        else{
                          this.serviceCorres.addAStocker(new Stocker(element.quantiteLignePointVente*(-1), 0, 0, 0, element.article,magasinStock.magasin)).subscribe(
                            (data4) => {
            
                            },
                            (erreur) => {
                              console.log('Erreur lors de lAjout dUn Stocker', erreur);
                            }
                          );
                        }
        
                      }); 
                  
                },
                (erreur) => {
                  console.log('Erreur lors de la liste gerer', erreur);
                }
    
              );

            },
            (erreur) => {
              console.log('Erreur lors de la liste gerer', erreur);
            }

          );
              //Fin réajustement de stock
        });
        this.addPointVenteFormGroup.reset();
        this.initFormsGroup();
        this.addComModal.hide();
        this.getAllPointVente();
        this.getAllLignePointVente();
      },
      (erreur) => {
        console.log('Erreur lors de la création de point vente', erreur);
      }
    );




  }

  onSubmitEditPointVenteFormsGroup(){
    const newPv= new PointVente(this.editPointVenteFormGroup.value['editNumPv'],
    this.editPointVenteFormGroup.value['editDatePv'],false,
    this.serviceExercice.exoSelectionner,  this.correspondant[this.editPointVenteFormGroup.value['editCorres']],
    this.regisseur[this.editPointVenteFormGroup.value['editReg']]);
  
    let oldPointVenteLines:LignePointVente[] = [];
  
    this.lignePointVente.forEach(element => {
      if(element.pointVente.numPointVente==this.editPointVente.numPointVente){
        oldPointVenteLines.push(element);
      }
    });
  
  
    this.servicePointVente.editPointVente(this.editPointVente.numPointVente, newPv).subscribe(
      (data) => {
  
        //Pour ajout et ou modification des lignes
        this.tempEditLignePointVente.forEach(element => {
          let added:boolean = true;
          oldPointVenteLines.forEach(element2 => {
            if(element.article.codeArticle==element2.article.codeArticle){
              added = false;
              element.pointVente = data;
  
              this.servicePointVente.editLignePointVente(element2.idLignePointVente.toString(), element).subscribe(
                (data2) => {
  
                },
                (erreur) => {
                  console.log('Erreur lors de la modification de ligne de reversement', erreur);
                }
              );
              exit;
            }
          });
  
          if(added===true){
            element.pointVente = data;
            this.servicePointVente.addLignePointVente(element).subscribe(
              (data3) => {
  
              },
              (erreur) => {
                console.log('Erreur lors de la création dUne nouvelle ligne pour lEdition', erreur)
              }
            );
          }
  
        });
  
  
        //Pour suppression des lignes suprimés
        oldPointVenteLines.forEach(element => {
          let deleted:boolean = true;
          this.tempEditLignePointVente.forEach(element2 => {
  
            if(element.article.codeArticle==element2.article.codeArticle){
              deleted = false;
              exit;
            }
  
          });
  
          if(deleted===true){
            this.servicePointVente.deleteLignePointVente(element.idLignePointVente.toString()).subscribe(
              (data) => {
  
              },
              (erreur) => {
                console.log('Erreur lors de la suppression de la ligne', erreur);
              }
            );
          }
  
        });
  
        this.editComModal.hide();
  
        this.getAllPointVente();
        this.getAllLignePointVente();
  
      },
      (erreur) => {
        console.log('Erreur lors de lEdition du point vente', erreur);
      }
    );
  
  
  
  }
  

  initEditPointVente(inde:number){
    this.tempEditLignePointVente=[];
    this.editPointVente = this.pointVente[inde];
    console.log(this.editPointVente);
    
    this.servicePointVente.getAllLignePointVente().subscribe(
      (data) => {
        this.lignePointVente = data;
        console.log(this.lignePointVente);
        this.lignePointVente.forEach(element => {
          if(element.pointVente.numPointVente==this.editPointVente.numPointVente){
            this.tempEditLignePointVente.push(element);
          }
        });
        this.editComModal.show();
      },
      (erreur) => {
        console.log('Erreur lors de la récuparation de la liste des lignes de point vente', erreur);
      }
    );

  }

  onConfirmDeletePointVente(){
    
    this.getAllLignePointVente();
    let faled:boolean=false;
    this.lignePointVente.forEach(element => {
      if(element.pointVente.numPointVente==this.suprPointVente.numPointVente){
        this.servicePointVente.deleteLignePointVente(element.idLignePointVente.toString()).subscribe(
          (data) => {
            this.servicePointVente.deletePointVente(this.suprPointVente.numPointVente).subscribe(
              (data) => {
                this.deleteComModal.hide();
                this.getAllPointVente();
                this.getAllLignePointVente();
              },
              (erreur) => {
                console.log('Erreur lors de la suppression de point de vente', erreur);
              }
            );
          },
          (erreur) => {
            console.log('Erreur lors de la suppression dUne ligne de point de vente', erreur);
            //faled=true;
          }
        );
      }
    });
  
    if(faled==false){
      this.servicePointVente.deletePointVente(this.suprPointVente.numPointVente).subscribe(
        (data) => {
          this.deleteComModal.hide();
          this.getAllPointVente();
          this.getAllLignePointVente();
        },
        (erreur) => {
          console.log('Erreur lors de la suppression dU point de vente', erreur);
        }
      );
    }
    

  }

  onConfirmAnnulerPointVente(){

    this.serviceCorres.getAllGerer().subscribe(
      (data) => {
        let finded:boolean = false;
        let concernedMagOfCorresp:Magasin = null;
        data.forEach(element => {
          if(element.magasinier.numMAgasinier == this.anulPointVente.correspondant.magasinier.numMAgasinier){
            concernedMagOfCorresp = element.magasin;
            finded = true;
            exit;
          }
        });

        if(finded){

          const pv = new PointVente(this.anulPointVente.numPointVente, this.anulPointVente.datePointVente,false,
            this.anulPointVente.exercice, this.anulPointVente.correspondant, this.anulPointVente.regisseur);
          pv.validePoint = false;
          //console.log('Element modifier',pla);
          this.servicePointVente.editPointVente(this.anulPointVente.numPointVente, pv).subscribe(
            (data2) => {

              this.servicePointVente.getAllLignePointVente().subscribe(
                (data3) => {

                  data3.forEach(element3 => {
                    if(element3.pointVente.numPointVente == data2.numPointVente){
                      this.serviceCorres.getAllStocker().subscribe(
                        (data4) => {
                          let exist1:boolean = false;
                          let exist2:boolean = false;
                         // let concernedStockerCarvMairie:Stocker = null;
                          let concernedStockerMagCorres:Stocker = null;
                          data4.forEach(element4 => {
                            /*if(element4.magasin.codeMagasin == this.carveauxMairie.codeMagasin && element4.article.codeArticle == element3.article.codeArticle){
                              concernedStockerCarvMairie = element4;
                              exist1 = true;
                              exit;
                            }*/
                            if(element4.magasin.codeMagasin == concernedMagOfCorresp.codeMagasin && element4.article.codeArticle == element3.article.codeArticle){
                              concernedStockerMagCorres = element4;
                              exist2 = true;
                              exit;
                            }

                          });

                          
                          if(exist2){
                            concernedStockerMagCorres.quantiterStocker+=element3.quantiteLignePointVente;
                            this.serviceCorres.editAStocker(concernedStockerMagCorres.idStocker.toString(), concernedStockerMagCorres).subscribe(
                              (data5) => {

                              },
                              (erreur) => {
                                console.log('Erreur lors de lEdition dUn stock', erreur);
                              }
                            );
                          }
                          else{
                            this.serviceCorres.addAStocker(new Stocker(element3.quantiteLignePointVente, 0, 0, 0, element3.article, concernedMagOfCorresp)).subscribe(
                              (data5) => {

                              },
                              (erreur) => {
                                console.log('Erreur lors de lAjout dUn Stocker', erreur);
                              }
                            );
                          }

                        },
                        (erreur) => {
                          console.log('Erreur lors de la récupération des stockers', erreur);
                        }
                      );
                    }
                  });
                },
                (erreur) => {
                  console.log('Erreur lors de la récupération de la liste des lignes de placement', erreur);
                }
              );

              this.annulerPvModal.hide();
              this.getAllPointVente();

            },
            (erreur) => {
              console.log('Erreur lors de la modification du point de vente', erreur);
            }
          );
        }
        else{
          console.log('Erreur !! Aucun magasin trouvé pour le correspondant concerné');
        }

      },
      (erreur) => {
        console.log('Erreur lors de la récupération de la liste des gérers', erreur);
      }
    );

  }

  initPrintPdfOfAnCommande(inde:number){
    const commande = this.pointVente[inde];
    const doc = new jsPDF();
    let lignes = [];
    let totalHT, totalTTC, totalRemise, totalTVA;
    totalHT = 0;
    totalRemise = 0;
    totalTVA = 0;
    totalTTC = 0;
    this.lignePointVente.forEach(element => {
      if(element.pointVente.numPointVente == commande.numPointVente){
        let lig = [];
        lig.push(element.article.codeArticle);
        lig.push(element.article.libArticle);
        lig.push(element.quantiteLignePointVente);
        lig.push(element.numDebLignePointVente+' à '+element.numFinLignePointVente);
        lig.push(element.pulignePointVente);
        
        lig.push(element.pulignePointVente*element.quantiteLignePointVente);
        lignes.push(lig);

        totalHT += element.pulignePointVente*element.quantiteLignePointVente;
      

      }

    });
    doc.setDrawColor(0);
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(50, 20, 110, 15, 3, 3, 'FD');
    //doc.setFont("Times New Roman");
    
    doc.setFontSize(25);
    doc.text('POINT DE VENTE', 62, 30);
    doc.setFontSize(14);
    doc.text('Référence : '+commande.numPointVente, 15, 45);
    doc.text('Date : '+moment(commande.datePointVente).format('DD/MM/YYYY'), 145, 45);
    doc.text('Correspondant : '+commande.correspondant.magasinier.nomMagasinier+ ' '+
    commande.correspondant.magasinier.prenomMagasinier, 15, 55);
    doc.text('Régisseur : '+commande.regisseur.magasinier.nomMagasinier+' '+
    commande.regisseur.magasinier.prenomMagasinier, 15, 65);
    if(commande.payerPoint==false){doc.text('Statut du paiement : '+'NON PAYER', 15, 75)}
    if(commande.payerPoint==true){doc.text('Statut du paiement : '+' PAYER', 15, 75)}
    //doc.text('Payer point : '+commande.payerPoint, 15, 75);
    autoTable(doc, {
      theme: 'grid',
      head: [['Article', 'Désignation', 'Quantité', 'Numéro de série', 'PU', 'Montant']],
      headStyles: {
         fillColor: [41, 128, 185],
          textColor: 255, 
          fontStyle: 'bold' ,
      },
      margin: { top: 100 },
      
      body: lignes
      ,
    });

    autoTable(doc, {
      theme: 'grid',
      margin: { top: 100, left:130 },
      columnStyles: {
        0: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold' },
      },
      body: [
        ['Montant Total', totalHT]
      ]
    
    });
    doc.text('Powered by Guichet Unique', 130, 230);
    //doc.autoPrint();
    //doc.output('dataurlnewwindow');

    

  

    this.pdfToShow = this.sanitizer.bypassSecurityTrustResourceUrl(doc.output('datauristring', {filename:'pointVente.pdf'}));
    this.viewPdfModal.show();
  }


}
