import { Component, OnInit, ViewChild } from '@angular/core';
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

@Component({
  selector: 'app-reception',
  templateUrl: './reception.component.html',
  styleUrls: ['./reception.component.css']
})
export class ReceptionComponent implements OnInit {

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

  receptions:Reception[];
  ligneReceptions:LigneReception[];
  concernedCommande:Commande = new Commande('', new Date(), '', 0, new Fournisseur('', '', '', '', '', '', ''), new Exercice('', '', new Date(), new Date(), '', false));
  articlesOfAConcernedCommandeAddingRecept:Article[] = [];
  articlesOfAConcernedCommandeEditingRecept:Article[] = [];

  editReception:Reception = new Reception('', '', new Date());
  suprReception:Reception = new Reception('', '', new Date());

  tempAddLigneReception:LigneReception[] = [];
  tempEditLigneReception:LigneReception[] = [];

  commandes:Commande[] = [];
  addReceptionFormGroup:FormGroup;
  editReceptionFormGroup:FormGroup;
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
    private serviceFrs:FournisseurService, private serviceArticle:ArticleService, private serviceReception:ReceptionService,
    private formBulder:FormBuilder) {
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
      addNumReception:['', Validators.required],
      addObservation:'',
      addDateReception:[new Date(), Validators.required],
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

  getAllReception(){
    this.serviceReception.getAllReception().subscribe(
      (data) => {
        this.receptions = data;
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
          '', 0, 0, this.tempAddLigneCommandes[inde], new Reception('', '', new Date()))
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
          '', 0, 0, this.tempEditLigneCommandes[inde], new Reception('', '', new Date()))
      );
    }

  }

  popArticleAddingOfRecept1(inde:number){
    this.tempAddLigneReception.splice(inde, 1);
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
        this.ligneReceptions.forEach(element => {
          if(element.reception.numReception==this.editReception.numReception){
            this.tempEditLigneReception.push(element);
          }
        });

      },
      (erreur) => {
        console.log('Erreur lors de la récupération de la liste des lignes de réception', erreur);
      }
    );

    this.editComModal.show();
  }

  initDeleteReception(inde:number){
    this.suprReception = this.receptions[inde];
    this.deleteComModal.show();
  }

  onSubmitAddReceptionFormsGroup(){

    const newRecept = new Reception(this.addReceptionFormGroup.value['addNumReception'],
    this.addReceptionFormGroup.value['addObservation'], this.addReceptionFormGroup.value['addDateReception']);

    this.serviceReception.addAReception(newRecept).subscribe(
      (data) => {

        this.tempAddLigneReception.forEach(element => {
          element.reception = data;
          //console.log('Ligne++++', element);
          this.serviceReception.addALigneReception(element).subscribe(
            (data2) => {

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
    this.editReceptionFormGroup.value['editObservation'], this.editReceptionFormGroup.value['editDateReception']);


    let oldReceptionLines:LigneReception[] = [];

    this.ligneReceptions.forEach(element => {
      if(element.reception.numReception==this.editReception.numReception){
        oldReceptionLines.push(element);
      }
    });


    this.serviceReception.editAReception(this.editReception.numReception, newRecept).subscribe(
      (data) => {

        //Pour ajout et ou modification des lignes
        this.tempEditLigneReception.forEach(element => {
          let added:boolean = true;
          oldReceptionLines.forEach(element2 => {
            if(element.ligneCommande.article.codeArticle==element2.ligneCommande.article.codeArticle){
              added = false;
              element.reception = data;

              this.serviceReception.editALigneReception(element2.idLigneReception.toString(), element).subscribe(
                (data2) => {

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

              },
              (erreur) => {
                console.log('Erreur lors de la création dUne nouvelle ligne pour lEdition', erreur)
              }
            );
          }

        });


        //Pour suppression des lignes suprimés
        oldReceptionLines.forEach(element => {
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
    doc.setDrawColor(0);
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(50, 20, 110, 15, 3, 3, 'FD');
    //doc.setFont("Times New Roman");
    doc.setFontSize(25);
    doc.text('ENTREE ACHAT', 70, 30);
    doc.setFontSize(14);
    doc.text('Référence : '+reception.numReception, 15, 45);
    doc.text('Date : '+reception.dateReception, 152, 45);
    doc.text('Commande : '+receptComm.numCommande+'\tDu\t'+receptComm.dateCommande, 15, 55);
    doc.text('Fournisseur : '+receptComm.frs.identiteFrs, 15, 65);
    doc.text('Observation : '+reception.observation, 15, 75);
    autoTable(doc, {
      head: [['Article', 'Désignation', 'Quantité', 'PU', 'TVA(en %)', 'Remise', 'Montant TTC', 'Plage', 'Obs.']],
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
    //doc.autoPrint();
    doc.output('dataurlnewwindow');
  }

}
