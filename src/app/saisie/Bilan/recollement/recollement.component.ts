import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { data } from 'jquery';
import {ModalDirective} from 'ngx-bootstrap/modal';
import { exit } from 'process';
import { Subject } from 'rxjs';
import { Article } from '../../../../models/article.model';
import { Recollement } from '../../../../models/recollement.model';
import { Exercice } from '../../../../models/exercice.model';
import { Famille } from '../../../../models/famille.model';
//import { Fournisseur } from '../../../../models/fournisseur.model';
import { LigneRecollement } from '../../../../models/ligneRecollement.model';
import { Uniter } from '../../../../models/uniter.model';
import { ExerciceService } from '../../../../services/administration/exercice.service';
import { ArticleService } from '../../../../services/definition/article.service';
import { RegisseurService } from '../../../../services/definition/regisseur.service';
import { CorrespondantService } from '../../../../services/definition/correspondant.service';
import { Correspondant } from '../../../../models/Correspondant.model';
import { Magasinier } from '../../../../models/magasinier.model';
import { TypCorres } from '../../../../models/typCorres.model';
import { Regisseur } from '../../../../models/regisseur.model';
import { Utilisateur } from '../../../../models/utilisateur.model';
import { Service } from '../../../../models/service.model';
import { RecollementService } from '../../../../services/saisie/recollement.service';
import { Magasin } from '../../../../models/magasin.model';
import { Stocker } from '../../../../models/stocker.model';

import {jsPDF} from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as moment from 'moment';
import { DomSanitizer } from '@angular/platform-browser';
import { element } from 'protractor';

@Component({
  selector: 'app-recollement',
  templateUrl: './recollement.component.html',
  styleUrls: ['./recollement.component.css']
})
export class RecollementComponent implements OnInit {

  pdfToShow = null;

  //Commune
  @ViewChild('addComModal') public addComModal: ModalDirective;
  @ViewChild('editComModal') public editComModal: ModalDirective;
  @ViewChild('deleteComModal') public deleteComModal: ModalDirective;
  @ViewChild('addArticle1') public addArticle1: ModalDirective;
  @ViewChild('addArticle2') public addArticle2: ModalDirective;
  @ViewChild('annulerRecollementModal') public annulerRecollementModal: ModalDirective;

  //
  @ViewChild('viewPdfModal') public viewPdfModal: ModalDirective;

  dtOptions1: DataTables.Settings = {};
  dtOptions2: DataTables.Settings = {};
  dtOptions3: DataTables.Settings = {};
  dtTrigger1: Subject<any> = new Subject<any>();
  dtTrigger2: Subject<any> = new Subject<any>();
  dtTrigger3: Subject<any> = new Subject<any>();

  recollement:Recollement[] = [];
  addRecollementFormGroup:FormGroup;
  editRecollementFormGroup:FormGroup;
  editRecollement:Recollement = new Recollement('','',new Date(), new Magasin('',''),new Magasin('',''), new Exercice('', '', new Date(), new Date(), '', false));
  annulRecollement:Recollement = new Recollement('','',new Date(), new Magasin('',''),new Magasin('',''), new Exercice('', '', new Date(), new Date(), '', false));

  suprRecollement:Recollement = new Recollement('','',new Date(), new Magasin('',''), new Magasin('',''), new Exercice('', '', new Date(), new Date(), '', false));

  //
  concernedRegisse:Regisseur = new Regisseur('',new Magasinier('','',''),
  new Utilisateur('','','','','',false, new Service('','')));

  tempAddLigneRecollement:LigneRecollement[] = [];
  tempEditLigneRecollement:LigneRecollement[] = [];
  tempDeleteLigneRecollement:LigneRecollement[] = [];

  ligneRecollement:LigneRecollement[] = [];
  editLigneRecollement :LigneRecollement = new LigneRecollement(0,0,'',new Recollement('','',new Date(), new Magasin('',''), new Magasin('',''), new Exercice('', '', new Date(), new Date(), '', false)),
  new Article('', '', false, false, false, false, 0, '', new Famille('', ''), new Uniter('', '')));

