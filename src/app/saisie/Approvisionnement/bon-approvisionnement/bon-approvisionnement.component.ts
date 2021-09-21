import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { data } from 'jquery';
import {ModalDirective} from 'ngx-bootstrap/modal';
import { exit } from 'process';
import { element } from 'protractor';
import { Subject } from 'rxjs';
import { Approvisionnement } from '../../../../models/approvisionnement.model';
import { Article } from '../../../../models/article.model';
import { DemandeApprovisionnement } from '../../../../models/demandeApprovisionnement.model';
import { Exercice } from '../../../../models/exercice.model';
import { Famille } from '../../../../models/famille.model';
import { LigneAppro } from '../../../../models/ligneAppro.model';
import { LigneDemandeAppro } from '../../../../models/ligneDemandeAppro.model';
import { PlageNumArticle } from '../../../../models/plageNumArticle.model';
import { Uniter } from '../../../../models/uniter.model';
import { ExerciceService } from '../../../../services/administration/exercice.service';
import { ArticleService } from '../../../../services/definition/article.service';
import { BonApproService } from '../../../../services/saisie/bon-appro.service';
import { DemandeApproService } from '../../../../services/saisie/demande-appro.service';
import {jsPDF} from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DomSanitizer } from '@angular/platform-browser';
import * as moment from  'moment';
import { Magasin } from '../../../../models/magasin.model';
import { CorrespondantService } from '../../../../services/definition/correspondant.service';
import { RegisseurService } from '../../../../services/definition/regisseur.service';
import { TresorierCommunalService } from '../../../../services/definition/tresorier-communal.service';
import { Stocker } from '../../../../models/stocker.model';
import { PlageNumDispoService } from '../../../../services/saisie/PlageNumDispo.service';
import { PlageNumDispo } from '../../../../models/PlageNumDispo';
import { ToolsService } from '../../../../services/utilities/tools.service';
import { Occuper } from '../../../../models/occuper.model';
import { SignataireService } from '../../../../services/administration/signataire-service.service';
import { Signer } from '../../../../models/signer.model';
import { Tools2Service } from '../../../../services/utilities/tools2.service';

@Component({
  selector: 'app-bon-approvisionnement',
  templateUrl: './bon-approvisionnement.component.html',
  styleUrls: ['./bon-approvisionnement.component.css']
})
export class BonApprovisionnementComponent  implements OnInit {


  @ViewChild('addComModal') public addComModal: ModalDirective;
  @ViewChild('editComModal') public editComModal: ModalDirective;
  @ViewChild('deleteComModal') public deleteComModal: ModalDirective;
  @ViewChild('addArticle1') public addArticle1: ModalDirective;
  @ViewChild('addArticle2') public addArticle2: ModalDirective;
  @ViewChild('viewPdfModal') public viewPdfModal: ModalDirective;
  @ViewChild('annulerApproModal') public annulerApproModal: ModalDirective;


  dtOptions1: DataTables.Settings = {};
  dtOptions2: DataTables.Settings = {};
  dtOptions3: DataTables.Settings = {};
  dtTrigger1: Subject<any> = new Subject<any>();
  dtTrigger2: Subject<any> = new Subject<any>();
  dtTrigger3: Subject<any> = new Subject<any>();


  demandeAppros:DemandeApprovisionnement[];
  addDemandeApproFormGroup:FormGroup;
  editDemandeApproFormGroup:FormGroup;
  editDemandeAppro:DemandeApprovisionnement = new DemandeApprovisionnement('', '', new Exercice('', '', new Date(), new Date(), '', false));
  suprDemandeAppro:DemandeApprovisionnement = new DemandeApprovisionnement('', '', new Exercice('', '', new Date(), new Date(), '', false));

  ligneDemandeAppros:LigneDemandeAppro[];
  editLigneDemandeAppro:LigneDemandeAppro = new LigneDemandeAppro(0, new Article('', '', false, false, false, false, 0, '', new Famille('', ''), new Uniter('', '')),
  new DemandeApprovisionnement('', '', new Exercice('', '', new Date(), new Date(), '', false)));
  suprLigneDemandeAppro:LigneDemandeAppro = new LigneDemandeAppro(0, new Article('', '', false, false, false, false, 0, '', new Famille('', ''), new Uniter('', '')),
  new DemandeApprovisionnement('', '', new Exercice('', '', new Date(), new Date(), '', false)));

  tempAddLigneDemandeAppro:LigneDemandeAppro[] = [];
  tempEditLigneDemandeAppro:LigneDemandeAppro[] = [];
  tempDeleteLigneDemandeAppro:LigneDemandeAppro[] = [];

  exercices:Exercice[] = [];
  articles:Article[] = [];

  //Pour Appro
  approvisionnements:Approvisionnement[];
  editAppro:Approvisionnement = new Approvisionnement('', '', new Date(), new Exercice('', '', new Date(), new Date(), '', false));
  suprAppro:Approvisionnement = new Approvisionnement('', '', new Date(), new Exercice('', '', new Date(), new Date(), '', false));
  annulAppro:Approvisionnement = new Approvisionnement('', '', new Date(), new Exercice('', '', new Date(), new Date(), '', false));
  addApproFormsGroup:FormGroup;
  editApproFormsGroup:FormGroup;
  plagesDispo: PlageNumDispo[];
  concernedDemandeAppro:DemandeApprovisionnement = new DemandeApprovisionnement('', '', new Exercice('', '', new Date(), new Date(), '', false));

