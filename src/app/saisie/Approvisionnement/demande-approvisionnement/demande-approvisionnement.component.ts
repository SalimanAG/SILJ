import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {ModalDirective} from 'ngx-bootstrap/modal';
import { exit } from 'process';
import { Subject } from 'rxjs';
import { Article } from '../../../../models/article.model';
import { Commande } from '../../../../models/commande.model';
import { Exercice } from '../../../../models/exercice.model';
import { Famille } from '../../../../models/famille.model';
import { Fournisseur } from '../../../../models/fournisseur.model';
import { LigneCommande } from '../../../../models/ligneCommande.model';
import { Uniter } from '../../../../models/uniter.model';
import { ExerciceService } from '../../../../services/administration/exercice.service';
import { ArticleService } from '../../../../services/definition/article.service';
import { FournisseurService } from '../../../../services/definition/fournisseur.service';
import { CommandeService } from '../../../../services/saisie/commande.service';

@Component({
  selector: 'app-demande-approvisionnement',
  templateUrl: './demande-approvisionnement.component.html',
  styleUrls: ['./demande-approvisionnement.component.css']
})
export class DemandeApprovisionnementComponent  implements OnInit {

  //Commune
  @ViewChild('addComModal') public addComModal: ModalDirective;
  @ViewChild('editComModal') public editComModal: ModalDirective;
  @ViewChild('deleteComModal') public deleteComModal: ModalDirective;
  @ViewChild('addArticle1') public addArticle1: ModalDirective;
  @ViewChild('addArticle2') public addArticle2: ModalDirective;


  dtOptions1: DataTables.Settings = {};
  dtOptions2: DataTables.Settings = {};
  dtOptions3: DataTables.Settings = {};
  dtTrigger1: Subject<any> = new Subject<any>();
  dtTrigger2: Subject<any> = new Subject<any>();
  dtTrigger3: Subject<any> = new Subject<any>();


  commandes:Commande[] = [];
  addCommandeFormGroup:FormGroup;
  editCommandeFormGroup:FormGroup;
  editCommande:Commande = new Commande('', new Date(), '', 0, new Fournisseur('', '', '', '', '', '', ''), new Exercice('', '', new Date(), new Date(), '', false));
  suprCommande:Commande = new Commande('', new Date(), '', 0, new Fournisseur('', '', '', '', '', '', ''), new Exercice('', '', new Date(), new Date(), '', false));

  ligneCommandes:LigneCommande[] = [];
  editLigneCommande:LigneCommande = new LigneCommande(0, 0, 0, 0,
    new Commande('', new Date(), '', 0, new Fournisseur('', '', '', '', '', '', ''), new Exercice('', '', new Date(), new Date(), '', false)),
    new Article('', '', false, false, false, false, 0, '', new Famille('', ''), new Uniter('', '')));
  suprLigneCommande:LigneCommande = new LigneCommande(0, 0, 0, 0,
    new Commande('', new Date(), '', 0, new Fournisseur('', '', '', '', '', '', ''), new Exercice('', '', new Date(), new Date(), '', false)),
    new Article('', '', false, false, false, false, 0, '', new Famille('', ''), new Uniter('', '')));

  tempAddLigneCommandes:LigneCommande[] = [];
  tempEditLigneCommandes:LigneCommande[] = [];
  tempDeleteLigneCommandes:LigneCommande[] = [];

  exercices:Exercice[] = [];
  articles:Article[] = [];
  fournisseurs:Fournisseur[] = [];

  constructor(private serviceCommande:CommandeService, private serviceExercice:ExerciceService,
    private serviceFrs:FournisseurService, private serviceArticle:ArticleService,
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
    this.addCommandeFormGroup = this.formBulder.group({
      addNumCommande:['', Validators.required],
      addDateCommande:[new Date(), Validators.required],
      addDescription:'',
      addDelaiLivraison:[0, Validators.required],
      addFrs:[0, Validators.required]
    });

    this.editCommandeFormGroup = this.formBulder.group({
      editNumCommande:['', Validators.required],
      editDateCommande:[new Date(), Validators.required],
      editDescription:'',
      editDelaiLivraison:[0, Validators.required],
      editFrs:[0, Validators.required]
    });
  }