  suprLigneRecollement :LigneRecollement = new LigneRecollement(0,0,'',new Recollement('','',new Date(), new Magasin('',''), new Magasin('',''), new Exercice('', '', new Date(), new Date(), '', false)),
  new Article('', '', false, false, false, false, 0, '', new Famille('', ''), new Uniter('', '')));

  exercices:Exercice[] = [];
  articles:Article[] = [];
  regisseur:Regisseur[] = [];
  correspondant:Correspondant[] = [];
  magasinier:Magasinier[] = [];
  magasin:Magasin[] = [];
  coresp: Correspondant[] = [];
  magasinMairieTresor: Magasin[] = [];

  articlesOfAConcernedRecollementAddingRecoll:Article[] = [];
  articlesOfAConcernedRecollementEditingRecoll:Article[] = [];

  constructor(private serviceRecollement:RecollementService, private serviceRegisseur:RegisseurService, private serviceExercice:ExerciceService, 
    private serviceArticle:ArticleService, private serviceCorrespodant:CorrespondantService, private formBulder:FormBuilder,
    private sanitizer:DomSanitizer) { 
    this.initDtOptions();
    this.initFormsGroup();
    moment.locale('fr');
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
    this.addRecollementFormGroup = this.formBulder.group({
      addNumRecoll:['RL-200000005', Validators.required],
      addDateRecoll:[new Date().toISOString().substring(0, 10), Validators.required], 
      addDesRecoll:'', 
      addMagasinSource:[0, Validators.required],
      addMagasinDestination:[0, Validators.required]
    });

    this.editRecollementFormGroup = this.formBulder.group({
      editNumRecoll:['', Validators.required],
      editDateRecoll:[new Date(), Validators.required], 
      editDesRecoll:'', 
      editMagasinSource:[0, Validators.required],
      editMagasinDestination:[0, Validators.required]
    });
  }

  ngOnInit(): void {

    this.getAllExercice();
    this.getAllRegisseur();
    this.getAllMagasin();
    this.getAllLigneRecollement();

    //
    this.serviceRegisseur.getAllRegisseur().subscribe(
      (data) => {
        this.regisseur = data;
        this.regisseur.forEach(element => {
         // console.log(element, this.serviceUtilisateur.connectedUser);
         // if(this.serviceUtilisateur.connectedUser.idUtilisateur === element.utilisateur.idUtilisateur){
            
          //}
          this.concernedRegisse = element;
            exit;
        });

      },
      (erreur) => {
        console.log('Erreur lors de la récupération de la liste des régisseurs', erreur);
      }
    );

    this.serviceCorrespodant.getAllCorres().subscribe(
      (data) => {
        this.coresp = data;  

      },
      (erreur) => {
        console.log('Erreur lors de la récupération de la liste des correspondants', erreur);
      }
    );

    //Get CM and Carveau Mairie and Caveau Trésor
    this.serviceCorrespodant.getAllMagasin().subscribe(
      (data) => {
        data.forEach(element =>{
          if(element.codeMagasin == 'CM' || element.codeMagasin == 'CT'){

            this.magasinMairieTresor.push(element);

          }

        });

      },
      (erreur) => {
        console.log('Erreur lors de la récupération de la liste des magasin', erreur);
      }
    );

    this.serviceRecollement.getAllRecollement().subscribe(
      (data) => {
        this.recollement = data;
        this.dtTrigger1.next();
      },
      (erreur) => {
        console.log('Erreur lors de la récupération de la liste des recollements', erreur);
      }
    );

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

   
  }


