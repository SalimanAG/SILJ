import { Component, OnInit,ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {ModalDirective} from 'ngx-bootstrap/modal';
import { exit } from 'process';
import { Subject } from 'rxjs';
import { Arrondissement } from '../../../../models/arrondissement.model';
import { Article } from '../../../../models/article.model';
import { Commande } from '../../../../models/commande.model';
import { Correspondant } from '../../../../models/Correspondant.model';
import { EtreAffecte } from '../../../../models/etreAffecte.model';
import { Exercice } from '../../../../models/exercice.model';
import { Fournisseur } from '../../../../models/fournisseur.model';
import { LigneCommande } from '../../../../models/ligneCommande.model';
import { LignePlacement } from '../../../../models/lignePlacement.model';
import { Magasinier } from '../../../../models/magasinier.model';
import { Placement } from '../../../../models/placement.model';
import { PlageNumArticle } from '../../../../models/plageNumArticle.model';
import { Regisseur } from '../../../../models/regisseur.model';
import { Service } from '../../../../models/service.model';
import { TypCorres } from '../../../../models/typCorres.model';
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
import {jsPDF} from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DomSanitizer } from '@angular/platform-browser';
import * as moment from 'moment';
import { Magasin } from '../../../../models/magasin.model';
import { Stocker } from '../../../../models/stocker.model';
import { PlageNumDispo } from '../../../../models/PlageNumDispo';
import { PlageNumDispoService } from '../../../../services/saisie/PlageNumDispo.service';
import { ToolsService } from '../../../../services/utilities/tools.service';
import { Fonction } from '../../../../models/fonction.model';
import { Signer } from '../../../../models/signer.model';
import { Occuper } from '../../../../models/occuper.model';
import { SignataireService } from '../../../../services/administration/signataire-service.service';
import { Tools2Service } from '../../../../services/utilities/tools2.service';

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
  @ViewChild('viewPdfModal') public viewPdfModal: ModalDirective;
  @ViewChild('annulerPlaModal') public annulerPlaModal: ModalDirective;

  dtOptions1: DataTables.Settings = {};
  dtOptions2: DataTables.Settings = {};
  dtOptions3: DataTables.Settings = {};
  dtTrigger1: Subject<any> = new Subject<any>();
  dtTrigger2: Subject<any> = new Subject<any>();
  dtTrigger3: Subject<any> = new Subject<any>();


  exercices:Exercice[] = [];
  articles:Article[] = [];
  correspondants:Correspondant[] = [];
  correspondantsByArrondi:Correspondant[] = [];
  arrondissements:Arrondissement[] = [];
  etreAffecters:EtreAffecte[] = [];
  regisseurs:Regisseur[] = [];
  utilisateurs:Utilisateur[] = [];
  concernedRegisse:Regisseur = new Regisseur('',new Magasinier('','',''),
  new Utilisateur('','','','',new Fonction('',''),false, new Service('','')));


  placements:Placement[];
  addPlacementFormGroup:FormGroup;
  editPlacementFormGroup:FormGroup;
  editPlacement:Placement = new Placement('', new Date(), new Regisseur('',new Magasinier('','',''),
  new Utilisateur('','','','',new Fonction('',''),false, new Service('',''))), new Correspondant('', false, new Magasinier('', '', ''),
  new TypCorres('', ''), new Utilisateur('', '', '', '', new Fonction('',''), false, new Service('', ''))), new Exercice('', '', new Date(), new Date(), '', false));
  suprPlacement:Placement = new Placement('', new Date(), new Regisseur('',new Magasinier('','',''),
  new Utilisateur('','','','',new Fonction('',''),false, new Service('',''))), new Correspondant('', false, new Magasinier('', '', ''),
  new TypCorres('', ''), new Utilisateur('', '', '', '', new Fonction('',''), false, new Service('', ''))), new Exercice('', '', new Date(), new Date(), '', false));

  annulPlacement:Placement = new Placement('', new Date(), new Regisseur('',new Magasinier('','',''),
  new Utilisateur('','','','',new Fonction('',''),false, new Service('',''))), new Correspondant('', false, new Magasinier('', '', ''),
  new TypCorres('', ''), new Utilisateur('', '', '', '', new Fonction('',''), false, new Service('', ''))), new Exercice('', '', new Date(), new Date(), '', false));

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

  plagesDispo: PlageNumDispo[];
  plageDispoArti: PlageNumDispo[];

  pdfToShow = null;

  carveauxMairie:Magasin = new Magasin('', '');
  magOfSelectedCorres:Magasin = new Magasin('', '');

  codeDoc = 'BP';
  listSigner: Signer[] = [];
  listOccuper: Occuper[] = [];

  constructor(private serviceCommande:CommandeService, public serviceExercice:ExerciceService,
    private serviceFrs:FournisseurService, private serviceArticle:ArticleService,
    private formBulder:FormBuilder, private servicePlacement:PlacementService,
    private servicePlageNumArticle:BonApproService, private serviceCorres:CorrespondantService,
    private serviceCommune:CommuneService, private serviceRegisseur:RegisseurService,
    private serviceUtilisateur: UtilisateurService, private sanitizer: DomSanitizer,
  public pds: PlageNumDispoService, private serviceSignataire: SignataireService, public serviceTools:ToolsService) {

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


    this.addPlacementFormGroup = this.formBulder.group({
      addNumPlacement:'',
      addDatePlacement:[moment(Date.now()).format('yyyy-MM-DD'), Validators.required],
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

    this.getAllCorrespondant();
    this.getAllEtreAffecter();
    this.getAllLignePlacement();
    this.getAllPlageNumArticle();
    this.getAllArrondissement();
    this.getAllExercice();
    this.getAllUtilisateur();
    this.getCarveauMairie();
    this.getAllPlageDispo();
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


  //Récuperer le carveau Mairie
  getCarveauMairie(){
    this.serviceRegisseur.getAllRegisseur().subscribe(
      (data) => {
        data.forEach(element => {
          let finded:boolean = false;
          this.serviceCorres.getAllGerer().subscribe(
            (data2) => {
              data2.forEach(element2 => {
                if(element2.magasinier.numMAgasinier == element.magasinier.numMAgasinier){
                  this.carveauxMairie = element2.magasin;
                  finded = true;
                  exit;
                }
              });
            },
            (erreur) => {
              console.log('Erreur lors de la récupération de la liste des gérers', erreur);
            }
          );

          if(finded){
            exit;
          }

        });
      },
      (erreur) => {
        console.log('Erreur lors de la récupération de la liste des régisseurs', erreur);
      }
    );
  }

  //Récupératio du magasin du correspondant selectionné
  getMagasinOfSelectedCorres(inde:number){
    let selectedCorres:Correspondant = this.correspondantsByArrondi[inde];
    this.serviceCorres.getAllGerer().subscribe(
      (data) => {
        let finded:boolean = false;
        data.forEach(element => {
          if(element.magasinier.numMAgasinier == selectedCorres.magasinier.numMAgasinier){
            this.magOfSelectedCorres = element.magasin;
            finded = true;
            exit;
          }
        });

        if(!finded) {
          this.magOfSelectedCorres = null;
          console.log('Erreur !! Aucun Magasin trouvé pour le correspondant selectionné');
        }

      },
      (erreur) => {
        console.log('Erreur lors de la récupération des gérés', erreur);
      }
    );
  }

  getMagasinOfTheCorres1(){
    this.getMagasinOfSelectedCorres(this.addPlacementFormGroup.value['addCorrespondant']);
  }

  getAllOccuper(){
    this.serviceSignataire.getOccupers().subscribe(
      (data) => {
        this.listOccuper = data;
      },
      (erreur) => {
        console.log('Erreur lors de la récupération de la liste des occupations', erreur);
      }
    );
  }

  getAllSigner(){
    this.serviceSignataire.getSigners().subscribe(
      (data) => {
        this.listSigner = data;
      },
      (erreur) => {
        console.log('Erreur lors de la récupération de la liste des signers', erreur);
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
        $('#dataTable2').dataTable().api().destroy();
        this.dtTrigger2.next();
        $('#dataTable3').dataTable().api().destroy();
        this.dtTrigger3.next();
      },
      (erreur) => {
        console.log('Erreur lors de la récupération de la liste des articles', erreur);
      }
    );
  }

  getAllPlageDispo() {
    this.pds.getAllPND().subscribe(
      data => {
        this.plagesDispo = data;
      }
    );
  }

  getAllPlacement(){
    this.servicePlacement.getAllPlacement().subscribe(
      (data) => {
        this.placements = data;
        $('#dataTable1').dataTable().api().destroy();
        this.dtTrigger1.next();
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
          if(element.arrondissement.codeArrondi == this.arrondissements[inde].codeArrondi){
            this.correspondantsByArrondi.push(element.corres);
          }
        });

        if(this.correspondantsByArrondi.length != 0) this.getMagasinOfTheCorres1();


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
      new Utilisateur('','','','',new Fonction('',''),false, new Service('',''))), new Correspondant('', false, new Magasinier('', '', ''),
      new TypCorres('', ''), new Utilisateur('', '', '', '', new Fonction('',''), false, new Service('', ''))), this.serviceExercice.exoSelectionner),
      this.articles[inde]));

      //this.tempAddPlageNumArticle.push(new PlageNumArticle(0, 0, null, this.tempAddLignePlacement[this.tempAddLignePlacement.length-1], null));
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
      new Utilisateur('','','','',new Fonction('',''),false, new Service('',''))), new Correspondant('', false, new Magasinier('', '', ''),
      new TypCorres('', ''), new Utilisateur('', '', '', '', new Fonction('',''), false, new Service('', ''))), this.serviceExercice.exoSelectionner),
      this.articles[inde]));

      //this.tempEditPlageNumArticle.push(new PlageNumArticle(0, 0, null, this.tempEditLignePlacement[this.tempEditLignePlacement.length-1], null));
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
    //this.tempAddPlageNumArticle.push(new PlageNumArticle(0, 0, null, this.tempAddLignePlacement[inde], null));
  }

  onAddAPlageNumArticleClicked2(inde:number){
    //this.tempEditPlageNumArticle.push(new PlageNumArticle(0, 0, null, this.tempEditLignePlacement[inde], null));
  }

  popALigneOfPlageNumArticle1(inde:number){

    this.tempAddPlageNumArticle.splice(inde, 1);
  }

  popALigneOfPlageNumArticle2(inde:number){

    this.tempEditPlageNumArticle.splice(inde, 1);
  }

  numero() {
    console.log(this.plageNumArticles);

  }

  numerotation(inde: number) {
    /*console.log(inde);
    if (this.lignePlacements[inde].article.numSerieArticle == true) {
      let qte = this.lignePlacements[inde].quantiteLignePlacement;
      if (qte > 0) {

      this.plageDispoArti = this.plagesDispo.filter(pd => pd.article.codeArticle ==
        this.tempAddLignePlacement[inde].article.codeArticle);
      this.plageDispoArti.sort((a, b) => a.numDebPlage - b.numFinPlageDispo);
      if ((this.plageDispoArti[0].numFinPlage - this.plageDispoArti[0].numDebPlageDispo + 1) <=
        this.lignePlacements[inde].quantiteLignePlacement) {
        let i = 0;
        while (qte > 0) {
          if (qte >= (this.plageDispoArti[i].numFinPlageDispo
            - this.plageDispoArti[i].numDebPlageDispo + 1)) {
            this.plageNumArticles.push(new PlageNumArticle(this.plageDispoArti[i].numDebPlageDispo,
              this.plageDispoArti[i].numFinPlageDispo, null, this.lignePlacements[inde], null));
            qte-=this.plageDispoArti[i].numFinPlageDispo-this.plageDispoArti[i].numDebPlageDispo
          } else {
            this.plageNumArticles.push(new PlageNumArticle(this.plageDispoArti[i].numDebPlageDispo,
              this.plageDispoArti[i].numDebPlageDispo + qte, null, this.lignePlacements[inde], null));
            qte = 0;
          }
        }
      } else {
        this.plageNumArticles.push(new PlageNumArticle(this.plageDispoArti[0].numDebPlageDispo,
          this.plageDispoArti[0].numDebPlageDispo + this.lignePlacements[inde].quantiteLignePlacement,
          null, this.lignePlacements[inde], null));
      }
      }
    }
    console.log(this.tempAddPlageNumArticle);*/

  }

  initAddPlacement(){
    this.addComModal.show();
    if (this.correspondantsByArrondi.length != 0) {
      this.getMagasinOfTheCorres1();
      this.getAllPlageDispo();
    }
  }

  initEditCommande(inde:number){

    this.tempEditLignePlacement = [];
    this.tempEditPlageNumArticle = [];
    this.oldPlacementLine = [];
    this.oldPlageNumArtLines = [];
    this.editPlacement = this.placements[inde];

    this.serviceCorres.getAllGerer().subscribe(
      (data) => {

        data.forEach(element => {
          if(element.magasinier.numMAgasinier == this.editPlacement.correspondant.magasinier.numMAgasinier){
            this.magOfSelectedCorres = element.magasin;
            exit;
          }
        });
      },
      (erreur) => {
        console.log('Erreur lors de la récupération de liste des gérers', erreur);
      }
    );

    this.servicePlacement.getAllLignePlacement().subscribe(
      (data) => {
        this.lignePlacements = data;
        this.servicePlageNumArticle.getAllPlageNumArticle().subscribe(
          (data2) => {
            this.plageNumArticles = data2;

            this.lignePlacements.forEach(element => {
              if(element.placement.numPlacement == this.editPlacement.numPlacement){
                this.tempEditLignePlacement.push(element);
              }
            });



            this.plageNumArticles.forEach(element => {
              if(element.lignePlacement!=null && element.lignePlacement.placement.numPlacement == this.editPlacement.numPlacement){
                this.tempEditPlageNumArticle.push(element);
              }
            });

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



    this.servicePlacement.getAllLignePlacement().subscribe(
      (data) => {
        this.servicePlageNumArticle.getAllPlageNumArticle().subscribe(
          (data2) => {
            data.forEach(element => {
              if(element.placement.numPlacement == this.editPlacement.numPlacement){

                this.oldPlacementLine.push(element);
              }
            });



            data2.forEach(element => {
              if(element.lignePlacement!=null && element.lignePlacement.placement.numPlacement == this.editPlacement.numPlacement){

                this.oldPlageNumArtLines.push(element);
              }
            });


            console.log('Placement line',this.oldPlacementLine);
            console.log('old plage line', this.oldPlageNumArtLines);


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

  initAnnulerPlacement(inde:number){

    this.annulPlacement = this.placements[inde];
    this.annulerPlaModal.show();
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

    //console.log('6666', this.magOfSelectedCorres);
    //return;

    this.servicePlacement.addAPlacement(newPlacement).subscribe(
      (data) => {
        this.tempAddLignePlacement.forEach((element, inde) => {
          element.placement = data;
          this.servicePlacement.addALignePlacement(element).subscribe(
            (data2) => {

              this.tempAddLignePlacement.splice(inde);

              this.serviceCorres.getAllStocker().subscribe(
                (data3) => {
                  let exist1:boolean = false;
                  let exist2:boolean = false;
                  let concernedStockerCarvMairie:Stocker = null;
                  let concernedStockerMagCorres:Stocker = null;
                  data3.forEach(element3 => {
                    if(element3.magasin.codeMagasin == this.carveauxMairie.codeMagasin && element3.article.codeArticle == data2.article.codeArticle){
                      concernedStockerCarvMairie = element3;
                      exist1 = true;
                      exit;
                    }
                    if(element3.magasin.codeMagasin == this.magOfSelectedCorres.codeMagasin && element3.article.codeArticle == data2.article.codeArticle){
                      concernedStockerMagCorres = element3;
                      exist2 = true;
                      exit;
                    }

                  });

                  if(exist1){
                    concernedStockerCarvMairie.quantiterStocker-=data2.quantiteLignePlacement;
                    this.serviceCorres.editAStocker(concernedStockerCarvMairie.idStocker.toString(), concernedStockerCarvMairie).subscribe(
                      (data4) => {

                      },
                      (erreur) => {
                        console.log('Erreur lors de lEdition dUn stock', erreur);
                      }
                    );
                  }
                  else{
                    this.serviceCorres.addAStocker(new Stocker(data2.quantiteLignePlacement*(-1), 0, 0, 0, data2.article, this.carveauxMairie)).subscribe(
                      (data4) => {

                      },
                      (erreur) => {
                        console.log('Erreur lors de lAjout dUn Stocker', erreur);
                      }
                    );
                  }

                  if(exist2){
                    concernedStockerMagCorres.quantiterStocker+=data2.quantiteLignePlacement;
                    this.serviceCorres.editAStocker(concernedStockerMagCorres.idStocker.toString(), concernedStockerMagCorres).subscribe(
                      (data4) => {

                      },
                      (erreur) => {
                        console.log('Erreur lors de lEdition dUn stock', erreur);
                      }
                    );
                  }
                  else{
                    this.serviceCorres.addAStocker(new Stocker(data2.quantiteLignePlacement, 0, 0, 0, data2.article, this.magOfSelectedCorres)).subscribe(
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
    this.editPlacement.correspondant,
    this.serviceExercice.exoSelectionner);

    //console.log('le new ', newPlacement);

      this.servicePlacement.editAPlacement(this.editPlacement.numPlacement, newPlacement).subscribe(
        (data) => {
          //console.log('le new accepter', newPlacement);
          //Traitement des lignes de placement à ajouter et ou modifier
          this.tempEditLignePlacement.forEach(element => {
            //console.log('Traitement des lignes de placement à ajouter et ou modifier ');
            let added:boolean = true;

            this.oldPlacementLine.forEach(element2 => {
              if(element.idLignePlacement == element2.idLignePlacement){
                added = false;
                //ce n'est pas une nouvelle ligne donc je passe à son édition
                //console.log('ce n\'est pas une nouvelle ligne donc je passe à son édition', this.tempEditPlageNumArticle);
                this.servicePlacement.editALignePlacement(element2.idLignePlacement.toString(), element).subscribe(
                  (data2) => {

                    //Réajustement des stocks
                    let exist1:boolean = false;
                    let exist2:boolean = false;
                    let concernedStockCorres:Stocker = null;
                    let concernedStockCarveauMairie:Stocker = null;
                    this.serviceCorres.getAllStocker().subscribe(
                      (data3) => {

                        data3.forEach(element3 => {
                          if(element3.magasin.codeMagasin == this.carveauxMairie.codeMagasin && element3.article.codeArticle == data2.article.codeArticle){
                            concernedStockCarveauMairie = element3;
                            exist1 = true;
                            exit;
                          }

                          if(element3.magasin.codeMagasin == this.magOfSelectedCorres.codeMagasin && element3.article.codeArticle == data2.article.codeArticle){
                            concernedStockCorres = element3;
                            exist2 = true;
                            exit;
                          }
                        });

                        if(exist1){
                          concernedStockCarveauMairie.quantiterStocker = concernedStockCarveauMairie.quantiterStocker + element2.quantiteLignePlacement - data2.quantiteLignePlacement;
                          this.serviceCorres.editAStocker(concernedStockCarveauMairie.idStocker.toString(), concernedStockCarveauMairie).subscribe(
                            (data4) => {

                            },
                            (erreur) => {
                              console.log('Erreur lors de la modification dUn stock', erreur);
                            }
                          );
                        }
                        else{
                          this.serviceCorres.addAStocker(new Stocker(data2.quantiteLignePlacement*(-1), 0, 0, 0, data2.article, this.carveauxMairie)).subscribe(
                            (data4) => {

                            },
                            (erreur) => {
                              console.log('Erreur lors de lAjout dUn stocker', erreur);
                            }
                          );
                        }

                        if(exist2){
                          concernedStockCorres.quantiterStocker = concernedStockCorres.quantiterStocker - element2.quantiteLignePlacement + data2.quantiteLignePlacement;
                          this.serviceCorres.editAStocker(concernedStockCorres.idStocker.toString(), concernedStockCorres).subscribe(
                            (data4) => {

                            },
                            (erreur) => {
                              console.log('Erreur lors de la modification dUn stock', erreur);
                            }
                          );
                        }
                        else{
                          this.serviceCorres.addAStocker(new Stocker(data2.quantiteLignePlacement, 0, 0, 0, data2.article, this.magOfSelectedCorres)).subscribe(
                            (data4) => {

                            },
                            (erreur) => {
                              console.log('Erreur lors de lAjout dUn stocker', erreur);
                            }
                          );
                        }

                      },
                      (erreur) => {
                        console.log('Erreur lors de la récupération des stockés', erreur);
                      }
                    );

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
                          //console.log('Baddd');
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
              //console.log('+', element);
              this.servicePlacement.addALignePlacement(element).subscribe(
                (data9) => {
                  //ajustement des stocks
                  this.serviceCorres.getAllStocker().subscribe(
                    (data3) => {
                      let exist1:boolean = false;
                      let exist2:boolean = false;
                      let concernedStockerCarvMairie:Stocker = null;
                      let concernedStockerMagCorres:Stocker = null;
                      data3.forEach(element3 => {
                        if(element3.magasin.codeMagasin == this.carveauxMairie.codeMagasin && element3.article.codeArticle == data9.article.codeArticle){
                          concernedStockerCarvMairie = element3;
                          exist1 = true;
                          exit;
                        }
                        if(element3.magasin.codeMagasin == this.magOfSelectedCorres.codeMagasin && element3.article.codeArticle == data9.article.codeArticle){
                          concernedStockerMagCorres = element3;
                          exist2 = true;
                          exit;
                        }

                      });

                      if(exist1){
                        concernedStockerCarvMairie.quantiterStocker-=data9.quantiteLignePlacement;
                        this.serviceCorres.editAStocker(concernedStockerCarvMairie.idStocker.toString(), concernedStockerCarvMairie).subscribe(
                          (data4) => {

                          },
                          (erreur) => {
                            console.log('Erreur lors de lEdition dUn stock', erreur);
                          }
                        );
                      }
                      else{
                        this.serviceCorres.addAStocker(new Stocker(data9.quantiteLignePlacement*(-1), 0, 0, 0, data9.article, this.carveauxMairie)).subscribe(
                          (data4) => {

                          },
                          (erreur) => {
                            console.log('Erreur lors de lAjout dUn Stocker', erreur);
                          }
                        );
                      }

                      if(exist2){
                        concernedStockerMagCorres.quantiterStocker+=data9.quantiteLignePlacement;
                        this.serviceCorres.editAStocker(concernedStockerMagCorres.idStocker.toString(), concernedStockerMagCorres).subscribe(
                          (data4) => {

                          },
                          (erreur) => {
                            console.log('Erreur lors de lEdition dUn stock', erreur);
                          }
                        );
                      }
                      else{
                        this.serviceCorres.addAStocker(new Stocker(data9.quantiteLignePlacement, 0, 0, 0, data9.article, this.magOfSelectedCorres)).subscribe(
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



                  //console.log('liste', this.tempEditPlageNumArticle);
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

        //console.log('Placement line',this.oldPlacementLine);
        //console.log('old plage line', this.oldPlageNumArtLines);

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
            //console.log('Traitement des lignes de placement à supprimer');
            this.oldPlageNumArtLines.forEach(element3 => {
              if(element3.lignePlacement.idLignePlacement === element.idLignePlacement){
                this.servicePlageNumArticle.deleteAPlageNumArticle(element3.idPlage.toString()).subscribe(
                  (data7) => {
                    this.servicePlacement.deleteALignePlacement(element.idLignePlacement.toString()).subscribe(
                      (data8) => {
                        //ajustement de stock si succès
                        console.log('Delete Res 2', data8);
                        if(!data8)
                        this.serviceCorres.getAllStocker().subscribe(
                          (data3) => {
                            let exist1:boolean = false;
                            let exist2:boolean = false;
                            let concernedStockerCarvMairie:Stocker = null;
                            let concernedStockerMagCorres:Stocker = null;
                            data3.forEach(element3 => {
                              if(element3.magasin.codeMagasin == this.carveauxMairie.codeMagasin && element3.article.codeArticle == element.article.codeArticle){
                                concernedStockerCarvMairie = element3;
                                exist1 = true;
                                exit;
                              }
                              if(element3.magasin.codeMagasin == this.magOfSelectedCorres.codeMagasin && element3.article.codeArticle == element.article.codeArticle){
                                concernedStockerMagCorres = element3;
                                exist2 = true;
                                exit;
                              }

                            });

                            if(exist1){
                              concernedStockerCarvMairie.quantiterStocker+=element.quantiteLignePlacement;
                              this.serviceCorres.editAStocker(concernedStockerCarvMairie.idStocker.toString(), concernedStockerCarvMairie).subscribe(
                                (data4) => {
                                  console.log('pase pase 1');
                                },
                                (erreur) => {
                                  console.log('Erreur lors de lEdition dUn stock', erreur);
                                }
                              );
                            }
                            else{
                              this.serviceCorres.addAStocker(new Stocker(element.quantiteLignePlacement, 0, 0, 0, element.article, this.carveauxMairie)).subscribe(
                                (data4) => {

                                },
                                (erreur) => {
                                  console.log('Erreur lors de lAjout dUn Stocker', erreur);
                                }
                              );
                            }

                            if(exist2){
                              concernedStockerMagCorres.quantiterStocker-=element.quantiteLignePlacement;
                              this.serviceCorres.editAStocker(concernedStockerMagCorres.idStocker.toString(), concernedStockerMagCorres).subscribe(
                                (data4) => {
                                  console.log('pase pase 2');
                                },
                                (erreur) => {
                                  console.log('Erreur lors de lEdition dUn stock', erreur);
                                }
                              );
                            }
                            else{
                              this.serviceCorres.addAStocker(new Stocker(element.quantiteLignePlacement*(-1), 0, 0, 0, element.article, this.magOfSelectedCorres)).subscribe(
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
                //console.log('Delete Res ', data8);
                if(!data8)
                this.serviceCorres.getAllStocker().subscribe(
                  (data3) => {
                    let exist1:boolean = false;
                    let exist2:boolean = false;
                    let concernedStockerCarvMairie:Stocker = null;
                    let concernedStockerMagCorres:Stocker = null;
                    data3.forEach(element3 => {
                      if(element3.magasin.codeMagasin == this.carveauxMairie.codeMagasin && element3.article.codeArticle == element.article.codeArticle){
                        concernedStockerCarvMairie = element3;
                        exist1 = true;
                        exit;
                      }
                      if(element3.magasin.codeMagasin == this.magOfSelectedCorres.codeMagasin && element3.article.codeArticle == element.article.codeArticle){
                        concernedStockerMagCorres = element3;
                        exist2 = true;
                        exit;
                      }

                    });

                    if(exist1){
                      concernedStockerCarvMairie.quantiterStocker+=element.quantiteLignePlacement;
                      this.serviceCorres.editAStocker(concernedStockerCarvMairie.idStocker.toString(), concernedStockerCarvMairie).subscribe(
                        (data4) => {
                          console.log('pase pase 3');
                        },
                        (erreur) => {
                          console.log('Erreur lors de lEdition dUn stock', erreur);
                        }
                      );
                    }
                    else{
                      this.serviceCorres.addAStocker(new Stocker(element.quantiteLignePlacement, 0, 0, 0, element.article, this.carveauxMairie)).subscribe(
                        (data4) => {

                        },
                        (erreur) => {
                          console.log('Erreur lors de lAjout dUn Stocker', erreur);
                        }
                      );
                    }

                    if(exist2){
                      concernedStockerMagCorres.quantiterStocker-=element.quantiteLignePlacement;
                      this.serviceCorres.editAStocker(concernedStockerMagCorres.idStocker.toString(), concernedStockerMagCorres).subscribe(
                        (data4) => {
                          console.log('pase pase 4');
                        },
                        (erreur) => {
                          console.log('Erreur lors de lEdition dUn stock', erreur);
                        }
                      );
                    }
                    else{
                      this.serviceCorres.addAStocker(new Stocker(element.quantiteLignePlacement*(-1), 0, 0, 0, element.article, this.magOfSelectedCorres)).subscribe(
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

  onConfirmAnnulerPlacement(){

    this.serviceCorres.getAllGerer().subscribe(
      (data) => {
        let finded:boolean = false;
        let concernedMagOfCorresp:Magasin = null;
        data.forEach(element => {
          if(element.magasinier.numMAgasinier == this.annulPlacement.correspondant.magasinier.numMAgasinier){
            concernedMagOfCorresp = element.magasin;
            finded = true;
            exit;
          }
        });

        if(finded){
          const pla = new Placement(this.annulPlacement.numPlacement, this.annulPlacement.datePlacement,
            this.annulPlacement.regisseur, this.annulPlacement.correspondant, this.annulPlacement.exercice);
          pla.validepl = false;
          //console.log('Element modifier',pla);
          this.servicePlacement.editAPlacement(this.annulPlacement.numPlacement, pla).subscribe(
            (data2) => {

              this.servicePlacement.getAllLignePlacement().subscribe(
                (data3) => {

                  data3.forEach(element3 => {
                    if(element3.placement.numPlacement == data2.numPlacement){
                      this.serviceCorres.getAllStocker().subscribe(
                        (data4) => {
                          let exist1:boolean = false;
                          let exist2:boolean = false;
                          let concernedStockerCarvMairie:Stocker = null;
                          let concernedStockerMagCorres:Stocker = null;
                          data4.forEach(element4 => {
                            if(element4.magasin.codeMagasin == this.carveauxMairie.codeMagasin && element4.article.codeArticle == element3.article.codeArticle){
                              concernedStockerCarvMairie = element4;
                              exist1 = true;
                              exit;
                            }
                            if(element4.magasin.codeMagasin == concernedMagOfCorresp.codeMagasin && element4.article.codeArticle == element3.article.codeArticle){
                              concernedStockerMagCorres = element4;
                              exist2 = true;
                              exit;
                            }

                          });

                          if(exist1){
                            concernedStockerCarvMairie.quantiterStocker+=element3.quantiteLignePlacement;
                            this.serviceCorres.editAStocker(concernedStockerCarvMairie.idStocker.toString(), concernedStockerCarvMairie).subscribe(
                              (data5) => {

                              },
                              (erreur) => {
                                console.log('Erreur lors de lEdition dUn stock', erreur);
                              }
                            );
                          }
                          else{
                            this.serviceCorres.addAStocker(new Stocker(element3.quantiteLignePlacement, 0, 0, 0, element3.article, this.carveauxMairie)).subscribe(
                              (data5) => {

                              },
                              (erreur) => {
                                console.log('Erreur lors de lAjout dUn Stocker', erreur);
                              }
                            );
                          }

                          if(exist2){
                            concernedStockerMagCorres.quantiterStocker-=element3.quantiteLignePlacement;
                            this.serviceCorres.editAStocker(concernedStockerMagCorres.idStocker.toString(), concernedStockerMagCorres).subscribe(
                              (data5) => {

                              },
                              (erreur) => {
                                console.log('Erreur lors de lEdition dUn stock', erreur);
                              }
                            );
                          }
                          else{
                            this.serviceCorres.addAStocker(new Stocker(element3.quantiteLignePlacement*(-1), 0, 0, 0, element3.article, this.magOfSelectedCorres)).subscribe(
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

              this.annulerPlaModal.hide();
              this.getAllPlacement();

            },
            (erreur) => {
              console.log('Erreur lors de la modification du placement', erreur);
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

  initPrintToPdfOfAnPlacem(inde:number){
    const placem = this.placements[inde];
    const doc = new jsPDF();
    let lignes = [];
    let plages:PlageNumArticle[] = [];
    let totalTTC;
    totalTTC = 0;

    this.plageNumArticles.forEach(element => {
      if(element.lignePlacement != null && element.lignePlacement.placement.numPlacement == placem.numPlacement){
        plages.push(element);
      }
    });

    this.servicePlacement.getAllLignePlacement().subscribe(
      (dataa) => {
        dataa.forEach(element => {
          if(element.placement.numPlacement == placem.numPlacement){
            let lig = [];
            lig.push(element.article.codeArticle);
            lig.push(element.article.libArticle);
            lig.push(element.quantiteLignePlacement);
            lig.push(element.pulignePlacement);
            lig.push(element.pulignePlacement*element.quantiteLignePlacement);
            let pla:String = '';
            let first:boolean = true;
            plages.forEach((element2, index) => {

              if(element2.lignePlacement.idLignePlacement == element.idLignePlacement){

                if(first == true){
                  pla = pla.concat(''+element2.numDebPlage+' à '+element2.numFinPlage+' ');
                  first = false;
                }
                else{
                  pla = pla.concat('| '+element2.numDebPlage+' à '+element2.numFinPlage+' ');

                }
              }
            });
            lig.push(pla);
            lignes.push(lig);
            totalTTC += element.pulignePlacement*element.quantiteLignePlacement;

          }

        });
        moment.locale('fr');
        /*doc.setDrawColor(0);
        doc.setFillColor(255, 255, 255);
        doc.roundedRect(50, 20, 120, 15, 3, 3, 'FD');
        //doc.setFont("Times New Roman");
        doc.setFontSize(22);
        doc.text('BON PLACEMENT', 75, 30);
        doc.setFontSize(14);*/

        doc.addImage(this.serviceTools.ente,'jpeg',0,0,200,30);

        doc.setDrawColor(0);
        doc.setFillColor(255, 255, 255);
        doc.roundedRect(50, 29, 110, 9, 3, 3, 'FD');
        //doc.setFont("Times New Roman");
        doc.setFontSize(15);
        doc.text('BON PLACEMENT', 79, 35);
        doc.setFontSize(12);

        doc.text('Référence : '+placem.numPlacement, 15, 45);
        doc.text('Date : '+moment(placem.datePlacement).format('DD/MM/YYYY') , 152, 45);
        doc.text('Correspondant : '+placem.correspondant.magasinier.nomMagasinier+' '+placem.correspondant.magasinier.prenomMagasinier, 15, 55);
        doc.text('Contact : (+229) '+placem.correspondant.magasinier.telMagasinier, 15, 65);
        doc.text('Régisseur : '+placem.regisseur.magasinier.nomMagasinier+' '+placem.regisseur.magasinier.prenomMagasinier, 15, 75);
        autoTable(doc, {
          theme: 'grid',
          head: [['Article', 'Désignation', 'Quantité', 'PU', 'Montant', 'Plage(s)']],
          headStyles:{
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
            ['Total TTC', totalTTC]
          ]
          ,
        });

        autoTable(doc, {
          theme: 'plain',
          margin: { top: 100 },
          columnStyles: {
            0: { textColor: 0, fontStyle: 'bold', halign: 'center' },
            2: { textColor: 0, fontStyle: 'bold', halign: 'center' },
          },
          body: [
            ['Le Correspondant\n\n\n\n\n'+placem.correspondant.magasinier.nomMagasinier+' '+placem.correspondant.magasinier.prenomMagasinier,
            '\t\t\t\t\t\t\t\t\t\t\t\t',
             'Le Régisseur\n\n\n\n\n'+this.serviceUtilisateur.connectedUser.nomUtilisateur+' '+this.serviceUtilisateur.connectedUser.prenomUtilisateur]
          ]
          ,
        });

        /*let tabSignataire = [];
        
        Tools2Service.getSignatairesOfAdocAtAmoment(this.codeDoc, placem.datePlacement, this.listOccuper, this.listSigner)
        .forEach(elementSign => {
          tabSignataire.push(elementSign.post.libPost+'\n\n\n\n\n'+elementSign.personne.nomPers+' '+elementSign.personne.prenomPers);
        });

        tabSignataire.push('Le Correspondant'+'\n\n\n\n\n'+placem.correspondant.magasinier.nomMagasinier+' '+placem.correspondant.magasinier.prenomMagasinier);

        autoTable(doc, {
          theme: 'plain',
          margin: { top: 100 },
          columnStyles: {
            0: { textColor: 0, fontStyle: 'bold', halign: 'center' },
            2: { textColor: 0, fontStyle: 'bold', halign: 'left' },
          },
          body: [
              tabSignataire
            ,
          ]
          ,
        });*/



        //doc.autoPrint();
        this.pdfToShow = this.sanitizer.bypassSecurityTrustResourceUrl(doc.output('datauristring', {filename:'bonAppro.pdf'}));
        this.viewPdfModal.show();
      },
      (erreur) => {
        console.log('Erreur lors de la récupération des lignes de placement', erreur);
      }
    );


  }

}