  ngOnInit(): void {

    this.getAllFrs();
    this.getAllLigneCommande();
    this.getAllExercice();

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

    this.serviceCommande.getAllCommande().subscribe(
      (data) => {
        this.commandes = data;
        this.dtTrigger1.next();
      },
      (erreur) => {
        console.log('Erreur lors de la récupération de liste des commandes', erreur);
      }
    );

  }

  getAllFrs(){
    this.serviceFrs.getAllFrs().subscribe(
      (data) => {
        this.fournisseurs = data;
      },
      (erreur) => {
        console.log('Erreur lors de la récupératio de la liste des Fournisseurs', erreur);
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

  getAllArticle(){
    this.serviceArticle.getAllArticle().subscribe(
      (data) => {
        this.articles = data;
      },
      (erreur) => {
        console.log('Erreur lors de la récupération de la liste des articles', erreur);
      }
    );
  }

  getAllCommande(){
    this.serviceCommande.getAllCommande().subscribe(
      (data) => {
        this.commandes = data;
      },
      (erreur) => {
        console.log('Erreur lors de la récupération de liste des commandes', erreur);
      }
    );
  }

  getAllLigneCommande(){
    this.serviceCommande.getAllLigneCommande().subscribe(
      (data) => {
        this.ligneCommandes = data;
      },
      (erreur) => {
        console.log('Erreur lors de la récuparation de la liste des lignes de commande', erreur);
      }
    );
  }

  onShowAddArticleModalAddingCommande(){
    this.addArticle1.show();
    this.getAllArticle();
  }

  onShowAddArticleModalEditingCommande(){
    this.addArticle2.show();
    this.getAllArticle();


  }

  addArticleForAddingOfComm1(inde:number){
    let exist:boolean = false;
    this.tempAddLigneCommandes.forEach(element => {
      if(element.article.codeArticle==this.articles[inde].codeArticle){
        exist = true;
        exit;
      }
    });

    if(exist===false){
      this.tempAddLigneCommandes.push(new LigneCommande(0, this.articles[inde].prixVenteArticle, 0, 0,
        new Commande('', new Date(), '', 0, new Fournisseur('', '', '', '', '', '', ''), new Exercice('', '', new Date(), new Date(), '', false)),
        this.articles[inde]));
    }


  }

  addArticleForEditingOfComm1(inde:number){
    let exist:boolean = false;
    this.tempEditLigneCommandes.forEach(element => {
      if(element.article.codeArticle==this.articles[inde].codeArticle){
        exist = true;
        exit;
      }
    });

    if(exist===false){
      this.tempEditLigneCommandes.push(new LigneCommande(0, this.articles[inde].prixVenteArticle, 0, 0,
        new Commande('', new Date(), '', 0, new Fournisseur('', '', '', '', '', '', ''), new Exercice('', '', new Date(), new Date(), '', false)),
        this.articles[inde]));
    }

  }

  popArticleAddingOfComm1(inde:number){
    this.tempAddLigneCommandes.splice(inde, 1);
  }

  popArticleEditingOfComm1(inde:number){
    this.tempEditLigneCommandes.splice(inde, 1);
  }

  initEditCommande(inde:number){
    this.tempEditLigneCommandes=[];
    this.editCommande = this.commandes[inde];
    this.serviceCommande.getAllLigneCommande().subscribe(
      (data) => {
        this.ligneCommandes = data;
        this.ligneCommandes.forEach(element => {
          if(element.numCommande.numCommande==this.editCommande.numCommande){
            this.tempEditLigneCommandes.push(element);
          }
        });
        this.editComModal.show();
      },
      (erreur) => {
        console.log('Erreur lors de la récuparation de la liste des lignes de commande', erreur);
      }
    );

  }

  initDeleteCommande(inde:number){
    this.suprCommande = this.commandes[inde];
    this.deleteComModal.show();
  }

  onSubmitAddCommandeFormsGroup(){

    const newComm= new Commande(this.addCommandeFormGroup.value['addNumCommande'],
    this.addCommandeFormGroup.value['addDateCommande'],
    this.addCommandeFormGroup.value['addDescription'],
    this.addCommandeFormGroup.value['addDelaiLivraison'],
    this.fournisseurs[this.addCommandeFormGroup.value['addFrs']],
    this.serviceExercice.exoSelectionner);
    console.log(this.tempAddLigneCommandes, newComm);
    this.serviceCommande.addACommande(newComm).subscribe(
      (data) => {
        this.tempAddLigneCommandes.forEach(element => {
          element.numCommande = data;
          this.serviceCommande.addALigneCommande(element).subscribe(
            (data2) => {

            },
            (erreur) => {
              console.log('Erreur lors de la création de la ligne de commande',erreur );
            }
          );
        });

        this.addComModal.hide();
        this.getAllCommande();
        this.getAllLigneCommande();
      },
      (erreur) => {
        console.log('Erreur lors de la création de la commande', erreur);
      }
    );




  }

  onSubmitEditCommandeFormsGroup(){
    const newComm= new Commande(this.editCommandeFormGroup.value['editNumCommande'],
    this.editCommandeFormGroup.value['editDateCommande'],
    this.editCommandeFormGroup.value['editDescription'],
    this.editCommandeFormGroup.value['editDelaiLivraison'],
    this.fournisseurs[this.editCommandeFormGroup.value['editFrs']],
    this.serviceExercice.exoSelectionner);

    let oldCommandeLines:LigneCommande[] = [];

    this.ligneCommandes.forEach(element => {
      if(element.numCommande.numCommande==this.editCommande.numCommande){
        oldCommandeLines.push(element);
      }
    });


    this.serviceCommande.editACommande(this.editCommande.numCommande, newComm).subscribe(
      (data) => {

        //Pour ajout et ou modification des lignes
        this.tempEditLigneCommandes.forEach(element => {
          let added:boolean = true;
          oldCommandeLines.forEach(element2 => {
            if(element.article.codeArticle==element2.article.codeArticle){
              added = false;
              element.numCommande = data;

              this.serviceCommande.editALigneCommande(element2.idLigneCommande.toString(), element).subscribe(
                (data2) => {

                },
                (erreur) => {
                  console.log('Erreur lors de la modification de ligne de Commande', erreur);
                }
              );
              exit;
            }
          });

          if(added===true){
            element.numCommande = data;
            this.serviceCommande.addALigneCommande(element).subscribe(
              (data3) => {

              },
              (erreur) => {
                console.log('Erreur lors de la création dUne nouvelle ligne pour lEdition', erreur)
              }
            );
          }

        });


        //Pour suppression des lignes suprimés
        oldCommandeLines.forEach(element => {
          let deleted:boolean = true;
          this.tempEditLigneCommandes.forEach(element2 => {

            if(element.article.codeArticle==element2.article.codeArticle){
              deleted = false;
              exit;
            }

          });

          if(deleted===true){
            this.serviceCommande.deleteALigneCommande(element.idLigneCommande.toString()).subscribe(
              (data) => {

              },
              (erreur) => {
                console.log('Erreur lors de la suppression de la ligne', erreur);
              }
            );
          }

        });

        this.editComModal.hide();

        this.getAllCommande();
        this.getAllLigneCommande();

      },
      (erreur) => {
        console.log('Erreur lors de lEdition de la commande', erreur);
      }
    );



  }

  onConfirmDeleteCommande(){
    this.getAllLigneCommande();
    let faled:boolean=false;
    this.ligneCommandes.forEach(element => {
      if(element.numCommande.numCommande==this.suprCommande.numCommande){
        this.serviceCommande.deleteALigneCommande(element.idLigneCommande.toString()).subscribe(
          (data) => {
            this.serviceCommande.deleteACommande(this.suprCommande.numCommande).subscribe(
              (data) => {
                this.deleteComModal.hide();
                this.getAllCommande();
                this.getAllLigneCommande();
              },
              (erreur) => {
                console.log('Erreur lors de la suppression de la commande', erreur);
              }
            );
          },
          (erreur) => {
            console.log('Erreur lors de la suppression dUne ligne de Commande', erreur);
            //faled=true;
          }
        );
      }
    });

    if(faled==false){
      this.serviceCommande.deleteACommande(this.suprCommande.numCommande).subscribe(
        (data) => {
          this.deleteComModal.hide();
          this.getAllCommande();
          this.getAllLigneCommande();
        },
        (erreur) => {
          console.log('Erreur lors de la suppression de la commande', erreur);
        }
      );
    }

  }

}
