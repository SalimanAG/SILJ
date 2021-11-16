import { Component, Injectable, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {ModalDirective} from 'ngx-bootstrap/modal';
import { exit } from 'process';
import { Observable, Subject } from 'rxjs';
import { Article } from '../../../../models/article.model';
import { Commande } from '../../../../models/commande.model';
import { Exercice } from '../../../../models/exercice.model';
import { Famille } from '../../../../models/famille.model';
import { Fournisseur } from '../../../../models/fournisseur.model';
import { LigneCommande } from '../../../../models/ligneCommande.model';
import { LigneReception } from '../../../../models/ligneReception.model';
import { Reception } from '../../../../models/reception.model';
import { Uniter } from '../../../../models/uniter.model';
import { ExerciceService } from '../../../../services/administration/exercice.service';
import { ArticleService } from '../../../../services/definition/article.service';
import { FournisseurService } from '../../../../services/definition/fournisseur.service';
import { CommandeService } from '../../../../services/saisie/commande.service';
import { ReceptionService } from '../../../../services/saisie/reception.service';
import {jsPDF} from 'jspdf';
import autoTable from 'jspdf-autotable'
import { DomSanitizer } from '@angular/platform-browser';
import { UtilisateurService } from '../../../../services/administration/utilisateur.service';
import * as moment from 'moment';
import { Magasin } from '../../../../models/magasin.model';
import { CorrespondantService } from '../../../../services/definition/correspondant.service';
import { RegisseurService } from '../../../../services/definition/regisseur.service';
import { Stocker } from '../../../../models/stocker.model';
import { TresorierCommunalService } from '../../../../services/definition/tresorier-communal.service';
import { data } from 'jquery';
import { ToolsService } from '../../../../services/utilities/tools.service';
import { PlageNumDispo } from '../../../../models/PlageNumDispo';
import { PlageNumDispoService } from '../../../../services/saisie/PlageNumDispo.service';
import { SignataireService } from '../../../../services/administration/signataire-service.service';
import { Signer } from '../../../../models/signer.model';
import { Occuper } from '../../../../models/occuper.model';
import { Tools2Service } from '../../../../services/utilities/tools2.service';

@Component({
  selector: 'app-reception',
  templateUrl: './reception.component.html',
  styleUrls: ['./reception.component.css']
})
@Injectable({
  providedIn: 'root'
})
export class ReceptionComponent implements OnInit {

  //Commune
  @ViewChild('addComModal') public addComModal: ModalDirective;
  @ViewChild('editComModal') public editComModal: ModalDirective;
  @ViewChild('deleteComModal') public deleteComModal: ModalDirective;
  @ViewChild('addArticle1') public addArticle1: ModalDirective;
  @ViewChild('addArticle2') public addArticle2: ModalDirective;
  @ViewChild('viewPdfModal') public viewPdfModal: ModalDirective;
  @ViewChild('annulerReceptModal') public annulerReceptModal: ModalDirective;

  dtOptions1: DataTables.Settings = {};
  dtOptions2: DataTables.Settings = {};
  dtOptions3: DataTables.Settings = {};
  dtTrigger1: Subject<any> = new Subject<any>();
  dtTrigger2: Subject<any> = new Subject<any>();
  dtTrigger3: Subject<any> = new Subject<any>();

  receptions:Reception[];
  ligneReceptions:LigneReception[];
  concernedCommande:Commande = new Commande('', new Date(), '', 0, new Fournisseur('', '', '', '', '', '', ''), new Exercice('', '', new Date(), new Date(), '', false));
  articlesOfAConcernedCommandeAddingRecept:Article[] = [];
  articlesOfAConcernedCommandeEditingRecept:Article[] = [];

  editReception:Reception = new Reception('', '', new Date(), new Exercice('', '', new Date(), new Date(), '', false));
  suprReception:Reception = new Reception('', '', new Date(), new Exercice('', '', new Date(), new Date(), '', false));
  annulReception:Reception = new Reception('', '', new Date(), new Exercice('', '', new Date(), new Date(), '', false));

  tempAddLigneReception:LigneReception[] = [];
  tempEditLigneReception:LigneReception[] = [];

  commandes:Commande[] = [];
  addReceptionFormGroup:FormGroup;
  editReceptionFormGroup:FormGroup;
  editCommande:Commande = new Commande('', new Date(), '', 0, new Fournisseur('', '', '', '', '', '', ''), new Exercice('', '', new Date(), new Date(), '', false));
  suprCommande:Commande = new Commande('', new Date(), '', 0, new Fournisseur('', '', '', '', '', '', ''), new Exercice('', '', new Date(), new Date(), '', false));

  plaeDispo : PlageNumDispo = new PlageNumDispo(null,null,null,null,null,null,null,null,null,null,null);
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
  oldReceptionLines:LigneReception[] = [];

  exercices:Exercice[] = [];
  articles:Article[] = [];
  fournisseurs:Fournisseur[] = [];
  carveauxTresor:Magasin = new Magasin('', '');

  pdfToShow = null;

  codeDoc = 'PR';
  listSigner: Signer[] = [];
  listOccuper: Occuper[] = [];

  constructor(private serviceCommande:CommandeService, private serviceExercice:ExerciceService,
    private serviceFrs:FournisseurService, private serviceArticle:ArticleService, private serviceReception:ReceptionService,
    private formBulder:FormBuilder, private sanitizer:DomSanitizer, private serviceUser:UtilisateurService,
    private serviceCorres:CorrespondantService, private serviceTresorier:TresorierCommunalService,
    private serviceTools:ToolsService, public disPlaNum : PlageNumDispoService, public pnds : PlageNumDispoService
    , private serviceSignataire: SignataireService) {
      this.getAllLigneReception();
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
    this.addReceptionFormGroup = this.formBulder.group({
      addNumReception:'',
      addObservation:'',
      addDateReception:[moment(Date.now()).format('yyyy-MM-DD'), Validators.required],
      addCommande:[0, Validators.required]
    });

    this.editReceptionFormGroup = this.formBulder.group({
      editNumReception:'',
      editObservation:'',
      editDateReception:[new Date(), Validators.required],
      editCommande:[0, Validators.required]
    });
  }

  ngOnInit(): void {

    this.getAllFrs();
    this.getAllLigneCommande();
    this.getAllExercice();
    this.getCarveauTresor();
    this.getAllSigner();
    this.getAllOccuper();

    this.serviceArticle.getAllArticle().subscribe(
      (data) => {
        this.articles = data;
        /*this.dtTrigger2.next();
        this.dtTrigger3.next();*/
      },
      (erreur) => {
        console.log('Erreur lors de la récupération de la liste des articles', erreur);
      }
    );

    this.serviceCommande.getAllCommande().subscribe(
      (data) => {
        this.commandes = data;

      },
      (erreur) => {
        console.log('Erreur lors de la récupération de liste des commandes', erreur);
      }
    );

    this.serviceReception.getAllReception().subscribe(
      (data) => {
        this.receptions = data;
        this.dtTrigger1.next();
      },
      (erreur) => {
        console.log('Erreur lors de la récupération de la liste des réceptions', erreur);
      }
    );

    this.getAllLigneReception();

    //console.log('Daaaaaate', this.serviceTools.addDayToDate(new Date(), 4));

  }

  //Récuperer le carveau Trésor
  getCarveauTresor(){
    this.serviceTresorier.getAllTresCom().subscribe(
      (data) => {
        console.log('trsCom', data);
        data.forEach(element => {
          let finded:boolean = false;
          this.serviceCorres.getAllGerer().subscribe(
            (data2) => {
              //console.log('Gerers', data2);
              data2.forEach(element2 => {
                if(element2.magasinier.numMAgasinier == element.magasinier.numMAgasinier){
                  this.carveauxTresor = element2.magasin;
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

  getCommandeOfAReception(code:String):Commande{
    //let finded:boolean = false;
    let comm:Commande = new Commande('', new Date(), '', 0, new Fournisseur('', '', '', '', '', '', ''), new Exercice('', '', new Date(), new Date(), '', false));;
    this.ligneReceptions.forEach(element => {
      //console.log(this.ligneReceptions, code, element.reception.numReception, element.reception.numReception==code);
      if(element.reception.numReception==code){
        //finded = true;

        comm = element.ligneCommande.numCommande;
      }
    });
    //console.log(comm);
    return comm;

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

  getAllReception(){
    this.serviceReception.getAllReception().subscribe(
      (data) => {
        this.receptions = data;
        $('#dataTable1').dataTable().api().destroy();
        this.dtTrigger1.next();
      },
      (erreur) => {
        console.log('Erreur lors de la récupération de la liste des réceptions', erreur);
      }
    );
  }

  getAllLigneReception(){
    this.serviceReception.getAllLigneReception().subscribe(
      (data) => {
        this.ligneReceptions = data;
        //console.log(this.ligneReceptions);

      },
      (erreur) => {
        console.log('Erreur lors de la récupération de la liste des lignes de réception', erreur);
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

  onShowAddArticleModalAddingReception(){
    this.articlesOfAConcernedCommandeAddingRecept = [];
    this.tempAddLigneCommandes = [];
    this.serviceCommande.getAllLigneCommande().subscribe(
      (data) => {
        this.ligneCommandes = data;

        this.ligneCommandes.forEach(element => {
          if(element.numCommande.numCommande == this.concernedCommande.numCommande){
            this.tempAddLigneCommandes.push(element);
            this.articlesOfAConcernedCommandeAddingRecept.push(element.article);
          }
        });
      },
      (erreur) => {
        console.log('Erreur lors de la récuparation de la liste des lignes de commande', erreur);
      }
    );
    this.addArticle1.show();


  }

  onShowAddArticleModalEditingReception(){
    this.articlesOfAConcernedCommandeEditingRecept = [];
    this.tempEditLigneCommandes = [];
    this.serviceCommande.getAllLigneCommande().subscribe(
      (data) => {
        this.ligneCommandes = data;

        this.ligneCommandes.forEach(element => {
          if(element.numCommande.numCommande == this.concernedCommande.numCommande){
            this.tempEditLigneCommandes.push(element);
            this.articlesOfAConcernedCommandeEditingRecept.push(element.article);
          }
        });
      },
      (erreur) => {
        console.log('Erreur lors de la récuparation de la liste des lignes de commande', erreur);
      }
    );
    this.addArticle2.show();


  }

  onConcernedCommandSelected(){
    this.tempAddLigneReception = [];
    if(this.commandes.length!=0){

      this.concernedCommande = this.commandes[this.addReceptionFormGroup.value['addCommande']];
      this.addReceptionFormGroup.patchValue({
        addDateReception: moment(this.serviceTools.addDayToDate(this.concernedCommande.dateRemise, this.concernedCommande.delaiLivraison)).format('yyyy-MM-DD')
      });
      //console.log('daaaaate', this.concernedCommande.dateRemise, this.concernedCommande.delaiLivraison, this.concernedCommande.dateRemise.valueOf(), new Date(this.concernedCommande.dateRemise),this.serviceTools.addDayToDate(this.concernedCommande.dateRemise, 1));
    }
  }

  onConcernedCommandSelected2(){
    this.tempEditLigneReception = [];
    if(this.commandes.length!=0){

      this.concernedCommande = this.commandes[this.editReceptionFormGroup.value['editCommande']];
    }
  }

  addArticleForAddingOfRecept1(inde:number){
    let exist:boolean = false;
    this.tempAddLigneReception.forEach(element => {
      if(element.ligneCommande.article.codeArticle==this.articlesOfAConcernedCommandeAddingRecept[inde].codeArticle){
        exist = true;
        exit;
      }
    });

    if(exist===false){
      this.tempAddLigneReception.push(
        new LigneReception(this.tempAddLigneCommandes[inde].qteLigneCommande,
          this.tempAddLigneCommandes[inde].puligneCommande,
          '', 0, 0, this.tempAddLigneCommandes[inde], new Reception('', '', new Date(), new Exercice('', '', new Date(), new Date(), '', false)))
      );
    }


  }

  addArticleForEditingOfRecept1(inde:number){
    let exist:boolean = false;
    this.tempEditLigneReception.forEach(element => {
      if(element.ligneCommande.article.codeArticle==this.articlesOfAConcernedCommandeEditingRecept[inde].codeArticle){
        exist = true;
        exit;
      }
    });

    if(exist===false){
      this.tempEditLigneReception.push(
        new LigneReception(this.tempEditLigneCommandes[inde].qteLigneCommande,
          this.tempEditLigneCommandes[inde].puligneCommande,
          '', 0, 0, this.tempEditLigneCommandes[inde], new Reception('', '', new Date(), new Exercice('', '', new Date(), new Date(), '', false)))
      );
    }

  }

  popArticleAddingOfRecept1(inde:number){
    this.tempAddLigneReception.splice(inde, 1);
  }

  definirNumFin(n: number){
    if(this.tempAddLigneReception[n].quantiteLigneReception>0 &&
      this.tempAddLigneReception[n].numSerieDebLigneReception>0){
        this.tempAddLigneReception[n].numSerieFinLigneReception=
        this.tempAddLigneReception[n].numSerieDebLigneReception+
        this.tempAddLigneReception[n].quantiteLigneReception-1;
    }
  }

  popArticleEditingOfRecept1(inde:number){
    this.tempEditLigneReception.splice(inde, 1);
  }

  initAddReception(){
    this.onConcernedCommandSelected();
    this.addComModal.show()
  }

  initEditReception(inde:number){

    this.onConcernedCommandSelected();
    this.tempEditLigneReception = [];
    this.editReception = this.receptions[inde];
    this.serviceReception.getAllLigneReception().subscribe(
      (data) => {
        this.ligneReceptions = data;
        data.forEach(element => {
          if(element.reception.numReception==this.editReception.numReception){
            this.tempEditLigneReception.push(element);
          }
        });
      },
      (erreur) => {
        console.log('Erreur lors de la récupération de la liste des lignes de réception', erreur);
      }
    );

    this.serviceReception.getAllLigneReception().subscribe(
      (data) => {
        data.forEach(element => {
          if(element.reception.numReception==this.editReception.numReception){
            this.oldReceptionLines.push(element);
          }
        });

        console.log('encien', this.oldReceptionLines);

      },
      (erreur) => {
        console.log('Erreur lors de la récupération de la liste des lignes de réception', erreur);
      }
    );

    this.editComModal.show();
  }

  initAnnulerPlacement(inde:number){

    this.annulReception = this.receptions[inde];
    this.annulerReceptModal.show();
  }

  initDeleteReception(inde:number){
    this.suprReception = this.receptions[inde];
    this.deleteComModal.show();
  }

  onSubmitAddReceptionFormsGroup(){

    const newRecept = new Reception(this.addReceptionFormGroup.value['addNumReception'],
    this.addReceptionFormGroup.value['addObservation'], this.addReceptionFormGroup.value['addDateReception'], this.serviceExercice.exoSelectionner);

    this.serviceReception.addAReception(newRecept).subscribe(
      (data) => {

        this.tempAddLigneReception.forEach((element, inde) => {
          element.reception = data;
          //console.log('Ligne++++', element);
          this.serviceReception.addALigneReception(element).subscribe(
            (data2) => {
              this.tempAddLigneReception.splice(inde);
              this.serviceCorres.getAllStocker().subscribe(
                (data3) => {
                  let exist:boolean = false;
                  let concernedStocker:Stocker = null;
                  data3.forEach(element3 => {
                    if(element3.magasin.codeMagasin == this.carveauxTresor.codeMagasin && element3.article.codeArticle == data2.ligneCommande.article.codeArticle){
                      concernedStocker = element3;
                      exist = true;
                      exit;
                    }
                  });

                  if(exist){
                    concernedStocker.quantiterStocker+=data2.quantiteLigneReception;
                    this.serviceCorres.editAStocker(concernedStocker.idStocker.toString(), concernedStocker).subscribe(
                      (data4) => {
                        if(element.ligneCommande.article.numSerieArticle == true){
                          let pnd = new PlageNumDispo(element.numSerieDebLigneReception,element.numSerieDebLigneReception,
                            element.numSerieFinLigneReception, element.numSerieFinLigneReception, element.reception.exercice,
                            element.ligneCommande.article,new Magasin('CT', 'Caveau trésor'), data, null,null, null);
                            console.log(pnd);

                          this.disPlaNum.addPND(pnd).subscribe(
                            data=>{
                              console.log('Ajout réussi');
                            },
                            errlr=>{
                              console.log("Ajout de numéro de série échoué");
                            }
                          );
                        }
                      },
                      (erreur) => {
                        console.log('Erreur lors de la modification dUn stock', erreur);
                      }
                    );
                  }
                  else{
                    this.serviceCorres.addAStocker(new Stocker(data2.quantiteLigneReception, 0, 0, 0, data2.ligneCommande.article, this.carveauxTresor)).subscribe(
                      (data4) => {

                      },
                      (erreur) => {
                        console.log('Erreur lors de lAjout dun stock', erreur);
                      }
                    );
                  }
                },
                (erreur) => {
                  console.log('Erreur lors de la récupératio de la liste des stockers', erreur);
                }
              );
            },
            (erreur) => {
              console.log('Erreur lors de lAjout des lignes de la réception', erreur);
            }
          );
        });

        this.addComModal.hide();
        this.getAllLigneCommande();
        this.serviceReception.getAllLigneReception().subscribe(
          (data) => {
            this.ligneReceptions = data;
            //console.log(this.ligneReceptions);
            this.getAllReception();
          },
          (erreur) => {
            console.log('Erreur lors de la récupération de la liste des lignes de réception', erreur);
          }
        );



      },
      (erreur) => {
        console.log('Erreur lors lEnrégistrement de la Réception', erreur);
      }
    );




  }

  onSubmitEditReceptionFormsGroup(){

    const newRecept = new Reception(this.editReceptionFormGroup.value['editNumReception'],
    this.editReceptionFormGroup.value['editObservation'], this.editReceptionFormGroup.value['editDateReception'], this.serviceExercice.exoSelectionner);



    this.serviceReception.editAReception(this.editReception.numReception, newRecept).subscribe(
      (data) => {

        //Pour ajout et ou modification des lignes
        this.tempEditLigneReception.forEach(element => {
          let added:boolean = true;
          let concernedOldLigneRecept:LigneReception = null;
          this.oldReceptionLines.forEach(element2 => {
            //attention pour le raisonnement selon le code d'article
            if(element.ligneCommande.article.codeArticle==element2.ligneCommande.article.codeArticle){
              added = false;
              element.reception = data;
              concernedOldLigneRecept = element2;

              this.serviceReception.editALigneReception(element2.idLigneReception.toString(), element).subscribe(
                (data2) => {

                  this.serviceCorres.getAllStocker().subscribe(
                    (data3) => {
                      let exist:boolean = false;
                      let concernedStocker:Stocker = null;
                      data3.forEach(element3 => {
                        if(element3.magasin.codeMagasin == this.carveauxTresor.codeMagasin && element3.article.codeArticle == data2.ligneCommande.article.codeArticle){
                          concernedStocker = element3;
                          exist = true;
                          exit;
                        }
                      });

                      if(exist){
                        //console.log('passed1', concernedStocker, 'passed1', data2, 'passed1', concernedOldLigneRecept);
                        concernedStocker.quantiterStocker = concernedStocker.quantiterStocker + data2.quantiteLigneReception - concernedOldLigneRecept.quantiteLigneReception;
                        //console.log('passed2', concernedStocker);
                        this.serviceCorres.editAStocker(concernedStocker.idStocker.toString(), concernedStocker).subscribe(
                          (data4) => {

                          },
                          (erreur) => {
                            console.log('Erreur lors de la modification dUn stock', erreur);
                          }
                        );
                      }
                      else{
                        this.serviceCorres.addAStocker(new Stocker(data2.quantiteLigneReception, 0, 0, 0, data2.ligneCommande.article, this.carveauxTresor)).subscribe(
                          (data4) => {

                          },
                          (erreur) => {
                            console.log('Erreur lors de lAjout dun stock', erreur);
                          }
                        );
                      }
                    },
                    (erreur) => {
                      console.log('Erreur lors de la récupération de la liste des stockers', erreur);
                    }
                  );
                },
                (erreur) => {
                  console.log('Erreur lors de la modification de ligne de Réception', erreur);
                }
              );
              exit;
            }
          });

          if(added===true){
            element.reception = data;
            this.serviceReception.addALigneReception(element).subscribe(
              (data3) => {
                this.serviceCorres.getAllStocker().subscribe(
                  (data4) => {
                    let exist:boolean = false;
                    let concernedStocker:Stocker = null;
                    data4.forEach(element4 => {
                      if(element4.magasin.codeMagasin == this.carveauxTresor.codeMagasin && element4.article.codeArticle == data3.ligneCommande.article.codeArticle){
                        concernedStocker = element4;
                        exist = true;
                        exit;
                      }
                    });

                    if(exist){
                      concernedStocker.quantiterStocker+=data3.quantiteLigneReception;
                      this.serviceCorres.editAStocker(concernedStocker.idStocker.toString(), concernedStocker).subscribe(
                        (data5) => {

                        },
                        (erreur) => {
                          console.log('Erreur lors de la modification dUn stock', erreur);
                        }
                      );
                    }
                    else{
                      this.serviceCorres.addAStocker(new Stocker(data3.quantiteLigneReception, 0, 0, 0, data3.ligneCommande.article, this.carveauxTresor)).subscribe(
                        (data5) => {

                        },
                        (erreur) => {
                          console.log('Erreur lors de lAjout dun stock', erreur);
                        }
                      );
                    }
                  },
                  (erreur) => {
                    console.log('Erreur lors de la récupératio de la liste des stockers', erreur);
                  }
                );
              },
              (erreur) => {
                console.log('Erreur lors de la création dUne nouvelle ligne pour lEdition', erreur)
              }
            );
          }

        });


        //Pour suppression des lignes suprimés
        this.oldReceptionLines.forEach(element => {
          let deleted:boolean = true;
          this.tempEditLigneReception.forEach(element2 => {

            if(element.ligneCommande.article.codeArticle==element2.ligneCommande.article.codeArticle){
              deleted = false;
              exit;
            }

          });

          if(deleted===true){
            this.serviceReception.deleteALigneReception(element.idLigneReception.toString()).subscribe(
              (data) => {
                this.serviceCorres.getAllStocker().subscribe(
                  (data3) => {
                    let exist:boolean = false;
                    let concernedStocker:Stocker = null;
                    data3.forEach(element3 => {
                      if(element3.magasin.codeMagasin == this.carveauxTresor.codeMagasin && element3.article.codeArticle == element.ligneCommande.article.codeArticle){
                        concernedStocker = element3;
                        exist = true;
                        exit;
                      }
                    });

                    if(exist){
                      concernedStocker.quantiterStocker -= element.quantiteLigneReception;
                      this.serviceCorres.editAStocker(concernedStocker.idStocker.toString(), concernedStocker).subscribe(
                        (data4) => {

                        },
                        (erreur) => {
                          console.log('Erreur lors de la modification dUn stock', erreur);
                        }
                      );
                    }
                    else{
                      this.serviceCorres.addAStocker(new Stocker(element.quantiteLigneReception*(-1), 0, 0, 0, element.ligneCommande.article, this.carveauxTresor)).subscribe(
                        (data4) => {

                        },
                        (erreur) => {
                          console.log('Erreur lors de lAjout dun stock', erreur);
                        }
                      );
                    }
                  },
                  (erreur) => {
                    console.log('Erreur lors de la récupératio de la liste des stockers', erreur);
                  }
                );
              },
              (erreur) => {
                console.log('Erreur lors de la suppression de la ligne', erreur);
              }
            );
          }

        });

        this.editComModal.hide();

        this.getAllReception();
        this.getAllLigneReception();

      },
      (erreur) => {
        console.log('Erreur lors de lEdition de la Reception', erreur);
      }
    );



  }

  onConfirmDeleteReception(){
    this.serviceReception.getAllLigneReception().subscribe(
      (data) => {
        this.ligneReceptions = data;
        //console.log(this.ligneReceptions);
        let finded:boolean=false;
        let obser:Observable<boolean>;
        this.ligneReceptions.forEach(element => {
          if(element.reception.numReception==this.suprReception.numReception){
            this.serviceReception.deleteALigneReception(element.idLigneReception.toString()).subscribe(
              (data2)=>{

                this.serviceReception.deleteAReception(this.suprReception.numReception).subscribe(
                  (data3) => {
                    this.getAllLigneReception();
                    this.deleteComModal.hide();
                    this.getAllReception();

                  },
                  (erreur) => {
                    console.log('Erreur lors de la suppression de la Réception', erreur);
                  }
                );
              },
              (erreur) => {
                console.log('Erreur lors de la suppression de la ligne dUne Réception', erreur);
              }
            );
          }
        });

        if(finded==false){
          this.serviceReception.deleteAReception(this.suprReception.numReception).subscribe(
            (data) => {
              this.deleteComModal.hide();
              this.getAllReception();
              this.getAllLigneReception();
            },
            (erreur) => {
              console.log('Erreur lors de la suppression de la Réception', erreur);
            }
          );
        }


      },
      (erreur) => {
        console.log('Erreur lors de la récupération de la liste des lignes de réception', erreur);
      }
    );

  }

  onConfirmAnnulerReception(){
    let recept:Reception = new Reception(this.annulReception.numReception, this.annulReception.observation, this.annulReception.dateReception, this.annulReception.exercice);

    recept.valideRecep = false;
    this.serviceReception.getAllLigneReception().subscribe(
      (data) => {

        this.serviceReception.editAReception(this.annulReception.numReception, recept).subscribe(
          (data1) => {

            data.forEach(element => {
              if(element.reception.numReception == data1.numReception){

                this.serviceCorres.getAllStocker().subscribe(
                  (data3) => {
                    let exist:boolean = false;
                    let concernedStocker:Stocker = null;
                    data3.forEach(element3 => {
                      if(element3.magasin.codeMagasin == this.carveauxTresor.codeMagasin && element3.article.codeArticle == element.ligneCommande.article.codeArticle){
                        concernedStocker = element3;
                        exist = true;
                        exit;
                      }
                    });

                    if(exist){
                      concernedStocker.quantiterStocker-=element.quantiteLigneReception;
                      this.serviceCorres.editAStocker(concernedStocker.idStocker.toString(), concernedStocker).subscribe(
                        (data4) => {

                        },
                        (erreur) => {
                          console.log('Erreur lors de la modification dUn stock', erreur);
                        }
                      );
                    }
                    else{
                      this.serviceCorres.addAStocker(new Stocker(element.quantiteLigneReception*(-1), 0, 0, 0, element.ligneCommande.article, this.carveauxTresor)).subscribe(
                        (data4) => {

                        },
                        (erreur) => {
                          console.log('Erreur lors de lAjout dun stock', erreur);
                        }
                      );
                    }
                  },
                  (erreur) => {
                    console.log('Erreur lors de la récupératio de la liste des stockers', erreur);
                  }
                );
              }
            });

            this.annulerReceptModal.hide();
            this.getAllReception();

          },
          (erreur) => {
            console.log('Erreur lors de la modification de la réception', erreur);
          }
        );

      },
      (erreur) => {
        console.log('Erreur lors de la récupération des lignes de reception', erreur);
      }
    );


  }

  initPrintPdfOfAnReception(inde:number){
    const reception = this.receptions[inde];
    let receptComm = new Commande('', new Date(), '', 0, new Fournisseur('', '', '', '', '', '', ''), new Exercice('', '', new Date(), new Date(), '', false));
    const doc = new jsPDF();
    let lignes = [];
    let totalHT, totalTTC, totalRemise, totalTVA;
    totalHT = 0;
    totalRemise = 0;
    totalTVA = 0;
    totalTTC = 0;

    this.serviceReception.getAllLigneReception().subscribe(
      (data) => {
        this.ligneReceptions = data;
        this.ligneReceptions.forEach(element => {
          if(element.reception.numReception == reception.numReception){
            let lig = [];
            receptComm = element.ligneCommande.numCommande;
            lig.push(element.ligneCommande.article.codeArticle);
            lig.push(element.ligneCommande.article.libArticle);
            lig.push(element.quantiteLigneReception);
            lig.push(element.puligneReception);
            lig.push(element.ligneCommande.tva);
            lig.push(element.ligneCommande.remise);
            lig.push(element.puligneReception*element.quantiteLigneReception*(1+(element.ligneCommande.tva/100))-element.ligneCommande.remise);
            lig.push(element.numSerieDebLigneReception.toString()+'  à  '+element.numSerieFinLigneReception.toString());
            lig.push(element.observationLigneReception);
            lignes.push(lig);

            totalRemise += element.ligneCommande.remise;
            totalTVA += element.puligneReception*element.quantiteLigneReception*(element.ligneCommande.tva/100);
            totalHT += element.puligneReception*element.quantiteLigneReception;
            totalTTC += element.puligneReception*element.quantiteLigneReception*(1+(element.ligneCommande.tva/100))-element.ligneCommande.remise;

          }

        });
        moment.locale('fr');
        /*doc.setDrawColor(0);
        doc.setFillColor(255, 255, 255);
        doc.roundedRect(50, 20, 110, 15, 3, 3, 'FD');
        //doc.setFont("Times New Roman");
        doc.setFontSize(25);
        doc.text('RECEPTION ACHAT', 60, 30);
        doc.setFontSize(14);*/

        doc.addImage(this.serviceTools.ente,'jpeg',0,0,200,30);

        doc.setDrawColor(0);
        doc.setFillColor(255, 255, 255);
        doc.roundedRect(50, 29, 110, 9, 3, 3, 'FD');
        //doc.setFont("Times New Roman");
        doc.setFontSize(15);
        doc.text('RECEPTION ACHAT', 75, 35);
        doc.setFontSize(12);

        doc.text('Référence : '+reception.numReception, 15, 45);
        doc.text('Date : '+moment(reception.dateReception).format('DD/MM/YYYY') , 152, 45);
        doc.text('Commande : '+receptComm.numCommande+'\tDu\t'+moment(receptComm.dateCommande).format('DD/MM/YYYY'), 15, 55);
        doc.text('Date de Réception prévue: '+moment(this.serviceTools.addDayToDate(receptComm.dateRemise, receptComm.delaiLivraison)).format('DD/MM/YYYY') , 15, 65);
        doc.text('Fournisseur : '+receptComm.frs.identiteFrs, 15, 75);
        doc.text('N° IFU Fournisseur : '+receptComm.frs.numIfuFrs, 15, 85);
        doc.text('Observation : '+reception.observation, 15, 95);
        autoTable(doc, {
          theme: 'grid',
          head: [['Article', 'Désignation', 'Quantité', 'PU', 'TVA(en %)', 'Remise', 'Montant TTC', 'Plage', 'Obs.']],
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
            ['Total HT', totalHT],
            ['Total Montant TVA', totalTVA],
            ['Total Remise', totalRemise],
            ['Total TTC', totalTTC]
          ]
          ,
        });

        /*autoTable(doc, {
          theme: 'plain',
          margin: { top: 100 },
          columnStyles: {
            0: { textColor: 0, fontStyle: 'bold', halign: 'center' },
            2: { textColor: 0, fontStyle: 'bold', halign: 'center' },
          },
          body: [
            ['Le Trésorier Communal\n\n\n\n\n',
            '\t\t\t\t\t\t\t\t\t\t\t\t\t',
             'Le Fournisseur\n\n\n\n\n'+receptComm.frs.identiteFrs]
          ]
          ,
        });*/

        let tabSignataire = [];

        Tools2Service.getSignatairesOfAdocAtAmoment(this.codeDoc, reception.dateReception, this.listOccuper, this.listSigner)
        .forEach(elementSign => {
          tabSignataire.push(elementSign.post.libPost+'\n\n\n\n\n'+elementSign.personne.nomPers+' '+elementSign.personne.prenomPers);
        });

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
        });


        //doc.autoPrint();
        //doc.output('dataurlnewwindow');
        this.pdfToShow = this.sanitizer.bypassSecurityTrustResourceUrl(doc.output('datauristring', {filename:'bonCommande.pdf'}));
        this.viewPdfModal.show();


      },
      (erreur) => {
        console.log('Erreur lors de la récupération de la liste des lignes de réception', erreur);
      }
    );


  }

}