  // Recuperation du magasin destinataire en fonction du magasin source
  getMagasinDest(){
    
    if(this.magasin[this.addRecollementFormGroup.value['addMagasinSource']].codeMagasin == 'CM'){
      this.magasinMairieTresor = [];
      this.serviceCorrespodant.getAMagasinById('CT').subscribe(
        (data) => {
          this.magasinMairieTresor.push(data);
        },
        (erreur) => {
          console.log('Erreur lors de la récupération de la liste des magasins', erreur);
        }
  
      );
    }
    else
    {
      this.magasinMairieTresor = [];
      this.serviceCorrespodant.getAMagasinById('CM').subscribe(
        (data) => {
          this.magasinMairieTresor.push(data);
        },
        (erreur) => {
          console.log('Erreur lors de la récupération de la liste des magasins', erreur);
        }
  
      );
    }
   
    
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

  getAllMagasin(){
    this.serviceCorrespodant.getAllMagasin().subscribe(
      (data) => {
        data.forEach( magaRecoll =>{
          if(magaRecoll.codeMagasin != 'CT'){
            this.magasin.push(magaRecoll);
          }

        });

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

  getAllRecollement(){
    this.serviceRecollement.getAllRecollement().subscribe(
      (data) => {
        this.recollement = data;
        //$('#RecollDataTable').dataTable().api().destroy();
        //this.dtTrigger1.next();
        //this.dtTrigger1.next();
      },
      (erreur) => {
        console.log('Erreur lors de la récupération de la liste des recollement', erreur);
      }
    );

  }

  getAllLigneRecollement(){
    this.serviceRecollement.getAllLigneRecollement().subscribe(
      (data) => {
        this.ligneRecollement = data;
        //this.dtTrigger1.next();
      },
      (erreur) => {
        console.log('Erreur lors de la récupération de la liste des ligne recollement', erreur);
      }
    );

  }


  initAddRecollement(){
    //this.onConcernedCommandSelected();
    this.addComModal.show()
  }

  initDeleteRecollement(inde:number){
    this.suprRecollement = this.recollement[inde];
    this.deleteComModal.show();
  }

  initAnnulerRecollement(inde:number){

    this.annulRecollement = this.recollement[inde];
    this.annulerRecollementModal.show();
  }

  onShowAddArticleModalAddingRecollement(){
   
    this.addArticle1.show();
    this.getAllArticle();

}

onShowAddArticleModalEditingRecollement(){
  this.addArticle2.show();
  this.getAllArticle();

}

popArticleAddingOfRecollement(inde:number){
  this.tempAddLigneRecollement.splice(inde, 1);
}

popArticleEditingOfRecollement(inde:number){
  this.tempEditLigneRecollement.splice(inde, 1);
}

addArticleForAddingOfRecollement(inde:number){
  let exist:boolean = false;
  this.tempAddLigneRecollement.forEach(element => {
    if(element.article.codeArticle==this.articles[inde].codeArticle){
      exist = true;
      exit;
    }
  });

  if(exist===false){
    this.tempAddLigneRecollement.push(new LigneRecollement(0, this.articles[inde].prixVenteArticle, '',
      new Recollement('','',new Date(), new Magasin('',''), new Magasin('','') , new Exercice('', '', new Date(), new Date(), '', false)),
      this.articles[inde]));
  }


}

addArticleForEditingOfRecollement(inde:number){
  let exist:boolean = false;
  this.tempEditLigneRecollement.forEach(element => {
    if(element.article.codeArticle==this.articles[inde].codeArticle){
      exist = true;
      exit;
    }
  });

  if(exist===false){
    this.tempEditLigneRecollement.push(new LigneRecollement(0, this.articles[inde].prixVenteArticle, '',
    new Recollement('','',new Date(), new Magasin('',''), new Magasin('',''), new Exercice('', '', new Date(), new Date(), '', false)),
      this.articles[inde]));
  }

}

onSubmitAddRecollementFormsGroup(){

  const newRecoll= new Recollement(this.addRecollementFormGroup.value['addNumRecoll'],
  this.addRecollementFormGroup.value['addDesRecoll'],this.addRecollementFormGroup.value['addDateRecoll'],
  this.magasin[this.addRecollementFormGroup.value['addMagasinSource']],
  this.magasinMairieTresor[this.addRecollementFormGroup.value['addMagasinDestination']],this.serviceExercice.exoSelectionner);
  
  this.serviceRecollement.addRecollement(newRecoll).subscribe(
    (data) => {
      console.log('********',data);
      
      this.tempAddLigneRecollement.forEach(element => {
        element.recollement = data;
        this.serviceRecollement.addLigneRecollement(element).subscribe(
          (data2) => {
            console.log('********',data2);

          },
          (erreur) => {
            console.log('Erreur lors de la création de la ligne de recollement',erreur );
          }
        );

        //Modification du stock à l'issue du recollement au sein des deux magasins

        this.serviceCorrespodant.getAllStocker().subscribe(
          (data3) => {
            let exist1:boolean = false;
            let exist2:boolean = false;
            let concernedStockerMagasinSource:Stocker = null; // magasin source
            let concernedStockerMagasinDestinataire:Stocker = null; //magasin destinataire
            data3.forEach(element3 => {
              if(element3.magasin.codeMagasin == this.magasin[this.addRecollementFormGroup.value['addMagasinSource']].codeMagasin && element3.article.codeArticle == element.article.codeArticle){
                concernedStockerMagasinSource = element3;
                exist1 = true;
                exit;
              }
              if(element3.magasin.codeMagasin == this.magasinMairieTresor[this.addRecollementFormGroup.value['addMagasinDestination']].codeMagasin && element3.article.codeArticle == element.article.codeArticle){
                concernedStockerMagasinDestinataire = element3;
                exist2 = true;
                exit;
              }

            });

            if(exist1){
              concernedStockerMagasinSource.quantiterStocker-=element.quantiteLigneRecollement;
              this.serviceCorrespodant.editAStocker(concernedStockerMagasinSource.idStocker.toString(), concernedStockerMagasinSource).subscribe(
                (data4) => {

                },
                (erreur) => {
                  console.log('Erreur lors de lEdition dUn stock', erreur);
                }
              );
            }
            else{
              this.serviceCorrespodant.addAStocker(new Stocker(element.quantiteLigneRecollement*(-1), 0, 0, 0, element.article, this.magasin[this.addRecollementFormGroup.value['addMagasinSource']])).subscribe(
                (data4) => {

                },
                (erreur) => {
                  console.log('Erreur lors de lAjout dUn Stocker', erreur);
                }
              );
            }

            if(exist2){
              concernedStockerMagasinDestinataire.quantiterStocker+=element.quantiteLigneRecollement;
              this.serviceCorrespodant.editAStocker(concernedStockerMagasinDestinataire.idStocker.toString(), concernedStockerMagasinDestinataire).subscribe(
                (data4) => {

                },
                (erreur) => {
                  console.log('Erreur lors de lEdition dUn stock', erreur);
                }
              );
            }
            else{
              this.serviceCorrespodant.addAStocker(new Stocker(element.quantiteLigneRecollement, 0, 0, 0, element.article, this.magasinMairieTresor[this.addRecollementFormGroup.value['addMagasinDestination']])).subscribe(
                (data4) => {

                },
                (erreur) => {
                  console.log('Erreur lors de lAjout dUn Stocker', erreur);
                }
              );
            }

          },
          (erreur) => {
            console.log('Erreur lors de la récupération de la liste des stockés', erreur);
          }
        );
        //
      });
      this.addRecollementFormGroup.reset();
      this.initFormsGroup();
      this.addComModal.hide();
      this.getAllRecollement();
      this.getAllLigneRecollement();
    },
    (erreur) => {
      console.log('Erreur lors de la création de recollement', erreur);
    }
  );

}

onSubmitEditRecollementFormsGroup(){
  const newRecoll= new Recollement(this.editRecollementFormGroup.value['editNumRecoll'],
  this.editRecollementFormGroup.value['editDesRecoll'], this.editRecollementFormGroup.value['editDateRecoll'],
   this.magasin[this.editRecollementFormGroup.value['editMagasinSource']],
  this.magasinMairieTresor[this.editRecollementFormGroup.value['editMagasinDestination']],this.serviceExercice.exoSelectionner);

  let oldRecollementLines:LigneRecollement[] = [];

  this.ligneRecollement.forEach(element => {
    if(element.recollement.numRecollement==this.editRecollement.numRecollement){
      oldRecollementLines.push(element);
    }
  });


  this.serviceRecollement.editRecollement(this.editRecollement.numRecollement, newRecoll).subscribe(
    (data) => {

      //Pour ajout et ou modification des lignes
      this.tempEditLigneRecollement.forEach(element => {
        let added:boolean = true;
        oldRecollementLines.forEach(element2 => {
          if(element.article.codeArticle==element2.article.codeArticle){
            added = false;
            element.recollement = data;

            this.serviceRecollement.editLigneRecollement(element2.idLigneRecollement.toString(), element).subscribe(
              (data2) => {

              },
              (erreur) => {
                console.log('Erreur lors de la modification de ligne de recollement', erreur);
              }
            );
            exit;
          }
        });

        if(added===true){
          element.recollement = data;
          this.serviceRecollement.addLigneRecollement(element).subscribe(
            (data3) => {

            },
            (erreur) => {
              console.log('Erreur lors de la création dUne nouvelle ligne pour lEdition', erreur)
            }
          );
        }

      });


      //Pour suppression des lignes suprimés
      oldRecollementLines.forEach(element => {
        let deleted:boolean = true;
        this.tempEditLigneRecollement.forEach(element2 => {

          if(element.article.codeArticle==element2.article.codeArticle){
            deleted = false;
            exit;
          }

        });

        if(deleted===true){
          this.serviceRecollement.deleteLigneRecollement(element.idLigneRecollement.toString()).subscribe(
            (data) => {

            },
            (erreur) => {
              console.log('Erreur lors de la suppression de la ligne', erreur);
            }
          );
        }

      });

      this.editComModal.hide();

      this.getAllRecollement();
      this.getAllLigneRecollement();

    },
    (erreur) => {
      console.log('Erreur lors de lEdition de recollement', erreur);
    }
  );



}

initEditRecollement(inde:number){
  this.tempEditLigneRecollement=[];
  this.editRecollement = this.recollement[inde];
  console.log(this.editRecollement);
  
  this.serviceRecollement.getAllLigneRecollement().subscribe(
    (data) => {
      this.ligneRecollement = data;
      console.log(this.ligneRecollement);
      this.ligneRecollement.forEach(element => {
        if(element.recollement.numRecollement==this.editRecollement.numRecollement){
          this.tempEditLigneRecollement.push(element);
        }
      });
      this.editComModal.show();
    },
    (erreur) => {
      console.log('Erreur lors de la récuparation de la liste des lignes de recollement', erreur);
    }
  );

}

onConfirmDeleteRecollement(){
  this.getAllLigneRecollement();
  let faled:boolean=false;
  this.ligneRecollement.forEach(element => {
    if(element.recollement.numRecollement==this.suprRecollement.numRecollement){
      this.serviceRecollement.deleteLigneRecollement(element.idLigneRecollement.toString()).subscribe(
        (data) => {
          this.serviceRecollement.deleteRecollement(this.suprRecollement.numRecollement).subscribe(
            (data) => {
              this.deleteComModal.hide();
              this.getAllRecollement();
              this.getAllLigneRecollement();
            },
            (erreur) => {
              console.log('Erreur lors de la suppression de recollement', erreur);
            }
          );
        },
        (erreur) => {
          console.log('Erreur lors de la suppression dUne ligne de recollement', erreur);
          //faled=true;
        }
      );
    }
  });

  if(faled==false){
    this.serviceRecollement.deleteRecollement(this.suprRecollement.numRecollement).subscribe(
      (data) => {
        this.deleteComModal.hide();
        this.getAllRecollement();
        this.getAllLigneRecollement();
      },
      (erreur) => {
        console.log('Erreur lors de la suppression de la recollement', erreur);
      }
    );
  }

}

onConfirmAnnulerRecollement(){

        const Recoll = new Recollement(this.annulRecollement.numRecollement, this.annulRecollement.descriptionRecollement,
          this.annulRecollement.dateRecollement, this.annulRecollement.magasinSource, this.annulRecollement.magasinDestination, this.annulRecollement.exercice);
          Recoll.valideRecol = false;
        //console.log('Element modifier',pla);
        this.serviceRecollement.editRecollement(this.annulRecollement.numRecollement, Recoll).subscribe(
          (data2) => {

            this.serviceRecollement.getAllLigneRecollement().subscribe(
              (data3) => {

                data3.forEach(element3 => {
                  if(element3.recollement.numRecollement == data2.numRecollement){
                    this.serviceCorrespodant.getAllStocker().subscribe(
                      (data4) => {
                        let exist1:boolean = false;
                        let exist2:boolean = false;
                        let concernedStockerMagasinSource:Stocker = null;
                        let concernedStockerMagasinDestinataire:Stocker = null;
                        data4.forEach(element4 => {
                          if(element4.magasin.codeMagasin == element3.recollement.magasinSource.codeMagasin && element4.article.codeArticle == element3.article.codeArticle){
                            concernedStockerMagasinSource = element4;
                            exist1 = true;
                            exit;
                          }
                          if(element4.magasin.codeMagasin == element3.recollement.magasinDestination.codeMagasin && element4.article.codeArticle == element3.article.codeArticle){
                            concernedStockerMagasinDestinataire = element4;
                            exist2 = true;
                            exit;
                          }

                        });

                        if(exist1){
                          concernedStockerMagasinSource.quantiterStocker+=element3.quantiteLigneRecollement;
                          this.serviceCorrespodant.editAStocker(concernedStockerMagasinSource.idStocker.toString(), concernedStockerMagasinSource).subscribe(
                            (data5) => {

                            },
                            (erreur) => {
                              console.log('Erreur lors de lEdition dUn stock', erreur);
                            }
                          );
                        }
                        else{
                          this.serviceCorrespodant.addAStocker(new Stocker(element3.quantiteLigneRecollement, 0, 0, 0, element3.article, element3.recollement.magasinSource)).subscribe(
                            (data6) => {

                            },
                            (erreur) => {
                              console.log('Erreur lors de lAjout dUn Stocker', erreur);
                            }
                          );
                        }

                        if(exist2){
                          concernedStockerMagasinDestinataire.quantiterStocker-=element3.quantiteLigneRecollement;
                          this.serviceCorrespodant.editAStocker(concernedStockerMagasinDestinataire.idStocker.toString(), concernedStockerMagasinDestinataire).subscribe(
                            (data7) => {

                            },
                            (erreur) => {
                              console.log('Erreur lors de lEdition dUn stock', erreur);
                            }
                          );
                        }
                        else{
                          this.serviceCorrespodant.addAStocker(new Stocker(element3.quantiteLigneRecollement*(-1), 0, 0, 0, element3.article, element3.recollement.magasinDestination)).subscribe(
                            (data8) => {

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

            this.annulerRecollementModal.hide();
            this.getAllRecollement();

          },
          (erreur) => {
            console.log('Erreur lors de la modification du placement', erreur);
          }
        );
        //this.editRecollement.magasinSource.libMagasin
     
}

initPrintPdfOfRecollement(inde:number){
  const commande = this.recollement[inde];
  const doc = new jsPDF();
  let lignes = [];
  let totalHT, totalTTC, totalRemise, totalTVA;
  totalHT = 0;
  totalRemise = 0;
  totalTVA = 0;
  totalTTC = 0;
  this.ligneRecollement.forEach(element => {
    if(element.recollement.numRecollement == commande.numRecollement){
      let lig = [];
      lig.push(element.article.codeArticle);
      lig.push(element.article.libArticle);
      lig.push(element.quantiteLigneRecollement);
      lig.push(element.puligneRecollement);
      
      lig.push(element.puligneRecollement*element.quantiteLigneRecollement);
      lig.push(element.observationLigneRecollement);
      lignes.push(lig);

      totalHT += element.puligneRecollement*element.quantiteLigneRecollement;
    

    }

  });
  doc.setDrawColor(0);
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(50, 20, 100, 15, 3, 3, 'FD');
  //doc.setFont("Times New Roman");
  
  doc.setFontSize(25);
  doc.text('RECOLLEMENT', 62, 30);
  doc.setFontSize(14);
  doc.text('Référence : '+commande.numRecollement, 15, 45);
  doc.text('Magasin Source : '+commande.magasinSource.codeMagasin+' - '+
  commande.magasinSource.libMagasin, 15, 55);
  doc.text('Magasin Destinataire : '+commande.magasinDestination.codeMagasin+' - '+
  commande.magasinDestination.libMagasin, 15, 65);
  doc.text('Description : '+commande.descriptionRecollement, 15, 75);
  doc.text('Date : '+moment(commande.dateRecollement).format('DD/MM/YYYY'), 145, 45);
  
 
  autoTable(doc, {
    theme: 'grid',
    head: [['Article', 'Désignation', 'Quantité', 'PU', 'Montant','Observation']],
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

  this.pdfToShow = this.sanitizer.bypassSecurityTrustResourceUrl(doc.output('datauristring', {filename:'recollement.pdf'}));
  this.viewPdfModal.show();
}


}