  ligneAppros:LigneAppro[] = [];
  tempAddLigneAppro:LigneAppro[] = [];
  tempEditLigneAppro:LigneAppro[] = [];
  tempDeleteLigneAppro:LigneAppro[] = [];

  plageNumArticles:PlageNumArticle[] = [];
  tempAddPlageNumArticle:PlageNumArticle[] = [];
  tempEditPlageNumArticle:PlageNumArticle[] = [];
  tempDeletePlageNumArticle:PlageNumArticle[] = [];

  oldApproLines:LigneAppro[] = [];
  oldPlageNumArtLines:PlageNumArticle[] = [];

  pdfToShow = null;

  carveauxMairie:Magasin = new Magasin('', '');
  carveauxTresor:Magasin = new Magasin('', '');

  codeDoc = 'BA';
  listSigner: Signer[] = [];
  listOccuper: Occuper[] = [];

  constructor(public serviceExercice:ExerciceService, private serviceArticle:ArticleService, private serviceDemandeAppro:DemandeApproService,
    private formBulder:FormBuilder, private serviceBonAppro:BonApproService, private sanitizer:DomSanitizer,
    private serviceCorres:CorrespondantService, private serviceRegiss:RegisseurService,
    private serviceTresorier: TresorierCommunalService, private pnd: PlageNumDispoService, private serviceSignataire: SignataireService) {

    this.pdfToShow=sanitizer.bypassSecurityTrustResourceUrl('/');
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

    this.addApproFormsGroup = this.formBulder.group({
      addNumAppro:'',
      addDescriptionAppro:'',
      addDateAppro:[moment(Date.now()).format('yyyy-MM-DD'), Validators.required],
      addDemandeAppro:[0, Validators.required]
    });

    this.editApproFormsGroup = this.formBulder.group({
      editNumAppro:['', Validators.required],
      editDescriptionAppro:'',
      editDateAppro:['', Validators.required],
      editDemandeAppro:[0, Validators.required]
    });

  }

