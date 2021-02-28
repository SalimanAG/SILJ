import { Component, OnInit,ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { data } from 'jquery';
import {ModalDirective} from 'ngx-bootstrap/modal';
import { exit } from 'process';
import { Subject } from 'rxjs';
import { Arrondissement } from '../../../../models/arrondissement.model';
import { Article } from '../../../../models/article.model';
import { Commande } from '../../../../models/commande.model';
import { Correspondant } from '../../../../models/Correspondant.model';
import { EtreAffecte } from '../../../../models/etreAffecte.model';
import { Exercice } from '../../../../models/exercice.model';
import { Famille } from '../../../../models/famille.model';
import { Fournisseur } from '../../../../models/fournisseur.model';
import { LigneCommande } from '../../../../models/ligneCommande.model';
import { LignePlacement } from '../../../../models/lignePlacement.model';
import { Magasinier } from '../../../../models/magasinier.model';
import { Placement } from '../../../../models/placement.model';
import { PlageNumArticle } from '../../../../models/plageNumArticle.model';
import { Regisseur } from '../../../../models/regisseur.model';
import { Service } from '../../../../models/service.model';
import { TypCorres } from '../../../../models/typCorres.model';
import { Uniter } from '../../../../models/uniter.model';
import { Utilisateur } from '../../../../models/utilisateur.model';
import { ExerciceService } from '../../../../services/administration/exercice.service';
import { UtilisateurService } from '../../../../services/administration/utilisateur.service';
import { ArticleService } from '../../../../services/definition/article.service';
import { CommuneService } from '../../../../services/definition/commune.service';
import { CorrespondantService } from '../../../../services/definition/correspondant.service';
import { FournisseurService } from '../../../../services/definition/fournisseur.service';
import { RegisseurService } from '../../../../services/definition/regisseur.service';
import { BonApproService } from '../../../../services/saisie/bon-appro.service';
import { CommandeService } from '../../../../services/saisie/commande.service';
import { PlacementService } from '../../../../services/saisie/placement.service';

@Component({
  selector: 'app-placement',
  templateUrl: './placement.component.html',
  styleUrls: ['./placement.component.css']
})
export class PlacementComponent  implements OnInit {

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

  //++++++++++++++++
  commandes:Commande[] = [];
  addCommandeFormGroup:FormGroup;
  editCommandeFormGroup:FormGroup;
  editCommande:Commande = new Commande('', new Date(), '', 0, new Fournisseur('', '', '', '', '', '', ''), new Exercice('', '', new Date(), new Date(), '', false));
  suprCommande:Commande = new Commande('', new Date(), '', 0, new Fournisseur('', '', '', '', '', '', ''), new Exercice('', '', new Date(), new Date(), '', false));

  ligneCommandes:LigneCommande[] = [];

  tempAddLigneCommandes:LigneCommande[] = [];
  tempEditLigneCommandes:LigneCommande[] = [];
  tempDeleteLigneCommandes:LigneCommande[] = [];//+++++++++++++++++++++++++++++

  exercices:Exercice[] = [];
  articles:Article[] = [];
  correspondants:Correspondant[] = [];
  correspondantsByArrondi:Correspondant[] = [];
  arrondissements:Arrondissement[] = [];
  etreAffecters:EtreAffecte[] = [];
  regisseurs:Regisseur[] = [];
  utilisateurs:Utilisateur[] = [];
  concernedRegisse:Regisseur = new Regisseur('',new Magasinier('','',''),
  new Utilisateur('','','','','',false, new Service('','')));

  //++++++++++++++++++++++++++
  fournisseurs:Fournisseur[] = [];//+++++++++++++++++++++++++++++

  placements:Placement[];
  addPlacementFormGroup:FormGroup;
  editPlacementFormGroup:FormGroup;
  editPlacement:Placement = new Placement('', new Date(), new Regisseur('',new Magasinier('','',''),
  new Utilisateur('','','','','',false, new Service('',''))), new Correspondant('', false, new Magasinier('', '', ''),
  new TypCorres('', ''), new Utilisateur('', '', '', '', '', false, new Service('', ''))), new Exercice('', '', new Date(), new Date(), '', false));
  suprPlacement:Placement = new Placement('', new Date(), new Regisseur('',new Magasinier('','',''),
  new Utilisateur('','','','','',false, new Service('',''))), new Correspondant('', false, new Magasinier('', '', ''),
  new TypCorres('', ''), new Utilisateur('', '', '', '', '', false, new Service('', ''))), new Exercice('', '', new Date(), new Date(), '', false));

  lignePlacements:LignePlacement[];
  tempAddLignePlacement:LignePlacement[] = [];
  tempEditLignePlacement:LignePlacement[] = [];
  tempDeleteLignePlacement:LignePlacement[] = [];
  oldPlacementLine:LignePlacement[] = [];

  plageNumArticles:PlageNumArticle[];
  tempAddPlageNumArticle:PlageNumArticle[] = [];
  tempEditPlageNumArticle:PlageNumArticle[] = [];
  tempDeletePlageNumArticle:PlageNumArticle[] = [];
  oldPlageNumArtLines:PlageNumArticle[] = [];

  constructor(private serviceCommande:CommandeService, public serviceExercice:ExerciceService,
    private serviceFrs:FournisseurService, private serviceArticle:ArticleService,
    private formBulder:FormBuilder, private servicePlacement:PlacementService,
    private servicePlageNumArticle:BonApproService, private serviceCorres:CorrespondantService,
    private serviceCommune:CommuneService, private serviceRegisseur:RegisseurService,
    private serviceUtilisateur:UtilisateurService) {

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
    //++++++++++++++++++++++
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
    });//+++++++++++++++++++++++++++++++++++++++++++++

    this.addPlacementFormGroup = this.formBulder.group({
      addNumPlacement:['', Validators.required],
      addDatePlacement:[new Date(), Validators.required],
      addCorrespondant:[0, Validators.required],
      addArrondissement:[0, Validators.required]
    });

    this.editPlacementFormGroup = this.formBulder.group({
      editNumPlacement:['', Validators.required],
      editDatePlacement:[new Date(), Validators.required],
      editCorrespondant:[0, Validators.required],
      editArrondissement:[0, Validators.required]
    });


  }

  ngOnInit(): void {

    //++++++++++++++++++++++++++++++++++++++++
    this.getAllFrs();
    this.getAllLigneCommande();

    this.serviceCommande.getAllCommande().subscribe(
      (data) => {
        this.commandes = data;
      },
      (erreur) => {
        console.log('Erreur lors de la récupération de liste des commandes', erreur);
      }
    );//+++++++++++++++++++++++++++++++++++++

    this.getAllCorrespondant();
    this.getAllEtreAffecter();
    this.getAllLignePlacement();
    this.getAllPlageNumArticle();
    this.getAllArrondissement();
    this.getAllExercice();
    this.getAllUtilisateur();
    this.serviceRegisseur.getAllRegisseur().subscribe(
      (data) => {
        this.regisseurs = data;
        this.regisseurs.forEach(element => {
          console.log(element, this.serviceUtilisateur.connectedUser);
          if(this.serviceUtilisateur.connectedUser.idUtilisateur === element.utilisateur.idUtilisateur){
            this.concernedRegisse = element;
            exit;
          }
        });

      },
      (erreur) => {
        console.log('Erreur lors de la récupération de la liste des régisseurs', erreur);
      }
    );


    this.serviceCommune.getAllArrondissement().subscribe(
      (data) => {
        this.arrondissements = data;
        if(this.arrondissements.length != 0){
          this.getAllCorrespByArrondi(0);
        }
      },
      (erreur) => {
        console.log('Erreur lors de la récupération de la liste des arrondissements', erreur);
      }
    );

    this.servicePlacement.getAllPlacement().subscribe(
      (data) => {
        this.placements = data;
        this.dtTrigger1.next();
      },
      (erreur) => {
        console.log('Erreur lors de la récupération de la liste des placements', erreur);
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

  //++++++++++++++++++++++++++++
  getAllFrs(){
    this.serviceFrs.getAllFrs().subscribe(
      (data) => {
        this.fournisseurs = data;
      },
      (erreur) => {
        console.log('Erreur lors de la récupératio de la liste des Fournisseurs', erreur);
      }
    );
  }//++++++++++++++++++++++++++++++++++++++++++++

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

  //+++++++++++++++++++++++++++++++++++
  getAllCommande(){
    this.serviceCommande.getAllCommande().subscribe(
      (data) => {
        this.commandes = data;
      },
      (erreur) => {
        console.log('Erreur lors de la récupération de liste des commandes', erreur);
      }
    );
  }//++++++++++++++++++++++++++++++++++++++

  //+++++++++++++++++++++++++++++++++++++++++++++
  getAllLigneCommande(){
    this.serviceCommande.getAllLigneCommande().subscribe(
      (data) => {
        this.ligneCommandes = data;
      },
      (erreur) => {
        console.log('Erreur lors de la récuparation de la liste des lignes de commande', erreur);
      }
    );
  }//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

  getAllPlacement(){
    this.servicePlacement.getAllPlacement().subscribe(
      (data) => {
        this.placements = data;

      },
      (erreur) => {
        console.log('Erreur lors de la récupération de la liste des placements', erreur);
      }
    );
  }

  getAllLignePlacement(){
    this.servicePlacement.getAllLignePlacement().subscribe(
      (data) => {
        this.lignePlacements = data;

      },
      (erreur) => {
        console.log('Erreur lors de la récupération de la liste des lignes placement', erreur);
      }
    );
  }

  getAllCorrespondant(){
    this.serviceCorres.getAllCorres().subscribe(
      (data) => {
        this.correspondants = data;

      },
      (erreur) => {
        console.log('Erreur lors de la récupération de la liste des correspondants', erreur);
      }
    );
  }

  getAllArrondissement(){
    this.serviceCommune.getAllArrondissement().subscribe(
      (data) => {
        this.arrondissements = data;

      },
      (erreur) => {
        console.log('Erreur lors de la récupération de la liste des arrondissements', erreur);
      }
    );
  }

  getAllEtreAffecter(){
    this.serviceCorres.getAllEtreAffecte().subscribe(
      (data) => {
        this.etreAffecters = data;

      },
      (erreur) => {
        console.log('Erreur lors de la récupération des relations etre affecté', erreur);
      }
    );
  }

  getAllPlageNumArticle(){
    this.servicePlageNumArticle.getAllPlageNumArticle().subscribe(
      (data) => {
        this.plageNumArticles = data;

      },
      (erreur) => {
        console.log('Erreur lors de la récupération de la liste des plages', erreur);
      }
    );
  }

  getAllUtilisateur(){
    this.serviceUtilisateur.getAllUsers().subscribe(
      (data) => {
        this.utilisateurs = data;

      },
      (erreur) => {
        console.log('Erreur lors de la récupération de la liste des utilisateurs', erreur);
      }
    );
  }

  getAllRegisseur(){
    this.serviceRegisseur.getAllRegisseur().subscribe(
      (data) => {
        this.regisseurs = data;

      },
      (erreur) => {
        console.log('Erreur lors de la récupération de la liste des régisseurs', erreur);
      }
    );
  }

  getAllCorrespByArrondi(inde:number){
    this.correspondantsByArrondi = [];
    this.serviceCorres.getAllEtreAffecte().subscribe(
      (data) => {

        data.forEach(element => {
          if(element.site.arrondissement.codeArrondi == this.arrondissements[inde].codeArrondi){
            this.correspondantsByArrondi.push(element.corres);
          }
        });


      },
      (erreur) => {
        console.log('Erreur lors de la récupération des etre affecter', erreur);
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
    this.tempAddLignePlacement.forEach(element => {
      if(element.article.codeArticle==this.articles[inde].codeArticle){
        exist = true;
        exit;
      }
    });

    if(exist===false){
      this.tempAddLignePlacement.push(new LignePlacement(0, this.articles[inde].prixVenteArticle,new Placement('', new Date(), new Regisseur('',new Magasinier('','',''),
      new Utilisateur('','','','','',false, new Service('',''))), new Correspondant('', false, new Magasinier('', '', ''),
      new TypCorres('', ''), new Utilisateur('', '', '', '', '', false, new Service('', ''))), this.serviceExercice.exoSelectionner),
      this.articles[inde]));

      this.tempAddPlageNumArticle.push(new PlageNumArticle('0', '0', null, this.tempAddLignePlacement[this.tempAddLignePlacement.length-1], null));
    }


  }

  addArticleForEditingOfComm1(inde:number){
    let exist:boolean = false;
    this.tempEditLignePlacement.forEach(element => {
      if(element.article.codeArticle==this.articles[inde].codeArticle){
        exist = true;
        exit;
      }
    });

    if(exist===false){
      this.tempEditLignePlacement.push(new LignePlacement(0, this.articles[inde].prixVenteArticle,new Placement('', new Date(), new Regisseur('',new Magasinier('','',''),
      new Utilisateur('','','','','',false, new Service('',''))), new Correspondant('', false, new Magasinier('', '', ''),
      new TypCorres('', ''), new Utilisateur('', '', '', '', '', false, new Service('', ''))), this.serviceExercice.exoSelectionner),
      this.articles[inde]));

      this.tempEditPlageNumArticle.push(new PlageNumArticle('0', '0', null, this.tempEditLignePlacement[this.tempEditLignePlacement.length-1], null));
    }


  }

  popArticleAddingOfComm1(inde:number){

    this.tempAddPlageNumArticle.forEach((element, index) => {
      if(this.tempAddLignePlacement[inde].article.codeArticle == element.lignePlacement.article.codeArticle){
        this.tempAddPlageNumArticle.splice(index, 1);
      }
    });
    this.tempAddLignePlacement.splice(inde, 1);
  }

  popArticleEditingOfComm1(inde:number){
    this.tempEditPlageNumArticle.forEach((element, index) => {
      if(this.tempEditLignePlacement[inde].article.codeArticle == element.lignePlacement.article.codeArticle){
        this.tempEditPlageNumArticle.splice(index, 1);
      }
    });
    this.tempEditLignePlacement.splice(inde, 1);
  }

  onAddAPlageNumArticleClicked1(inde:number){
    this.tempAddPlageNumArticle.push(new PlageNumArticle('0', '0', null, this.tempAddLignePlacement[inde], null));
  }

  onAddAPlageNumArticleClicked2(inde:number){
    this.tempEditPlageNumArticle.push(new PlageNumArticle('0', '0', null, this.tempEditLignePlacement[inde], null));
  }

  popALigneOfPlageNumArticle1(inde:number){

    this.tempAddPlageNumArticle.splice(inde, 1);
  }

  popALigneOfPlageNumArticle2(inde:number){

    this.tempEditPlageNumArticle.splice(inde, 1);
  }



  initEditCommande(inde:number){

    this.tempEditLignePlacement = [];
    this.tempEditPlageNumArticle = [];
    this.oldPlacementLine = [];
    this.oldPlageNumArtLines = [];
    this.editPlacement = this.placements[inde];

    this.servicePlacement.getAllLignePlacement().subscribe(
      (data) => {
        this.lignePlacements = data;
        this.servicePlageNumArticle.getAllPlageNumArticle().subscribe(
          (data2) => {
            this.plageNumArticles = data2;

            this.lignePlacements.forEach(element => {
              if(element.placement.numPlacement == this.editPlacement.numPlacement){
                this.tempEditLignePlacement.push(element);
                this.oldPlacementLine.push(element);
              }
            });



            this.plageNumArticles.forEach(element => {
              if(element.lignePlacement!=null && element.lignePlacement.placement.numPlacement == this.editPlacement.numPlacement){
                this.tempEditPlageNumArticle.push(element);
                this.oldPlageNumArtLines.push(element);
              }
            });


            console.log('Placement line',this.oldPlacementLine);
            console.log('old plage line', this.oldPlageNumArtLines);

            this.editComModal.show();

          },
          (erreur) => {
            console.log('Erreur lors de la récupération de la liste des plages', erreur);
          }
        );
      },
      (erreur) => {
        console.log('Erreur lors de la récupération de la liste des lignes du placement', erreur);
      }
    );



  }

  initDeleteCommande(inde:number){

    this.suprPlacement = this.placements[inde];
    this.deleteComModal.show();
  }

  onAddArrondiSelected(){

    this.getAllCorrespByArrondi(this.addPlacementFormGroup.value['addArrondissement']);
  }

  onEditArrondiSelected(){

    this.getAllCorrespByArrondi(this.editPlacementFormGroup.value['editArrondissement']);
  }

  onSubmitAddCommandeFormsGroup(){

    const newPlacement = new Placement(this.addPlacementFormGroup.value['addNumPlacement'],
    this.addPlacementFormGroup.value['addDatePlacement'], this.concernedRegisse,
    this.correspondantsByArrondi[this.addPlacementFormGroup.value['addCorrespondant']],
    this.serviceExercice.exoSelectionner);


    this.servicePlacement.addAPlacement(newPlacement).subscribe(
      (data) => {
        this.tempAddLignePlacement.forEach(element => {
          element.placement = data;
          this.servicePlacement.addALignePlacement(element).subscribe(
            (data2) => {
              this.tempAddPlageNumArticle.forEach(element2 => {
                if(element2.lignePlacement.article.codeArticle == data2.article.codeArticle){
                  element2.lignePlacement = data2;
                  this.servicePlageNumArticle.addAPlageNumArticle(element2).subscribe(
                    (data3) => {

                    },
                    (erreur) => {
                      console.log('Erreur lors de lAjout dUne plage', erreur);
                    }
                  );
                }
              });
            },
            (erreur) => {
              console.log('Erreur lors de lAjout dUne ligne de placement', erreur);
            }
          );
        });

        this.getAllPlacement();
        this.getAllLignePlacement();

        this.addComModal.hide();

      },
      (erreur) => {
        console.log('Erreur lors de lAjout du placement', erreur);
      }
    );


  }

  onSubmitEditCommandeFormsGroup(){

    const newPlacement = new Placement(this.editPlacementFormGroup.value['editNumPlacement'],
    this.editPlacementFormGroup.value['editDatePlacement'], this.concernedRegisse,
    this.correspondantsByArrondi[this.editPlacementFormGroup.value['editCorrespondant']],
    this.serviceExercice.exoSelectionner);

    console.log('le new ', newPlacement);

      this.servicePlacement.editAPlacement(this.editPlacement.numPlacement, newPlacement).subscribe(
        (data) => {
          console.log('le new accepter', newPlacement);
          //Traitement des lignes de placement à ajouter et ou modifier
          this.tempEditLignePlacement.forEach(element => {
            console.log('Traitement des lignes de placement à ajouter et ou modifier ');
            let added:boolean = true;

            this.oldPlacementLine.forEach(element2 => {
              if(element.idLignePlacement == element2.idLignePlacement){
                added = false;
                //ce n'est pas une nouvelle ligne donc je passe à son édition
                console.log('ce n\'est pas une nouvelle ligne donc je passe à son édition', this.tempEditPlageNumArticle);
                this.servicePlacement.editALignePlacement(element2.idLignePlacement.toString(), element).subscribe(
                  (data2) => {
                    //la modification a marché don je passe à la suppression ou ajout ou modification de ces plages
                    this.tempEditPlageNumArticle.forEach(element3 => {
                      //filtrage important
                      if(element3.lignePlacement.idLignePlacement === data2.idLignePlacement){
                        let exis:boolean=false;

                        this.oldPlageNumArtLines.forEach(element4 => {
                          if(element3.idPlage === element4.idPlage){
                            exis = true;
                            this.servicePlageNumArticle.editAPlageNumArticle(element4.idPlage.toString(), element3).subscribe(
                              (data3) => {

                              },
                              (erreur) => {
                                console.log('Erreur lors de Ledition dUne plage', erreur);
                              }
                            );
                            exit;
                          }
                        });

                        if(exis == false){
                          console.log('Baddd');
                          element3.lignePlacement = data2;
                          this.servicePlageNumArticle.addAPlageNumArticle(element3).subscribe(
                            (data3) => {

                            },
                            (erreur) => {
                              console.log('Erreur lors de la création dUne plage de num', erreur);
                            }
                          );
                        }

                        //Suppression de ces lignes de plages qui ont été supprimées par l'User
                        this.oldPlageNumArtLines.forEach(element4 => {
                          if(element4.lignePlacement.idLignePlacement == data2.idLignePlacement){
                            let maint:boolean = false;
                            this.tempEditPlageNumArticle.forEach(element5 => {
                              if(element4.idPlage === element5.idPlage){
                                maint = true;
                                exit;
                              }
                            });

                            if(maint == false){
                              this.servicePlageNumArticle.deleteAPlageNumArticle(element4.idPlage.toString()).subscribe(
                                (data4) => {

                                },
                                (erreur) => {
                                  console.log('Erreur lors de la suppression dUne plage', erreur);
                                }
                              );
                            }
                          }


                        });

                      }
                    });

                    //un deep clean des plages
                    this.oldPlageNumArtLines.forEach(element12 => {
                      let mainn:boolean = false;
                      this.tempEditPlageNumArticle.forEach(element22 => {
                        if(element12.idPlage == element22.idPlage){
                          mainn = true;
                          exit;
                        }
                      });

                      if(mainn == false){
                        this.servicePlageNumArticle.deleteAPlageNumArticle(element12.idPlage.toString()).subscribe(
                          (data125) => {

                          },
                          (erreur) => {
                            console.log('Erreur lors de la suppression dUne plage', erreur);
                          }
                        );
                      }


                    });


                  },
                  (erreur) => {
                    console.log('Erreur lors de la modification dUne ligne de placement', erreur);
                  }
                );
                exit;
              }
            });

            if(added==true){
              element.placement = data;
              console.log('+', element);
              this.servicePlacement.addALignePlacement(element).subscribe(
                (data9) => {
                  console.log('liste', this.tempEditPlageNumArticle);
                  this.tempEditPlageNumArticle.forEach(element3 => {
                    if(element3.lignePlacement.article.codeArticle == data9.article.codeArticle){
                      console.log('++', element3);
                      element3.lignePlacement = data9;
                      console.log('+++', element3);
                      this.servicePlageNumArticle.addAPlageNumArticle(element3).subscribe(
                        (data2) => {

                        },
                        (erreur) => {
                          console.log('Erreur lors de lAjout dUne nouvelle plage', erreur);
                        }
                      );
                    }
                  });
                },
                (erreur) => {
                  console.log('Erreur lors de la création dUne ligne dAppro', erreur);
                }
              );
            }

          });


        //Traitement des lignes de placement à supprimer

        console.log('Placement line',this.oldPlacementLine);
        console.log('old plage line', this.oldPlageNumArtLines);

        this.oldPlacementLine.forEach(element => {
          console.log('Traitement des lignes de placement à supprimer');
          let mainte:boolean = false;
          this.tempEditLignePlacement.forEach(element2 => {
            if(element.idLignePlacement === element2.idLignePlacement){
              mainte = true;
              exit;
            }
          });

          if(mainte == false){
            console.log('Traitement des lignes de placement à supprimer');
            this.oldPlageNumArtLines.forEach(element3 => {
              if(element3.lignePlacement.idLignePlacement === element.idLignePlacement){
                this.servicePlageNumArticle.deleteAPlageNumArticle(element3.idPlage.toString()).subscribe(
                  (data7) => {
                    this.servicePlacement.deleteALignePlacement(element.idLignePlacement.toString()).subscribe(
                      (data8) => {

                      },
                      (erreur) => {
                        console.log('Erreur lors de suppression dUne ligne de Placement', erreur);
                      }
                    );
                  },
                  (erreur) => {
                    console.log('Erreur lors de la suppression dUne plage', erreur);
                  }
                );



              }
            });

            this.servicePlacement.deleteALignePlacement(element.idLignePlacement.toString()).subscribe(
              (data8) => {

              },
              (erreur) => {
                console.log('Erreur lors de suppression dUne ligne de Placement', erreur);
              }
            );

          }

        });

        this.editComModal.hide();
        this.getAllPlacement();
        this.getAllLignePlacement();
        this.getAllPlageNumArticle();

        },
        (erreur) => {
          console.log('Erreur lors de la modification du placement', erreur);
        }
      );


  }

  onConfirmDeleteCommande(){

    this.servicePlageNumArticle.getAllPlageNumArticle().subscribe(
      (data) => {
        this.plageNumArticles = data;
        this.servicePlacement.getAllLignePlacement().subscribe(
          (data2) => {
            this.lignePlacements = data2;
            //suppression des lignes de placement ayant de plage de numérotation d'article
            this.plageNumArticles.forEach(element => {
              if(element.lignePlacement != null && element.lignePlacement.placement.numPlacement == this.suprPlacement.numPlacement){
                this.servicePlageNumArticle.deleteAPlageNumArticle(element.idPlage.toString()).subscribe(
                  (data3) => {
                    this.servicePlacement.deleteALignePlacement(element.lignePlacement.idLignePlacement.toString()).subscribe(
                      (data4) => {
                        this.servicePlacement.deleteAPlacement(element.lignePlacement.placement.numPlacement).subscribe(
                          (data5) => {
                            this.getAllPlacement();
                          },
                          (erreur) => {
                            console.log('Erreur lors de la supprission du placement', erreur);
                          }
                        );
                      },
                      (erreur) => {
                        console.log('Erreur lors de la suppression dUne ligne de placcement', erreur);
                      }
                    );
                  },
                  (erreur) => {
                    console.log('Erreur lors de la suppression dUne ligne de plage',erreur);
                  }
                );
              }

            });

            //Suppression des lignes dAppro n'ayant pas de plage num
            this.lignePlacements.forEach(element => {

              if(element.placement.numPlacement == this.suprPlacement.numPlacement){
                this.servicePlacement.deleteALignePlacement(element.idLignePlacement.toString()).subscribe(
                  (data3) => {
                    this.servicePlacement.deleteAPlacement(element.placement.numPlacement).subscribe(
                      (data4) => {
                        this.getAllPlacement();
                      },
                      (erreur) => {
                        console.log('Erreur lors de la suppression du Placement', erreur);
                      }
                    );
                  },
                  (erreur) => {
                    console.log('Erreur lors de la suprression dUne ligne de placement', erreur);
                  }
                );
              }
            });

            //Sppression du placement
            this.servicePlacement.deleteAPlacement(this.suprPlacement.numPlacement).subscribe(
              (data3) => {
                this.getAllPlacement();
              },
              (erreur) => {
                console.log('Erreur lors de la suppressionn du placement', erreur);
              }
            );

            this.deleteComModal.hide();
            this.getAllPlacement();
            this.getAllLignePlacement();
            this.getAllPlageNumArticle();

          },
          (erreur) => {
            console.log('Erreur lors de la récupération de la liste des ligne de placement', erreur);
          }
        );
      },
      (erreur) => {
        console.log('Erreur lors de la récupération de la liste des plages', erreur);
      }
    );


  }

}
