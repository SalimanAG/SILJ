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
import { ToolsService } from '../../../../services/utilities/tools.service';
import { Signer } from '../../../../models/signer.model';
import { Occuper } from '../../../../models/occuper.model';
import { SignataireService } from '../../../../services/administration/signataire-service.service';
import { Tools2Service } from '../../../../services/utilities/tools2.service';
import { EncapCommande } from '../../../../models/EncapCommande';

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

  codeDoc = 'BC';
  listSigner: Signer[] = [];
  listOccuper: Occuper[] = [];

  constructor(private serviceCommande:CommandeService, private serviceExercice:ExerciceService,
    private serviceFrs:FournisseurService, private serviceArticle:ArticleService,
    private formBulder:FormBuilder, private sanitizer:DomSanitizer, public serviceTools:ToolsService
    , private serviceSignataire: SignataireService) {

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
    this.getAllOccuper();
    this.getAllSigner();

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
    const newEncap = new EncapCommande(newComm, this.tempAddLigneCommandes);
    this.serviceCommande.addCommande(newEncap).subscribe(
      (data) => {
   
        console.log('Vérification', data);
        
        this.addComModal.hide();
        this.getAllCommande();
        this.getAllLigneCommande();
      },
      (erreur) => {
        console.log('Erreur lors de la création de la commande', erreur);
      }
    );

    //console.log(this.tempAddLigneCommandes, newComm);
    /*this.serviceCommande.addACommande(newComm).subscribe(
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
    );*/




  }

  onSubmitEditCommandeFormsGroup(){
    const newComm= new Commande(this.editCommandeFormGroup.value['editNumCommande'],
    this.editCommandeFormGroup.value['editDateCommande'],
    this.editCommandeFormGroup.value['editDescription'],
    this.editCommandeFormGroup.value['editDelaiLivraison'],
    this.fournisseurs[this.editCommandeFormGroup.value['editFrs']],
    this.serviceExercice.exoSelectionner,
    this.editCommandeFormGroup.value['editDateRemiseCommande']);

    const newEncapComm= new EncapCommande(newComm, this.tempEditLigneCommandes);

   
    this.serviceCommande.editCommande(this.editCommande.numCommande, newEncapComm).subscribe(
      (data) => {
        console.log("Modification Commande", data);
        
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
   

      this.serviceCommande.deleteCommande(this.suprCommande.numCommande).subscribe(
        (data) => {
          console.log("Suppression de Commande", data);
          
          this.deleteComModal.hide();
          this.getAllCommande();
          this.getAllLigneCommande();
        },
        (erreur) => {
          console.log('Erreur lors de la suppression de la commande', erreur);
        }
      );
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
            lig.push((element.puligneCommande*element.qteLigneCommande-element.remise)*(1+(element.tva/100)));
            lignes.push(lig);

            totalRemise += element.remise;
            totalTVA += (element.puligneCommande*element.qteLigneCommande-element.remise)*(element.tva/100);
            totalHT += element.puligneCommande*element.qteLigneCommande;
            totalTTC += (element.puligneCommande*element.qteLigneCommande-element.remise)*(1+(element.tva/100));

          }

        });
        moment.locale('fr');
        /*doc.setDrawColor(0);
        doc.setFillColor(255, 255, 255);
        doc.roundedRect(50, 20, 110, 15, 3, 3, 'FD');
        //doc.setFont("Times New Roman");
        doc.setFontSize(25);
        doc.text('COMMANDE ACHAT', 62, 30);
        doc.setFontSize(14);*/

        doc.addImage(this.serviceTools.ente,'jpeg',0,0,200,30);

        doc.setDrawColor(0);
        doc.setFillColor(255, 255, 255);
        doc.roundedRect(50, 29, 110, 9, 3, 3, 'FD');
        //doc.setFont("Times New Roman");
        doc.setFontSize(15);
        doc.text('COMMANDE ACHAT', 75, 35);
        doc.setFontSize(12);

        doc.text('Référence : '+commande.numCommande, 15, 45);
        doc.text('Date : '+moment(commande.dateCommande).format('DD/MM/YYYY'), 152, 45);
        doc.text('Fournisseur : '+commande.frs.identiteFrs, 15, 55);
        doc.text('N° IFU Fournisseur : '+commande.frs.numIfuFrs, 15, 65);
        doc.text('Délais de Livraison : '+commande.delaiLivraison+'  Jour(s)', 15, 75);
        doc.text('Description : '+commande.description, 15, 85);
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

        let tabSignataire = [];
        
        Tools2Service.getSignatairesOfAdocAtAmoment(this.codeDoc, commande.dateCommande, this.listOccuper, this.listSigner)
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
        console.log('Erreur lors de la récuparation de la liste des lignes de commande', erreur);
      }
    );

  }

}