  ngOnInit(): void {

    this.getAllLigneDemandeAppro();
    this.getAllExercice();
    this.getAllLigneAppro();
    this.getAllPlageNumArticle();
    this.getCarveauMairie();
    this.getCarveauTresor();
    this.getAllOccuper();
    this.getAllSigner();

    this.serviceBonAppro.getAllAppro().subscribe(
      (data) => {
        this.approvisionnements = data;
        this.dtTrigger1.next();
      },
      (erreur) => {
        console.log('Erreur lors de la récupération des Appro', erreur);
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


    this.serviceDemandeAppro.getAllDemandeAppro().subscribe(
      (data) => {
        this.demandeAppros = data;

      },
      (erreur) => {
        console.log('Erreur lors de la récupération de la liste des demandes dAppro', erreur);
      }
    );

  }

  onConcernedDemandeApproSelected(){
    if(this.demandeAppros.length!=0){
      this.concernedDemandeAppro = this.demandeAppros[this.addApproFormsGroup.value['addDemandeAppro']];
    }


  }

  //Récuperer le carveau Mairie
  getCarveauMairie(){
    this.serviceRegiss.getAllRegisseur().subscribe(
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

  getAllPlageDispo(){
    this.pnd.getAllPND().subscribe(
      data=>{
        this.plagesDispo=data;
      }
    );
  }

  //Récuperer le carveau Trésor
  getCarveauTresor(){
    this.serviceTresorier.getAllTresCom().subscribe(
      (data) => {
        data.forEach(element => {
          let finded:boolean = false;
          this.serviceCorres.getAllGerer().subscribe(
            (data2) => {
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

  getAllAppro(){
    this.serviceBonAppro.getAllAppro().subscribe(
      (data) => {
        this.approvisionnements = data;
        $('#dataTable1').dataTable().api().destroy();
        this.dtTrigger1.next();

      },
      (erreur) => {
        console.log('Erreur lors de la récupération des Appro', erreur);
      }
    );
  }

  getAllLigneAppro(){
    this.serviceBonAppro.getAllLigneAppro().subscribe(
      (data) => {
        this.ligneAppros = data;

      },
      (erreur) => {
        console.log('Erreur lors de la récupération des lignes dAppro', erreur);
      }
    );
  }

  getAllPlageNumArticle(){
    this.serviceBonAppro.getAllPlageNumArticle().subscribe(
      (data) => {
        this.plageNumArticles = data;
      },
      (erreur) => {
        console.log('Erreur lors de la récupération des plages de Numérotation', erreur);
      }
    );
  }

  getAllDemandeAppro(){
    this.serviceDemandeAppro.getAllDemandeAppro().subscribe(
      (data) => {
        this.demandeAppros = data;

      },
      (erreur) => {
        console.log('Erreur lors de la récupération de la liste des demandes dAppro', erreur);
      }
    );
  }

  getAllLigneDemandeAppro(){
    this.serviceDemandeAppro.getAllLigneDemandeAppro().subscribe(
      (data) => {
        this.ligneDemandeAppros = data;
      },
      (erreur) => {
        console.log('Erreur lors de la récupération des lignes de demande dAppro', erreur)
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

  popALigneOfPlageNumArticle1(inde:number){

    this.tempAddPlageNumArticle.splice(inde, 1);
  }

  popALigneOfPlageNumArticle2(inde:number){

    this.tempEditPlageNumArticle.splice(inde, 1);
  }



  onShowAddArticleModalAddingCommande(){
    this.tempAddLigneDemandeAppro = [];

    this.serviceDemandeAppro.getAllLigneDemandeAppro().subscribe(
      (data) => {
        this.ligneDemandeAppros = data;
        this.ligneDemandeAppros.forEach(element => {

          if(element.appro.numDA == this.concernedDemandeAppro.numDA){
            this.tempAddLigneDemandeAppro.push(element);
          }
        });

      },
      (erreur) => {
        console.log('Erreur lors de la récupération des lignes de demande dAppro', erreur)
      }
    );


    this.addArticle1.show();

  }

  onShowAddArticleModalEditingCommande(){
    this.tempEditLigneDemandeAppro = [];

    this.serviceDemandeAppro.getAllLigneDemandeAppro().subscribe(
      (data) => {
        this.ligneDemandeAppros = data;
        this.ligneDemandeAppros.forEach(element => {

          if(element.appro.numDA == this.concernedDemandeAppro.numDA){
            this.tempEditLigneDemandeAppro.push(element);
          }
        });

      },
      (erreur) => {
        console.log('Erreur lors de la récupération des lignes de demande dAppro', erreur)
      }
    );


    this.addArticle2.show();

  }

  addArticleForAddingOfComm1(inde:number){
    let exist:boolean = false;
    this.tempAddLigneAppro.forEach(element => {
      if(element.ligneDA.article.codeArticle==this.tempAddLigneDemandeAppro[inde].article.codeArticle){
        exist = true;
        exit;
      }
    });

    if(exist===false){
      this.tempAddLigneAppro.push(new LigneAppro(this.tempAddLigneDemandeAppro[inde].quantiteDemandee, this.tempAddLigneDemandeAppro[inde].article.prixVenteArticle,
        new Approvisionnement('', '', new Date(), this.serviceExercice.exoSelectionner),
        this.tempAddLigneDemandeAppro[inde])
        );

      this.tempAddPlageNumArticle.push(new PlageNumArticle(0, 0, null, null, this.tempAddLigneAppro[this.tempAddLigneAppro.length-1]));

    }


  }

  addArticleForEditingOfComm1(inde:number){
    let exist:boolean = false;
    this.tempEditLigneAppro.forEach(element => {
      if(element.ligneDA.article.codeArticle==this.tempEditLigneDemandeAppro[inde].article.codeArticle){
        exist = true;
        exit;
      }
    });

    if(exist===false){
      this.tempEditLigneAppro.push(new LigneAppro(this.tempEditLigneDemandeAppro[inde].quantiteDemandee, this.tempEditLigneDemandeAppro[inde].article.prixVenteArticle,
        new Approvisionnement('', '', new Date(), this.serviceExercice.exoSelectionner),
        this.tempEditLigneDemandeAppro[inde])
        );

      console.log('Element',this.tempEditLigneAppro[this.tempEditLigneAppro.length-1]);

      this.tempEditPlageNumArticle.push(new PlageNumArticle(0, 0, null, null, this.tempEditLigneAppro[this.tempEditLigneAppro.length-1]));

      console.log('Element2', this.tempEditPlageNumArticle[this.tempEditPlageNumArticle.length-1]);

    }

  }

  popArticleAddingOfComm1(inde:number){
    this.tempAddLigneAppro.splice(inde, 1);
  }

  popArticleEditingOfComm1(inde:number){
    console.log('old', this.tempEditLigneAppro);
    this.tempEditLigneAppro.forEach((element, index) => {
      console.log(index, element);
    });
    console.log('Element à enlever', inde, this.tempEditLigneAppro[inde]);
    this.tempEditLigneAppro.splice(inde, 1);
    console.log('new',this.tempEditLigneAppro);
  }

  initAddAppro(){
    this.addComModal.show();
    if(this.demandeAppros.length!=0){
      this.concernedDemandeAppro = this.demandeAppros[0];
    }
  }

  initEditCommande(inde:number){


    this.tempEditLigneAppro = [];
    this.tempEditPlageNumArticle = [];
    this.editAppro = this.approvisionnements[inde];
    this.ligneAppros.forEach(element => {
      if(element.appro.numAppro == this.editAppro.numAppro){
        this.concernedDemandeAppro = element.ligneDA.appro;
        exit;
      }
      else{
        this.concernedDemandeAppro = this.demandeAppros[this.demandeAppros.length-1];
      }
    });

    this.serviceBonAppro.getAllLigneAppro().subscribe(
      (data) => {
        this.ligneAppros = data;
        this.ligneAppros.forEach(element => {
          if(element.appro.numAppro == this.editAppro.numAppro){
            this.tempEditLigneAppro.push(element);
            this.serviceBonAppro.getAllPlageNumArticle().subscribe(
              (data2) => {
                this.plageNumArticles = data2;
                this.plageNumArticles.forEach(element2 => {
                  if(element2.ligneAppro != null && element.idLigneAppro == element2.ligneAppro.idLigneAppro){
                    this.tempEditPlageNumArticle.push(element2);
                  }
                });
              },
              (erreur) => {
                console.log('Erreur lors de la récupération de la liste des plages', erreur);
              }
            );

          }
        });
      },
      (erreur) => {
        console.log('Erreur lors de la récupération des lignes dAppro', erreur);
      }
    );

    this.oldApproLines = [];
    this.oldPlageNumArtLines = [];

    this.ligneAppros.forEach(element => {
      if(element.appro.numAppro == this.editAppro.numAppro){
        this.oldApproLines.push(element);
      }
    });

    this.plageNumArticles.forEach(element => {
      if(element.ligneAppro!=null && element.ligneAppro.appro.numAppro == this.editAppro.numAppro){
        this.oldPlageNumArtLines.push(element);
      }
    });

    this.editComModal.show();

    console.log(this.tempEditLigneAppro);

  }

  onAddAPlageNumArticleClicked1(inde:number){
    this.tempAddPlageNumArticle.push(new PlageNumArticle(0, 0, null, null, this.tempAddLigneAppro[inde]));
  }

  onAddAPlageNumArticleClicked2(inde:number){
    this.tempEditPlageNumArticle.push(new PlageNumArticle(0, 0, null, null, this.tempEditLigneAppro[inde]));
  }

  initDeleteCommande(inde:number){

    this.suprAppro = this.approvisionnements[inde];
    this.deleteComModal.show();
  }

  initAnnulerAppro(inde:number){

    this.annulAppro = this.approvisionnements[inde];
    this.annulerApproModal.show();
  }

  onSubmitAddCommandeFormsGroup(){

    const newAppro = new Approvisionnement(this.addApproFormsGroup.value['addNumAppro'],
    this.addApproFormsGroup.value['addDescriptionAppro'], this.addApproFormsGroup.value['addDateAppro'],
    this.serviceExercice.exoSelectionner);

    this.serviceBonAppro.addAAppro(newAppro).subscribe(
      (data) => {

        this.tempAddLigneAppro.forEach((element, inde) => {
          element.appro = data;
          this.serviceBonAppro.addALigneAppro(element).subscribe(
            (data2) => {
              this.tempAddLigneAppro.splice(inde);

              //ajustement de stock
              this.serviceCorres.getAllStocker().subscribe(
                (data3) => {
                  let concernedStockerCarvMairie:Stocker = null;
                  let concernedStockerCarvTresor:Stocker = null;
                  let exi1:boolean = false;
                  let exi2:boolean = false;

                  data3.forEach(element3 => {
                    if(element3.magasin.codeMagasin == this.carveauxMairie.codeMagasin && element3.article.codeArticle == data2.ligneDA.article.codeArticle){
                      concernedStockerCarvMairie = element3;
                      exi1 = true;
                      exit;
                    }

                    if(element3.magasin.codeMagasin == this.carveauxTresor.codeMagasin && element3.article.codeArticle == data2.ligneDA.article.codeArticle){
                      concernedStockerCarvTresor = element3;
                      exi2 = true;
                      exit;
                    }
                  });

                  if(exi1){
                    concernedStockerCarvMairie.quantiterStocker += data2.quantiteLigneAppro;
                    this.serviceCorres.editAStocker(concernedStockerCarvMairie.idStocker.toString(), concernedStockerCarvMairie).subscribe(
                      (data4) => {

                      },
                      (erreur) => {
                        console.log('Erreur lors de lEdition du stock', erreur);
                      }
                    );
                  }
                  else{
                    this.serviceCorres.addAStocker(new Stocker(data2.quantiteLigneAppro, 0, 0, 0, data2.ligneDA.article, this.carveauxMairie)).subscribe(
                      (data4) => {

                      },
                      (erreur) => {
                        console.log('Erreur lors de la création dUn Stocker', erreur);
                      }
                    );

                  }

                  if(exi2){
                    concernedStockerCarvTresor.quantiterStocker -= data2.quantiteLigneAppro;
                    this.serviceCorres.editAStocker(concernedStockerCarvTresor.idStocker.toString(), concernedStockerCarvTresor).subscribe(
                      (data4) => {

                      },
                      (erreur) => {
                        console.log('Erreur lors de lEdition du stock', erreur);
                      }
                    );
                  }
                  else{
                    this.serviceCorres.addAStocker(new Stocker(data2.quantiteLigneAppro*(-1), 0, 0, 0, data2.ligneDA.article, this.carveauxTresor)).subscribe(
                      (data4) => {
                        this.plagesDispo.sort((a,b)=>a.numDebPlageDispo-b.numDebPlageDispo);
                      },
                      (erreur) => {
                        console.log('Erreur lors de la création dUn Stocker', erreur);
                      }
                    );

                  }


                },
                (erreur) => {
                  console.log('Erreur lors de la récupération des stockés', erreur);
                }
              );

              this.tempAddPlageNumArticle.forEach(element2 => {
                if(element2.ligneAppro.ligneDA.idLigneDA == data2.ligneDA.idLigneDA){

                  element2.ligneAppro = data2;
                  this.serviceBonAppro.addAPlageNumArticle(element2).subscribe(
                    (data3) => {

                    },
                    (erreur) => {
                      console.log('Erreur lors de lAjout dUne plage de numéro dArticle', erreur);
                    }
                  );
                }
              });

            },
            (erreur) => {
              console.log('Erreur lors de lAjout dUne ligne dAppro', erreur);
            }
          );
        });

        this.addComModal.hide();
        this.getAllLigneAppro();
        this.getAllAppro();
        this.getAllPlageNumArticle();

      },
      (erreur) => {
        console.log('Erreur lors de lAjout de lAppro', erreur);
      }
    );



  }

  onSubmitEditCommandeFormsGroup(){

    const newAppro = new Approvisionnement(this.editApproFormsGroup.value['editNumAppro'],
    this.editApproFormsGroup.value['editDescriptionAppro'], this.editApproFormsGroup.value['editDateAppro'],
    this.serviceExercice.exoSelectionner);



    this.serviceBonAppro.editAAppro(this.editAppro.numAppro, newAppro).subscribe(
      (data) => {

        //Traitement des lignes d'Appro à ajouter et ou modifier
        this.tempEditLigneAppro.forEach(element => {
          let added:boolean = true;

          this.oldApproLines.forEach(element2 => {
            if(element.ligneDA.article.codeArticle == element2.ligneDA.article.codeArticle){
              added = false;
              this.serviceBonAppro.editALigneAppro(element2.idLigneAppro.toString(), element).subscribe(

                (data12) => {

                  //ajustement de stock si modification simple de la ligne d'Appro
                  this.serviceCorres.getAllStocker().subscribe(
                    (data3) => {
                      let concernedStockerCarvMairie:Stocker = null;
                      let concernedStockerCarvTresor:Stocker = null;
                      let exi1:boolean = false;
                      let exi2:boolean = false;

                      data3.forEach(element3 => {
                        if(element3.magasin.codeMagasin == this.carveauxMairie.codeMagasin && element3.article.codeArticle == data12.ligneDA.article.codeArticle){
                          concernedStockerCarvMairie = element3;
                          exi1 = true;
                          exit;
                        }

                        if(element3.magasin.codeMagasin == this.carveauxTresor.codeMagasin && element3.article.codeArticle == data12.ligneDA.article.codeArticle){
                          concernedStockerCarvTresor = element3;
                          exi2 = true;
                          exit;
                        }
                      });

                      if(exi1){
                        concernedStockerCarvMairie.quantiterStocker = concernedStockerCarvMairie.quantiterStocker - element2.quantiteLigneAppro + data12.quantiteLigneAppro;
                        this.serviceCorres.editAStocker(concernedStockerCarvMairie.idStocker.toString(), concernedStockerCarvMairie).subscribe(
                          (data4) => {

                          },
                          (erreur) => {
                            console.log('Erreur lors de lEdition du stock', erreur);
                          }
                        );
                      }
                      else{
                        this.serviceCorres.addAStocker(new Stocker(data12.quantiteLigneAppro, 0, 0, 0, data12.ligneDA.article, this.carveauxMairie)).subscribe(
                          (data4) => {

                          },
                          (erreur) => {
                            console.log('Erreur lors de la création dUn Stocker', erreur);
                          }
                        );

                      }

                      if(exi2){
                        concernedStockerCarvTresor.quantiterStocker = concernedStockerCarvTresor.quantiterStocker + element2.quantiteLigneAppro - data12.quantiteLigneAppro;
                        this.serviceCorres.editAStocker(concernedStockerCarvTresor.idStocker.toString(), concernedStockerCarvTresor).subscribe(
                          (data4) => {

                          },
                          (erreur) => {
                            console.log('Erreur lors de lEdition du stock', erreur);
                          }
                        );
                      }
                      else{
                        this.serviceCorres.addAStocker(new Stocker(data12.quantiteLigneAppro*(-1), 0, 0, 0, data12.ligneDA.article, this.carveauxTresor)).subscribe(
                          (data4) => {

                          },
                          (erreur) => {
                            console.log('Erreur lors de la création dUn Stocker', erreur);
                          }
                        );

                      }


                    },
                    (erreur) => {
                      console.log('Erreur lors de la récupération des stockés', erreur);
                    }
                  );


                  this.tempEditPlageNumArticle.forEach(element3 => {
                    //filtrage important
                    if(element3.ligneAppro.ligneDA.idLigneDA === data12.ligneDA.idLigneDA){
                      let exis:boolean=false;

                      this.oldPlageNumArtLines.forEach(element4 => {
                        if(element3.idPlage === element4.idPlage){
                          exis = true;
                          this.serviceBonAppro.editAPlageNumArticle(element4.idPlage.toString(), element3).subscribe(
                            (data2) => {

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
                        element3.ligneAppro = data12;
                        this.serviceBonAppro.addAPlageNumArticle(element3).subscribe(
                          (data3) => {

                          },
                          (erreur) => {
                            console.log('Erreur lors de la création dUne plage de num', erreur);
                          }
                        );
                      }

                      //Suppression de ces lignes qui ont été supprimées par l'User
                      this.oldPlageNumArtLines.forEach(element4 => {
                        if(element4.ligneAppro.idLigneAppro == data12.idLigneAppro){
                          let maint:boolean = false;
                          this.tempEditPlageNumArticle.forEach(element5 => {
                            if(element4.idPlage === element5.idPlage){
                              maint = true;
                              exit;
                            }
                          });

                          if(maint == false){
                            this.serviceBonAppro.deleteAPlageNumArticle(element4.idPlage.toString()).subscribe(
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
                },
                (erreur) => {
                  console.log('Erreur lors de la modification dUne ligne dAppro', erreur);
                }
              );
              exit;
            }
          });

          if(added==true){
            element.appro = data;
            //console.log('+', element);
            this.serviceBonAppro.addALigneAppro(element).subscribe(
              (data9) => {

                //ajustement de stock
                this.serviceCorres.getAllStocker().subscribe(
                  (data3) => {
                    let concernedStockerCarvMairie:Stocker = null;
                    let concernedStockerCarvTresor:Stocker = null;
                    let exi1:boolean = false;
                    let exi2:boolean = false;

                    data3.forEach(element3 => {
                      if(element3.magasin.codeMagasin == this.carveauxMairie.codeMagasin && element3.article.codeArticle == data9.ligneDA.article.codeArticle){
                        concernedStockerCarvMairie = element3;
                        exi1 = true;
                        exit;
                      }

                      if(element3.magasin.codeMagasin == this.carveauxTresor.codeMagasin && element3.article.codeArticle == data9.ligneDA.article.codeArticle){
                        concernedStockerCarvTresor = element3;
                        exi2 = true;
                        exit;
                      }
                    });

                    if(exi1){
                      concernedStockerCarvMairie.quantiterStocker += data9.quantiteLigneAppro;
                      this.serviceCorres.editAStocker(concernedStockerCarvMairie.idStocker.toString(), concernedStockerCarvMairie).subscribe(
                        (data4) => {

                        },
                        (erreur) => {
                          console.log('Erreur lors de lEdition du stock', erreur);
                        }
                      );
                    }
                    else{
                      this.serviceCorres.addAStocker(new Stocker(data9.quantiteLigneAppro, 0, 0, 0, data9.ligneDA.article, this.carveauxMairie)).subscribe(
                        (data4) => {

                        },
                        (erreur) => {
                          console.log('Erreur lors de la création dUn Stocker', erreur);
                        }
                      );

                    }

                    if(exi2){
                      concernedStockerCarvTresor.quantiterStocker -= data9.quantiteLigneAppro;
                      this.serviceCorres.editAStocker(concernedStockerCarvTresor.idStocker.toString(), concernedStockerCarvTresor).subscribe(
                        (data4) => {

                        },
                        (erreur) => {
                          console.log('Erreur lors de lEdition du stock', erreur);
                        }
                      );
                    }
                    else{
                      this.serviceCorres.addAStocker(new Stocker(data9.quantiteLigneAppro*(-1), 0, 0, 0, data9.ligneDA.article, this.carveauxTresor)).subscribe(
                        (data4) => {

                        },
                        (erreur) => {
                          console.log('Erreur lors de la création dUn Stocker', erreur);
                        }
                      );

                    }


                  },
                  (erreur) => {
                    console.log('Erreur lors de la récupération des stockés', erreur);
                  }
                );


                //console.log('liste', this.tempEditPlageNumArticle);
                this.tempEditPlageNumArticle.forEach(element3 => {
                  if(element3.ligneAppro.ligneDA.article.codeArticle == data9.ligneDA.article.codeArticle){
                    //console.log('++', element3);
                    element3.ligneAppro = data9;
                    //console.log('+++', element3);
                    this.serviceBonAppro.addAPlageNumArticle(element3).subscribe(
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


        //Traitement des lignes de plages de numérotation à ajouter et ou modifier


        this.oldApproLines.forEach(element => {
          let mainte:boolean = false;
          this.tempEditLigneAppro.forEach(element2 => {
            if(element.idLigneAppro === element2.idLigneAppro){
              mainte = true;
              exit;
            }
          });

          if(mainte == false){
            this.oldPlageNumArtLines.forEach(element3 => {
              if(element3.ligneAppro.idLigneAppro === element.idLigneAppro){
                this.serviceBonAppro.deleteAPlageNumArticle(element3.idPlage.toString()).subscribe(
                  (data7) => {
                    this.serviceBonAppro.deleteALigneAppro(element.idLigneAppro.toString()).subscribe(
                      (data8) => {

                      },
                      (erreur) => {
                        console.log('Erreur lors de suppression dUne ligne dAppro', erreur);
                      }
                    );
                  },
                  (erreur) => {
                    console.log('Erreur lors de la suppression dUne plage', erreur);
                  }
                );



              }
            });

            this.serviceBonAppro.deleteALigneAppro(element.idLigneAppro.toString()).subscribe(
              (data8) => {

                //ajustement de stock en cas de suppression de la ligne d'appro
                this.serviceCorres.getAllStocker().subscribe(
                  (data3) => {
                    let concernedStockerCarvMairie:Stocker = null;
                    let concernedStockerCarvTresor:Stocker = null;
                    let exi1:boolean = false;
                    let exi2:boolean = false;

                    data3.forEach(element3 => {
                      if(element3.magasin.codeMagasin == this.carveauxMairie.codeMagasin && element3.article.codeArticle == element.ligneDA.article.codeArticle){
                        concernedStockerCarvMairie = element3;
                        exi1 = true;
                        exit;
                      }

                      if(element3.magasin.codeMagasin == this.carveauxTresor.codeMagasin && element3.article.codeArticle == element.ligneDA.article.codeArticle){
                        concernedStockerCarvTresor = element3;
                        exi2 = true;
                        exit;
                      }
                    });

                    if(exi1){
                      concernedStockerCarvMairie.quantiterStocker -= element.quantiteLigneAppro;
                      this.serviceCorres.editAStocker(concernedStockerCarvMairie.idStocker.toString(), concernedStockerCarvMairie).subscribe(
                        (data4) => {

                        },
                        (erreur) => {
                          console.log('Erreur lors de lEdition du stock', erreur);
                        }
                      );
                    }
                    else{
                      this.serviceCorres.addAStocker(new Stocker(element.quantiteLigneAppro*(-1), 0, 0, 0, element.ligneDA.article, this.carveauxMairie)).subscribe(
                        (data4) => {

                        },
                        (erreur) => {
                          console.log('Erreur lors de la création dUn Stocker', erreur);
                        }
                      );

                    }

                    if(exi2){
                      concernedStockerCarvTresor.quantiterStocker += element.quantiteLigneAppro;
                      this.serviceCorres.editAStocker(concernedStockerCarvTresor.idStocker.toString(), concernedStockerCarvTresor).subscribe(
                        (data4) => {

                        },
                        (erreur) => {
                          console.log('Erreur lors de lEdition du stock', erreur);
                        }
                      );
                    }
                    else{
                      this.serviceCorres.addAStocker(new Stocker(element.quantiteLigneAppro, 0, 0, 0, element.ligneDA.article, this.carveauxTresor)).subscribe(
                        (data4) => {

                        },
                        (erreur) => {
                          console.log('Erreur lors de la création dUn Stocker', erreur);
                        }
                      );

                    }


                  },
                  (erreur) => {
                    console.log('Erreur lors de la récupération des stockés', erreur);
                  }
                );


              },
              (erreur) => {
                console.log('Erreur lors de suppression dUne ligne dAppro', erreur);
              }
            );

          }

        });

        this.editComModal.hide();
        this.getAllAppro();
        this.getAllLigneAppro(),
        this.getAllPlageNumArticle();

      },
      (erreur) => {
        console.log('Erreur lors de la Modification de lAppro', erreur);
      }
    );


  }

  onConfirmDeleteCommande(){

    this.serviceBonAppro.getAllPlageNumArticle().subscribe(
      (data) => {
        this.plageNumArticles = data;
        this.serviceBonAppro.getAllLigneAppro().subscribe(
          (data2) => {
            this.ligneAppros = data2;
            //suppression pour les lignes d'Appro ayant de plage et qui concernent l'Appro
            this.plageNumArticles.forEach(element => {
              if(element.ligneAppro!=null && element.ligneAppro.appro.numAppro == this.suprAppro.numAppro){
                this.serviceBonAppro.deleteAPlageNumArticle(element.idPlage.toString()).subscribe(
                  (data3) => {
                    this.serviceBonAppro.deleteALigneAppro(element.ligneAppro.idLigneAppro.toString()).subscribe(
                      (data4) => {
                        this.serviceBonAppro.deleteAAppro(this.suprAppro.numAppro).subscribe(
                          (data5) => {

                          },
                          (erreur) => {
                            console.log('Erreur lors de la suppression du Bon dAppro', erreur);
                          }
                        );
                      },
                      (erreur) => {
                        console.log('Erreur lors de la suppression dUne ligne dAppro', erreur);
                      }
                    );
                  },
                  (erreur) => {
                    console.log('Erreur lors de la suppression dUne plage', erreur);
                  }
                );
              }

            });

            //suppression pour les lignes d'Appro n'ayant pas de plage d'Appro
            this.ligneAppros.forEach(element => {
              if(element.appro.numAppro == this.suprAppro.numAppro){
                this.serviceBonAppro.deleteALigneAppro(element.idLigneAppro.toString()).subscribe(
                  (data3) => {
                    this.serviceBonAppro.deleteAAppro(this.suprAppro.numAppro).subscribe(
                      (data4) => {

                      },
                      (erreur) => {
                        console.log('Erreur lors de la suppression de lAppro', erreur);
                      }
                    );
                  },
                  (erreur) => {
                    console.log('Erreur lors de la suppression dUne ligne dAppro', erreur);
                  }
                );
              }
            });

            //suppression pour un appro n'ayant pas de ligne
            this.serviceBonAppro.deleteAAppro(this.suprAppro.numAppro).subscribe(
              (data33) => {
                console.log('+++', data33);

              },
              (erreur) => {
                console.log('Erreur lors de la suppression de lAppro', erreur);
              }
            );

            this.deleteComModal.hide();
            this.getAllAppro();
            this.getAllLigneAppro();
            this.getAllPlageNumArticle();

          },
          (erreur) => {
            console.log('Erreur lors de la récupération de la liste des lignes dAppro', erreur);
          }
        );
      },
      (erreur) => {
        console.log('Erreur lors de la récupération de la liste des plages', erreur);
      }
    );



  }

  onConfirmAnnulerAppro(){

          let appr:Approvisionnement = new Approvisionnement(this.annulAppro.numAppro, this.annulAppro.descriptionAppro, this.annulAppro.dateAppro, this.annulAppro.exercice);
          appr.valideAppro = false;
          this.serviceBonAppro.editAAppro(this.annulAppro.numAppro, appr).subscribe(
            (data2) => {

              this.serviceBonAppro.getAllLigneAppro().subscribe(
                (data3) => {

                  data3.forEach(element3 => {
                    if(element3.appro.numAppro == data2.numAppro){
                      this.serviceCorres.getAllStocker().subscribe(
                        (data4) => {
                          let exist1:boolean = false;
                          let exist2:boolean = false;
                          let concernedStockerCarvMairie:Stocker = null;
                          let concernedStockerCarvTresor:Stocker = null;
                          data4.forEach(element4 => {
                            if(element4.magasin.codeMagasin == this.carveauxMairie.codeMagasin && element4.article.codeArticle == element3.ligneDA.article.codeArticle){
                              concernedStockerCarvMairie = element4;
                              exist1 = true;
                              exit;
                            }
                            if(element4.magasin.codeMagasin == this.carveauxTresor.codeMagasin && element4.article.codeArticle == element3.ligneDA.article.codeArticle){
                              concernedStockerCarvTresor = element4;
                              exist2 = true;
                              exit;
                            }

                          });

                          if(exist1){
                            concernedStockerCarvMairie.quantiterStocker-=element3.quantiteLigneAppro;
                            this.serviceCorres.editAStocker(concernedStockerCarvMairie.idStocker.toString(), concernedStockerCarvMairie).subscribe(
                              (data5) => {

                              },
                              (erreur) => {
                                console.log('Erreur lors de lEdition dUn stock', erreur);
                              }
                            );
                          }
                          else{
                            this.serviceCorres.addAStocker(new Stocker(element3.quantiteLigneAppro*(-1), 0, 0, 0, element3.ligneDA.article, this.carveauxMairie)).subscribe(
                              (data5) => {

                              },
                              (erreur) => {
                                console.log('Erreur lors de lAjout dUn Stocker', erreur);
                              }
                            );
                          }

                          if(exist2){
                            concernedStockerCarvTresor.quantiterStocker+=element3.quantiteLigneAppro;
                            this.serviceCorres.editAStocker(concernedStockerCarvTresor.idStocker.toString(), concernedStockerCarvTresor).subscribe(
                              (data5) => {

                              },
                              (erreur) => {
                                console.log('Erreur lors de lEdition dUn stock', erreur);
                              }
                            );
                          }
                          else{
                            this.serviceCorres.addAStocker(new Stocker(element3.quantiteLigneAppro, 0, 0, 0, element3.ligneDA.article, this.carveauxTresor)).subscribe(
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

              this.annulerApproModal.hide();
              this.getAllAppro();

            },
            (erreur) => {
              console.log('Erreur lors de la modification du placement', erreur);
            }
          );

  }

  initPrintToPdfOfAnAppro(inde:number){
    const appro = this.approvisionnements[inde];
    let approDemAppro = new DemandeApprovisionnement('', '', new Exercice('', '', new Date(), new Date(), '', false));
    const doc = new jsPDF();
    let lignes = [];
    let plages:PlageNumArticle[] = [];
    let totalTTC;
    totalTTC = 0;

    this.serviceBonAppro.getAllLigneAppro().subscribe(
      (data) => {
        this.ligneAppros = data;
        this.serviceBonAppro.getAllPlageNumArticle().subscribe(
          (data2) => {
            this.plageNumArticles = data2;


            this.plageNumArticles.forEach(element => {
              if(element.ligneAppro != null && element.ligneAppro.appro.numAppro == appro.numAppro){
                plages.push(element);
              }
            });


            this.ligneAppros.forEach(element => {
              if(element.appro.numAppro == appro.numAppro){
                let lig = [];
                approDemAppro = element.ligneDA.appro;
                lig.push(element.ligneDA.article.codeArticle);
                lig.push(element.ligneDA.article.libArticle);
                lig.push(element.quantiteLigneAppro);
                lig.push(element.puligneAppro);
                lig.push(element.puligneAppro*element.quantiteLigneAppro);
                let pla:String = '';
                let num:number = 0;
                plages.forEach((element2, index) => {

                  if(element2.ligneAppro.idLigneAppro == element.idLigneAppro){

                    if(num == 0){
                      pla = pla.concat(''+element2.numDebPlage+' à '+element2.numFinPlage+' ');
                      num = index;
                    }
                    else{
                      pla = pla.concat('| '+element2.numDebPlage+' à '+element2.numFinPlage+' ');

                    }
                  }
                });
                lig.push(pla);
                lignes.push(lig);
                totalTTC += element.puligneAppro*element.quantiteLigneAppro;

              }

            });
            moment.locale('fr');
            /*doc.setDrawColor(0);
            doc.setFillColor(255, 255, 255);
            doc.roundedRect(50, 20, 120, 15, 3, 3, 'FD');
            //doc.setFont("Times New Roman");
            doc.setFontSize(22);
            doc.text('BON APPROVISIONNEMENT', 57, 30);
            doc.setFontSize(14);*/

            doc.addImage(ToolsService.ente,'jpeg',0,0,200,30);

            doc.setDrawColor(0);
            doc.setFillColor(255, 255, 255);
            doc.roundedRect(50, 29, 110, 9, 3, 3, 'FD');
            //doc.setFont("Times New Roman");
            doc.setFontSize(15);
            doc.text('BON APPROVISIONNEMENT', 69, 35);
            doc.setFontSize(12);

            doc.text('Référence : '+appro.numAppro, 15, 45);
            doc.text('Date : '+moment(appro.dateAppro).format('DD/MM/YYYY'), 152, 45);

            doc.text('Demande d\'Appro N° : '+approDemAppro.numDA+'\tDu\t'+moment(new Date(approDemAppro.dateDA.toString())).format('DD/MM/YYYY'), 15, 55);
            doc.text('Description : '+appro.descriptionAppro, 15, 65);
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
            //doc.autoPrint();

            let tabSignataire = [];
        
            Tools2Service.getSignatairesOfAdocAtAmoment(this.codeDoc, appro.dateAppro, this.listOccuper, this.listSigner)
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
    

            this.pdfToShow = this.sanitizer.bypassSecurityTrustResourceUrl(doc.output('datauristring', {filename:'bonAppro.pdf'}));
            this.viewPdfModal.show();


          },
          (erreur) => {
            console.log('Erreur lors de la récupération des plages de Numérotation', erreur);
          }
        );

      },
      (erreur) => {
        console.log('Erreur lors de la récupération des lignes dAppro', erreur);
      }
    );


  }

}
