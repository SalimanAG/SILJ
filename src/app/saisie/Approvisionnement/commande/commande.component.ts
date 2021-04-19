import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { data } from 'jquery';
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
import {jsPDF} from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as moment from 'moment';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-commande',
  templateUrl: './commande.component.html',
  styleUrls: ['./commande.component.css']
})
export class CommandeComponent implements OnInit {

  //Commune
  @ViewChild('addComModal') public addComModal: ModalDirective;
  @ViewChild('editComModal') public editComModal: ModalDirective;
  @ViewChild('deleteComModal') public deleteComModal: ModalDirective;
  @ViewChild('addArticle1') public addArticle1: ModalDirective;
  @ViewChild('addArticle2') public addArticle2: ModalDirective;
  @ViewChild('viewPdfModal') public viewPdfModal: ModalDirective;


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

  pdfToShow = null;

  constructor(private serviceCommande:CommandeService, private serviceExercice:ExerciceService,
    private serviceFrs:FournisseurService, private serviceArticle:ArticleService,
    private formBulder:FormBuilder, private sanitizer:DomSanitizer) {

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
      addNumCommande:'',
      addDateCommande:[moment(Date.now()).format('yyyy-MM-DD'), Validators.required],
      addDescription:'',
      addDelaiLivraison:[0, Validators.required],
      addFrs:[0, Validators.required],
      addDateRemiseCommande:[moment(Date.now()).format('yyyy-MM-DD'), Validators.required]
    });

    this.editCommandeFormGroup = this.formBulder.group({
      editNumCommande:['', Validators.required],
      editDateCommande:[new Date(), Validators.required],
      editDescription:'',
      editDelaiLivraison:[0, Validators.required],
      editFrs:[0, Validators.required],
      editDateRemiseCommande:[new Date(), Validators.required]
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

  getAllCommande(){
    this.serviceCommande.getAllCommande().subscribe(
      (data) => {
        this.commandes = data;
        $('#dataTable1').dataTable().api().destroy();
        this.dtTrigger1.next();
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
      this.tempAddLigneCommandes.push(new LigneCommande(0, 0, 0, 0,
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
      this.tempEditLigneCommandes.push(new LigneCommande(0, 0, 0, 0,
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
    this.serviceExercice.exoSelectionner,
    this.addCommandeFormGroup.value['addDateRemiseCommande']);

    //console.log(this.tempAddLigneCommandes, newComm);
    this.serviceCommande.addACommande(newComm).subscribe(
      (data) => {
        this.tempAddLigneCommandes.forEach((element, inde) => {
          element.numCommande = data;
          this.serviceCommande.addALigneCommande(element).subscribe(
            (data2) => {
              this.tempAddLigneCommandes.splice(inde);
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
    this.serviceExercice.exoSelectionner,
    this.editCommandeFormGroup.value['editDateRemiseCommande']);

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

  initPrintPdfOfAnCommande(inde:number){
    const commande = this.commandes[inde];
    const doc = new jsPDF();
    let lignes = [];
    let totalHT, totalTTC, totalRemise, totalTVA;
    totalHT = 0;
    totalRemise = 0;
    totalTVA = 0;
    totalTTC = 0;

    this.serviceCommande.getAllLigneCommande().subscribe(
      (dataa) => {
        this.ligneCommandes = dataa;

        this.ligneCommandes.forEach(element => {
          if(element.numCommande.numCommande == commande.numCommande){
            let lig = [];
            lig.push(element.article.codeArticle);
            lig.push(element.article.libArticle);
            lig.push(element.qteLigneCommande);
            lig.push(element.puligneCommande);
            lig.push(element.tva);
            lig.push(element.remise);
            lig.push(element.puligneCommande*element.qteLigneCommande*(1+(element.tva/100))-element.remise);
            lignes.push(lig);

            totalRemise += element.remise;
            totalTVA += element.puligneCommande*element.qteLigneCommande*(element.tva/100);
            totalHT += element.puligneCommande*element.qteLigneCommande;
            totalTTC += element.puligneCommande*element.qteLigneCommande*(1+(element.tva/100))-element.remise;

          }

        });
        moment.locale('fr');
        doc.setDrawColor(0);
        doc.setFillColor(255, 255, 255);
        doc.roundedRect(50, 20, 110, 15, 3, 3, 'FD');
        //doc.setFont("Times New Roman");
        doc.setFontSize(25);
        doc.text('COMMANDE ACHAT', 62, 30);
        doc.setFontSize(14);
        doc.text('Référence : '+commande.numCommande, 15, 45);
        doc.text('Date : '+moment(commande.dateCommande).format('DD/MM/YYYY'), 152, 45);
        doc.text('Fournisseur : '+commande.frs.identiteFrs, 15, 55);
        doc.text('Délais de Livraison : '+commande.delaiLivraison+'  Jour(s)', 15, 65);
        doc.text('Description : '+commande.description, 15, 75);
        autoTable(doc, {
          theme: 'grid',
          head: [['Article', 'Désignation', 'Quantité', 'PU', 'TVA(en %)', 'Remise', 'Montant TTC']],
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

        autoTable(doc, {
          theme: 'plain',
          margin: { top: 100 },
          columnStyles: {
            0: { textColor: 0, fontStyle: 'bold', halign: 'center' },
            2: { textColor: 0, fontStyle: 'bold', halign: 'left' },
          },
          body: [
            ['Le Trésorier Communal\n\n\n\n\n',
            '\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t',
            'Le Maire\n\n\n\n\n\t\t\t\t\t\t\t\t\t\t\t\t']
          ]
          ,
        });

        //doc.autoPrint();
        //doc.output('dataurlnewwindow');
        this.pdfToShow = this.sanitizer.bypassSecurityTrustResourceUrl(doc.output('datauristring', {filename:'bonCommande.pdf'}));
        this.viewPdfModal.show();
      },
      (erreur) => {
        console.log('Erreur lors de la récuparation de la liste des lignes de commande', erreur);
      }
    );

  }

}
