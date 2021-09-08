import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Caisse } from '../../../../models/caisse.model';
import { Famille } from '../../../../models/famille.model';
import { ModePaiement } from '../../../../models/mode.model';
import { TypeRecette } from '../../../../models/type.model';
import { AssocierUtilisateurService } from '../../../../services/administration/associer-utilisateur.service';
import { UtilisateurService } from '../../../../services/administration/utilisateur.service';
import { ArticleService } from '../../../../services/definition/article.service';
import { OperationCaisseService } from '../../../../services/saisie/operation-caisse.service';
import * as moment from 'moment';
import {jsPDF} from 'jspdf';
import autoTable from 'jspdf-autotable';
import { exit } from 'process';
import { CaisseService } from '../../../../services/administration/caisse.service';
import { ToolsService } from '../../../../services/utilities/tools.service';

@Component({
  selector: 'app-recap-livrable',
  templateUrl: './recap-livrable.component.html',
  styleUrls: ['./recap-livrable.component.css']
})
export class RecapLivrableComponent implements OnInit {

  opened:number = 0;
  clicked:number = 0;
  userAssociatedCaisse:Caisse[] = [];
  famillesArticle:Famille[] = [];
  modePayements:ModePaiement[] = [];
  typeRecettes:TypeRecette[] =[];
  repport1FormsGroup: FormGroup;
  repport2FormsGroup: FormGroup;
  pdfToShow = null;
  @ViewChild('viewPdfModal') public viewPdfModal: ModalDirective;

  constructor(private formBulder:FormBuilder, private sanitizer:DomSanitizer, private serviceOpCaisse:OperationCaisseService,
    private serviceUser:UtilisateurService, private serviceAssoUserToCaisse:AssocierUtilisateurService,
    private serviceArticle:ArticleService, private serviceCaisse:CaisseService) {
    moment.locale('fr');

    this.repport1FormsGroup = this.formBulder.group({
      rep1Caisse:-1,
      rep1ModePaiement:-1,
      rep1DateDebut:[moment(Date.now()).format('yyyy-MM-DDTHH:mm') , Validators.required],
      rep1DateFin:[moment(Date.now()).format('yyyy-MM-DDTHH:mm'), Validators.required],
      rep1TypLivrable:-1
    });

    this.repport2FormsGroup = this.formBulder.group({
      rep2Caisse:-1,
      rep2FamilleArticle:-1,
      rep2DateDebut:[moment(Date.now()).format('yyyy-MM-DDTHH:mm') , Validators.required],
      rep2DateFin:[moment(Date.now()).format('yyyy-MM-DDTHH:mm'), Validators.required],
      rep2TypLivrable:-1
    });

  }

  ngOnInit(): void {
    this.serviceAssoUserToCaisse.getAllAffecter().subscribe(
      (data) => {
        this.serviceAssoUserToCaisse.getAllAffectUserToArrondi().subscribe(
          (data2) => {
            this.serviceCaisse.getAllCaisse().subscribe(
              (data3) => {

                data2.forEach(element2 => {
                  if(element2.utilisateur.idUtilisateur == this.serviceUser.connectedUser.idUtilisateur){
                    data3.forEach(element3 => {
                      if(element2.arrondissement.codeArrondi == element3.arrondissement.codeArrondi){

                        let exister:boolean = false;
                        this.userAssociatedCaisse.forEach(element0 => {
                          if(element0.codeCaisse == element3.codeCaisse){
                            exister = true;
                            exit;
                          }
                        });

                        if(!exister){
                          this.userAssociatedCaisse.push(element3);
                        }

                      }
                    });
                  }
                });

                data.forEach(element => {
                  if(element.utilisateur.idUtilisateur === this.serviceUser.connectedUser.idUtilisateur){
                    let exist:boolean = false;
                    this.userAssociatedCaisse.forEach(element2 => {
                      if(element.caisse.codeCaisse === element2.codeCaisse){
                        exist = true;
                      }
                    });

                    if(!exist){
                      this.userAssociatedCaisse.push(element.caisse);
                    }

                  }
                });


              },
              (erreur) => {
                console.log('Erreur lors de la récupération de la liste des caisses', erreur);
              }
            );

          },
          (erreur) => {
            console.log('Erreur lors de la récupération de la liste des affectations aux arrondissements', erreur)
          }
        );

      },
      (erreur) => {
        console.log('Erreur lors de la récupération des associations de lUtilisateur à des caisses', erreur);
      }
    );

    this.serviceArticle.getAllFamille().subscribe(
      (data) => {
        this.famillesArticle = data;
      },
      (erreur) => {
        console.log('Erreur lors de la récupération de la liste des articles', erreur);
      }
    );

    this.serviceOpCaisse.getAllModes().subscribe(
      (data) => {
        this.modePayements = data;
      },
      (erreur) => {
        console.log('Erreur lors de la récupération des modes de payements', erreur);
      }
    );

    this.serviceOpCaisse.getAllTypes().subscribe(
      (data) => {
        this.typeRecettes = data;
      },
      (erreur) => {
        console.log('Erreur lors de la récupération des types de recette', erreur);
      }
    );
  }

  manageCollapses(inde:number){
    this.opened = inde;
    this.clicked = inde;
  }

  onRep1GenerateClicked(){

    const doc = new jsPDF();

    /*doc.setDrawColor(0);
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(50, 20, 110, 15, 3, 3, 'FD');
    //doc.setFont("Times New Roman");
    doc.setFontSize(25);
    doc.text('JOURNAL DE CAISSE', 59, 30);
    doc.setFontSize(14);*/
    doc.addImage(ToolsService.ente,'jpeg',0,0,200,30);

    doc.setDrawColor(0);
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(50, 29, 110, 9, 3, 3, 'FD');
    //doc.setFont("Times New Roman");
    doc.setFontSize(15);
    doc.text('JOURNAL DE CAISSE', 75, 35);
    doc.setFontSize(12);

    doc.text('  Période du \t\t'+moment(this.repport1FormsGroup.value['rep1DateDebut']).format('DD/MM/YYYY \t\t\t\t HH:mm'), 15, 45);
    doc.text('\t\tAu\t\t'+moment(this.repport1FormsGroup.value['rep1DateFin']).format('DD/MM/YYYY \t\t\t\t HH:mm'), 15, 55);

    this.serviceOpCaisse.getAllOpLines().subscribe(
      (data) => {
        this.serviceOpCaisse.getAllEcheances().subscribe(
          (data2) => {
            this.serviceOpCaisse.getAllOp().subscribe(
              (data3) => {

                let totalGeneral = 0;


                if(this.repport1FormsGroup.value['rep1Caisse']==-1){

                  let modePai:String = '';
                  let typePres:String = '';
                  if(this.repport1FormsGroup.value['rep1ModePaiement'] == -1){
                    modePai = 'Tous les modes';
                  }else{
                    modePai = this.modePayements[this.repport1FormsGroup.value['rep1ModePaiement']].libeModPay;
                  }

                  if(this.repport1FormsGroup.value['rep1TypLivrable']==-1){
                    typePres = 'Les Livrables (Livrés et Non Livré)';
                  }
                  else if(this.repport1FormsGroup.value['rep1TypLivrable']==0){
                    typePres = 'Les Livrables Livrés';
                  }
                  else if(this.repport1FormsGroup.value['rep1TypLivrable']==1){
                    typePres = 'Les Livrables Non Livrés';
                  }

                  this.userAssociatedCaisse.forEach(element => {
                    autoTable(doc, {
                      theme: 'plain',
                      margin: { top: 68 },
                      columnStyles: {
                        0: { textColor: 0, fontStyle: 'bold', halign: 'right' },
                        1: { textColor: 0, halign: 'left' },
                      },
                      body: [
                        ['Arrondissement / Site : ', element.arrondissement.codeArrondi+' - '+element.arrondissement.nomArrondi],
                        ['Caisse : ', element.codeCaisse+' - '+element.libeCaisse],
                        ['Mode de Paiement : ', modePai+''],
                        ['Type de Prestation : ', typePres+'']
                      ]
                      ,
                    });

                    let totalCaisse = 0;

                    let lignes = [];

                    if(this.repport1FormsGroup.value['rep1ModePaiement'] == -1){
                      //console.log('opCaisses', data3);
                      data3.forEach(element2 => {
                        //console.log('Location', element2);
                        if(new Date(element2.dateOpCaisse).valueOf() >= new Date(this.repport1FormsGroup.value['rep1DateDebut']).valueOf() && new Date(element2.dateOpCaisse).valueOf() <= new Date(this.repport1FormsGroup.value['rep1DateFin']).valueOf()
                        && element2.caisse.codeCaisse == element.codeCaisse){



                          if(element2.typeRecette.codeTypRec != 'L') {
                            data.forEach(element3 => {
                              let lig = [];
                              if(element3.opCaisse.numOpCaisse == element2.numOpCaisse && element3.article.livrableArticle == true){

                                if(this.repport1FormsGroup.value['rep1TypLivrable']==-1){

                                  lig.push(element2.numOpCaisse);
                                  lig.push(moment(element2.dateOpCaisse).format('DD/MM/YYYY à HH:mm'));
                                  lig.push(element3.article.codeArticle);
                                  lig.push(element3.article.libArticle);
                                  lig.push(element3.prixLigneOperCaisse);
                                  lig.push(element3.qteLigneOperCaisse);
                                  lig.push(element3.prixLigneOperCaisse*element3.qteLigneOperCaisse)
                                  totalCaisse+=element3.prixLigneOperCaisse*element3.qteLigneOperCaisse;
                                  lignes.push(lig);
                                }
                                else if(this.repport1FormsGroup.value['rep1TypLivrable']==0 && element3.livre == true){

                                  lig.push(element2.numOpCaisse);
                                  lig.push(moment(element2.dateOpCaisse).format('DD/MM/YYYY à HH:mm'));
                                  lig.push(element3.article.codeArticle);
                                  lig.push(element3.article.libArticle);
                                  lig.push(element3.prixLigneOperCaisse);
                                  lig.push(element3.qteLigneOperCaisse);
                                  lig.push(element3.prixLigneOperCaisse*element3.qteLigneOperCaisse)
                                  totalCaisse+=element3.prixLigneOperCaisse*element3.qteLigneOperCaisse;
                                  lignes.push(lig);
                                }
                                else if(this.repport1FormsGroup.value['rep1TypLivrable']==1 && element3.livre == false){

                                  lig.push(element2.numOpCaisse);
                                  lig.push(moment(element2.dateOpCaisse).format('DD/MM/YYYY à HH:mm'));
                                  lig.push(element3.article.codeArticle);
                                  lig.push(element3.article.libArticle);
                                  lig.push(element3.prixLigneOperCaisse);
                                  lig.push(element3.qteLigneOperCaisse);
                                  lig.push(element3.prixLigneOperCaisse*element3.qteLigneOperCaisse)
                                  totalCaisse+=element3.prixLigneOperCaisse*element3.qteLigneOperCaisse;
                                  lignes.push(lig);
                                }

                              }
                            });

                          }
                        }
                      });

                    }
                    else{

                      data3.forEach(element2 => {
                        //console.log('Location', element2);
                        if(new Date(element2.dateOpCaisse).valueOf() >= new Date(this.repport1FormsGroup.value['rep1DateDebut']).valueOf() && new Date(element2.dateOpCaisse).valueOf() <= new Date(this.repport1FormsGroup.value['rep1DateFin']).valueOf()
                        && element2.caisse.codeCaisse == element.codeCaisse && element2.modePaiement.codeModPay == this.modePayements[this.repport1FormsGroup.value['rep1ModePaiement']].codeModPay){


                          if(element2.typeRecette.codeTypRec != 'L') {
                            data.forEach(element3 => {
                              let lig = [];
                              if(element3.opCaisse.numOpCaisse == element2.numOpCaisse && element3.article.livrableArticle == true){

                                if(this.repport1FormsGroup.value['rep1TypLivrable']==-1){

                                  lig.push(element2.numOpCaisse);
                                  lig.push(moment(element2.dateOpCaisse).format('DD/MM/YYYY à HH:mm'));
                                  lig.push(element3.article.codeArticle);
                                  lig.push(element3.article.libArticle);
                                  lig.push(element3.prixLigneOperCaisse);
                                  lig.push(element3.qteLigneOperCaisse);
                                  lig.push(element3.prixLigneOperCaisse*element3.qteLigneOperCaisse)
                                  totalCaisse+=element3.prixLigneOperCaisse*element3.qteLigneOperCaisse;
                                  lignes.push(lig);
                                }
                                else if(this.repport1FormsGroup.value['rep1TypLivrable']==0 && element3.livre == true){

                                  lig.push(element2.numOpCaisse);
                                  lig.push(moment(element2.dateOpCaisse).format('DD/MM/YYYY à HH:mm'));
                                  lig.push(element3.article.codeArticle);
                                  lig.push(element3.article.libArticle);
                                  lig.push(element3.prixLigneOperCaisse);
                                  lig.push(element3.qteLigneOperCaisse);
                                  lig.push(element3.prixLigneOperCaisse*element3.qteLigneOperCaisse)
                                  totalCaisse+=element3.prixLigneOperCaisse*element3.qteLigneOperCaisse;
                                  lignes.push(lig);
                                }
                                else if(this.repport1FormsGroup.value['rep1TypLivrable']==1 && element3.livre == false){

                                  lig.push(element2.numOpCaisse);
                                  lig.push(moment(element2.dateOpCaisse).format('DD/MM/YYYY à HH:mm'));
                                  lig.push(element3.article.codeArticle);
                                  lig.push(element3.article.libArticle);
                                  lig.push(element3.prixLigneOperCaisse);
                                  lig.push(element3.qteLigneOperCaisse);
                                  lig.push(element3.prixLigneOperCaisse*element3.qteLigneOperCaisse)
                                  totalCaisse+=element3.prixLigneOperCaisse*element3.qteLigneOperCaisse;
                                  lignes.push(lig);
                                }
                              }
                            });

                          }
                        }
                      });


                    }

                    autoTable(doc, {
                      theme: 'grid',
                      head: [['Reçu', 'Date', 'Article', 'Intitulé', 'Prix U', 'Quantité', 'Montant']],
                      headStyles:{
                         fillColor: [41, 128, 185],
                         textColor: 255,
                         fontStyle: 'bold' ,
                      },
                      margin: { top: 10 },
                      body: lignes
                      ,
                    });

                    autoTable(doc, {
                      theme: 'grid',
                      margin: { top: 50, left:100 },
                      columnStyles: {
                        0: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold' },
                      },
                      body: [
                        ['Montant Total Caisse '+element.codeCaisse, totalCaisse],
                      ]
                      ,
                    });

                    totalGeneral += totalCaisse;

                  });
                }
                else {

                  let modePai:String = '';
                  if(this.repport1FormsGroup.value['rep1ModePaiement'] == -1){
                    modePai = 'Tous les modes';
                  }else{
                    modePai = this.modePayements[this.repport1FormsGroup.value['rep1ModePaiement']].libeModPay;
                  }

                  let element:Caisse = this.userAssociatedCaisse[this.repport1FormsGroup.value['rep1Caisse']];

                  autoTable(doc, {
                    theme: 'plain',
                    margin: { top: 68 },
                    columnStyles: {
                      0: { textColor: 0, fontStyle: 'bold', halign: 'right' },
                      1: { textColor: 0, halign: 'left' },
                    },
                    body: [
                      ['Arrondissement / Site : ', element.arrondissement.codeArrondi+' - '+element.arrondissement.nomArrondi],
                      ['Caisse :', element.codeCaisse+' - '+element.libeCaisse],
                      ['Mode de Paiement :', modePai+'']
                    ]
                    ,
                  });

                  let totalCaisse = 0;

                  let lignes = [];

                  if(this.repport1FormsGroup.value['rep1ModePaiement'] == -1){
                    //console.log('opCaisses', data3);
                    data3.forEach(element2 => {
                      //console.log('Location', element2);
                      if(new Date(element2.dateOpCaisse).valueOf() >= new Date(this.repport1FormsGroup.value['rep1DateDebut']).valueOf() && new Date(element2.dateOpCaisse).valueOf()<= new Date(this.repport1FormsGroup.value['rep1DateFin']).valueOf()
                      && element2.caisse.codeCaisse == element.codeCaisse){


                        if(element2.typeRecette.codeTypRec != 'L') {
                          data.forEach(element3 => {
                            let lig = [];
                            if(element3.opCaisse.numOpCaisse == element2.numOpCaisse && element3.article.livrableArticle == true){

                              if(this.repport1FormsGroup.value['rep1TypLivrable']==-1){

                                lig.push(element2.numOpCaisse);
                                lig.push(moment(element2.dateOpCaisse).format('DD/MM/YYYY à HH:mm'));
                                lig.push(element3.article.codeArticle);
                                lig.push(element3.article.libArticle);
                                lig.push(element3.prixLigneOperCaisse);
                                lig.push(element3.qteLigneOperCaisse);
                                lig.push(element3.prixLigneOperCaisse*element3.qteLigneOperCaisse)
                                totalCaisse+=element3.prixLigneOperCaisse*element3.qteLigneOperCaisse;
                                lignes.push(lig);
                              }
                              else if(this.repport1FormsGroup.value['rep1TypLivrable']==0 && element3.livre == true){

                                lig.push(element2.numOpCaisse);
                                lig.push(moment(element2.dateOpCaisse).format('DD/MM/YYYY à HH:mm'));
                                lig.push(element3.article.codeArticle);
                                lig.push(element3.article.libArticle);
                                lig.push(element3.prixLigneOperCaisse);
                                lig.push(element3.qteLigneOperCaisse);
                                lig.push(element3.prixLigneOperCaisse*element3.qteLigneOperCaisse)
                                totalCaisse+=element3.prixLigneOperCaisse*element3.qteLigneOperCaisse;
                                lignes.push(lig);
                              }
                              else if(this.repport1FormsGroup.value['rep1TypLivrable']==1 && element3.livre == false){

                                lig.push(element2.numOpCaisse);
                                lig.push(moment(element2.dateOpCaisse).format('DD/MM/YYYY à HH:mm'));
                                lig.push(element3.article.codeArticle);
                                lig.push(element3.article.libArticle);
                                lig.push(element3.prixLigneOperCaisse);
                                lig.push(element3.qteLigneOperCaisse);
                                lig.push(element3.prixLigneOperCaisse*element3.qteLigneOperCaisse)
                                totalCaisse+=element3.prixLigneOperCaisse*element3.qteLigneOperCaisse;
                                lignes.push(lig);
                              }
                            }
                          });

                        }
                      }
                    });

                  }
                  else{

                    data3.forEach(element2 => {
                      //console.log('Location', element2);
                      if(new Date(element2.dateOpCaisse).valueOf() >= new Date(this.repport1FormsGroup.value['rep1DateDebut']).valueOf() && new Date(element2.dateOpCaisse).valueOf() <= new Date(this.repport1FormsGroup.value['rep1DateFin']).valueOf()
                      && element2.caisse.codeCaisse == element.codeCaisse && element2.modePaiement.codeModPay == this.modePayements[this.repport1FormsGroup.value['rep1ModePaiement']].codeModPay){



                        if(element2.typeRecette.codeTypRec != 'L') {
                          data.forEach(element3 => {
                            let lig = [];
                            if(element3.opCaisse.numOpCaisse == element2.numOpCaisse && element3.article.livrableArticle == true){

                              if(this.repport1FormsGroup.value['rep1TypLivrable']==-1){

                                lig.push(element2.numOpCaisse);
                                lig.push(moment(element2.dateOpCaisse).format('DD/MM/YYYY à HH:mm'));
                                lig.push(element3.article.codeArticle);
                                lig.push(element3.article.libArticle);
                                lig.push(element3.prixLigneOperCaisse);
                                lig.push(element3.qteLigneOperCaisse);
                                lig.push(element3.prixLigneOperCaisse*element3.qteLigneOperCaisse)
                                totalCaisse+=element3.prixLigneOperCaisse*element3.qteLigneOperCaisse;
                                lignes.push(lig);
                              }
                              else if(this.repport1FormsGroup.value['rep1TypLivrable']==0 && element3.livre == true){

                                lig.push(element2.numOpCaisse);
                                lig.push(moment(element2.dateOpCaisse).format('DD/MM/YYYY à HH:mm'));
                                lig.push(element3.article.codeArticle);
                                lig.push(element3.article.libArticle);
                                lig.push(element3.prixLigneOperCaisse);
                                lig.push(element3.qteLigneOperCaisse);
                                lig.push(element3.prixLigneOperCaisse*element3.qteLigneOperCaisse)
                                totalCaisse+=element3.prixLigneOperCaisse*element3.qteLigneOperCaisse;
                                lignes.push(lig);
                              }
                              else if(this.repport1FormsGroup.value['rep1TypLivrable']==1 && element3.livre == false){

                                lig.push(element2.numOpCaisse);
                                lig.push(moment(element2.dateOpCaisse).format('DD/MM/YYYY à HH:mm'));
                                lig.push(element3.article.codeArticle);
                                lig.push(element3.article.libArticle);
                                lig.push(element3.prixLigneOperCaisse);
                                lig.push(element3.qteLigneOperCaisse);
                                lig.push(element3.prixLigneOperCaisse*element3.qteLigneOperCaisse)
                                totalCaisse+=element3.prixLigneOperCaisse*element3.qteLigneOperCaisse;
                                lignes.push(lig);
                              }
                            }
                          });

                        }
                      }
                    });


                  }

                  autoTable(doc, {
                    theme: 'grid',
                    head: [['Reçu', 'Date', 'Article', 'Intitulé', 'Prix U', 'Quantité', 'Montant']],
                    headStyles:{
                       fillColor: [41, 128, 185],
                       textColor: 255,
                       fontStyle: 'bold' ,
                    },
                    margin: { top: 10 },
                    body: lignes
                    ,
                  });

                  autoTable(doc, {
                    theme: 'grid',
                    margin: { top: 50, left:100 },
                    columnStyles: {
                      0: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold' },
                    },
                    body: [
                      ['Montant Total Caisse '+element.codeCaisse, totalCaisse],
                    ]
                    ,
                  });

                  totalGeneral += totalCaisse;


                }

                autoTable(doc, {
                  theme: 'grid',
                  margin: { top: 50 },
                  columnStyles: {
                    0: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold', halign: 'left' },
                    1: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold', halign: 'right' }
                  },
                  body: [
                    ['Total Général', totalGeneral],
                  ]
                  ,
                });

                this.pdfToShow = this.sanitizer.bypassSecurityTrustResourceUrl(doc.output('datauristring', {filename:'journalDeCaisse.pdf'}));
                this.viewPdfModal.show();
              },
              (erreur) => {
                console.log('Erreur lors de la récupération des opérations de caisse', erreur);
              }
            );


          },
          (erreur) => {
            console.log('Erreur lors de la récupération des échéances', erreur);
          }
        );
      },
      (erreur) => {
        console.log('Erreur lors de la récupération des lignes dOpération de Caisse', erreur);
      }
    );

  }


  onRep2GenerateClicked(){

    const doc = new jsPDF();

    this.serviceOpCaisse.getAllOp().subscribe(
      (data) => {

        this.serviceOpCaisse.getAllOpLines().subscribe(
          (data2) => {

            /*doc.setDrawColor(0);
            doc.setFillColor(255, 255, 255);
            doc.roundedRect(50, 20, 110, 15, 3, 3, 'FD');
            doc.setFontSize(20);
            doc.text('RAPPORT DE PRESTATION', 59, 30);
            doc.setFontSize(14);*/

            doc.addImage(ToolsService.ente,'jpeg',0,0,200,30);

            doc.setDrawColor(0);
            doc.setFillColor(255, 255, 255);
            doc.roundedRect(50, 29, 110, 9, 3, 3, 'FD');
            //doc.setFont("Times New Roman");
            doc.setFontSize(15);
            doc.text('RAPPORT DE PRESTATION', 70, 35);
            doc.setFontSize(12);

            doc.text('Etat : Cumul des Recettes par Prestations Livrables', 15, 45);
            doc.setFontSize(12);
            doc.text('  Période du \t\t'+moment(this.repport2FormsGroup.value['rep2DateDebut']).format('DD/MM/YYYY \t\t\t\t HH:mm'), 15, 55);
            doc.text('\t\tAu\t\t'+moment(this.repport2FormsGroup.value['rep2DateFin']).format('DD/MM/YYYY \t\t\t\t HH:mm'), 15, 63);

            let typePres:String = '';

            if(this.repport2FormsGroup.value['rep2TypLivrable']==-1){
              typePres = 'Les Livrables (Livrés et Non Livré)';
            }
            else if(this.repport2FormsGroup.value['rep2TypLivrable']==0){
              typePres = 'Les Livrables Livrés';
            }
            else if(this.repport2FormsGroup.value['rep2TypLivrable']==1){
              typePres = 'Les Livrables Non Livrés';
            }

            //console.log('Type de press', typePres,'Val', this.repport1FormsGroup.value['rep2TypLivrable']);

            if(this.repport2FormsGroup.value['rep2Caisse'] != -1){
              let concernedCaisse:Caisse = this.userAssociatedCaisse[this.repport2FormsGroup.value['rep2Caisse']];

              autoTable(doc, {
                theme: 'plain',
                margin: { top: 68 },
                columnStyles: {
                  0: { textColor: 0, fontStyle: 'bold', halign: 'right' },
                  1: { textColor: 0, halign: 'left' },
                },
                body: [
                  ['Arrondissement / Site : ', concernedCaisse.arrondissement.codeArrondi+' - '+concernedCaisse.arrondissement.nomArrondi],
                  ['Caisse :', concernedCaisse.codeCaisse+' - '+concernedCaisse.libeCaisse],
                  ['Type de Prestation : ', typePres+'']
                ]
                ,
              });

              if(this.repport2FormsGroup.value['rep2FamilleArticle'] == -1){

                let totalCaisse:number = 0;
                let totalGeneral:number = 0;

                this.famillesArticle.forEach(element => {

                  let finded:boolean = false;
                  let lignes = [];
                  let totalFamille:number = 0;


                  data2.forEach(element2 => {
                    if(new Date(element2.opCaisse.dateOpCaisse).valueOf() >= new Date(this.repport2FormsGroup.value['rep2DateDebut']).valueOf() && new Date(element2.opCaisse.dateOpCaisse).valueOf() <= new Date(this.repport2FormsGroup.value['rep2DateFin']).valueOf()
                      && element2.article.famille.codeFamille == element.codeFamille && element2.opCaisse.caisse.codeCaisse == concernedCaisse.codeCaisse && element2.article.livrableArticle == true){

                        if(this.repport2FormsGroup.value['rep2TypLivrable'] == -1){
                          finded = true;
                          let concernedOldLineInde = -1;
                          lignes.forEach((element3, index3) => {
                            if(element3[2] == element2.article.codeArticle){
                              concernedOldLineInde = index3;
                            }
                          });

                          if(concernedOldLineInde == -1){
                            let lig = [];
                            lig.push(element2.opCaisse.numOpCaisse);
                            lig.push(moment(element2.opCaisse.dateOpCaisse).format('DD/MM/YYYY à HH:mm'));
                            lig.push(element2.article.codeArticle);
                            lig.push(element2.article.libArticle);
                            lig.push(element2.prixLigneOperCaisse);
                            lig.push(element2.qteLigneOperCaisse);
                            lig.push(element2.qteLigneOperCaisse*element2.prixLigneOperCaisse);

                            lignes.push(lig);

                            totalFamille += element2.qteLigneOperCaisse*element2.prixLigneOperCaisse;

                          }
                          else{
                            lignes[concernedOldLineInde] [5] += element2.qteLigneOperCaisse;
                            lignes[concernedOldLineInde] [6] += element2.qteLigneOperCaisse*element2.prixLigneOperCaisse;
                            totalFamille += element2.qteLigneOperCaisse*element2.prixLigneOperCaisse;
                          }

                        }
                        else if(this.repport2FormsGroup.value['rep2TypLivrable'] == 0 && element2.livre == true){

                          finded = true;
                          let concernedOldLineInde = -1;
                          lignes.forEach((element3, index3) => {
                            if(element3[2] == element2.article.codeArticle){
                              concernedOldLineInde = index3;
                            }
                          });

                          if(concernedOldLineInde == -1){
                            let lig = [];
                            lig.push(element2.opCaisse.numOpCaisse);
                            lig.push(moment(element2.opCaisse.dateOpCaisse).format('DD/MM/YYYY à HH:mm'));
                            lig.push(element2.article.codeArticle);
                            lig.push(element2.article.libArticle);
                            lig.push(element2.prixLigneOperCaisse);
                            lig.push(element2.qteLigneOperCaisse);
                            lig.push(element2.qteLigneOperCaisse*element2.prixLigneOperCaisse);

                            lignes.push(lig);

                            totalFamille += element2.qteLigneOperCaisse*element2.prixLigneOperCaisse;

                          }
                          else{
                            lignes[concernedOldLineInde] [5] += element2.qteLigneOperCaisse;
                            lignes[concernedOldLineInde] [6] += element2.qteLigneOperCaisse*element2.prixLigneOperCaisse;
                            totalFamille += element2.qteLigneOperCaisse*element2.prixLigneOperCaisse;
                          }


                        }
                        else if(this.repport2FormsGroup.value['rep2TypLivrable'] == 1 && element2.livre == false){

                          finded = true;
                          let concernedOldLineInde = -1;
                          lignes.forEach((element3, index3) => {
                            if(element3[2] == element2.article.codeArticle){
                              concernedOldLineInde = index3;
                            }
                          });

                          if(concernedOldLineInde == -1){
                            let lig = [];
                            lig.push(element2.opCaisse.numOpCaisse);
                            lig.push(moment(element2.opCaisse.dateOpCaisse).format('DD/MM/YYYY à HH:mm'));
                            lig.push(element2.article.codeArticle);
                            lig.push(element2.article.libArticle);
                            lig.push(element2.prixLigneOperCaisse);
                            lig.push(element2.qteLigneOperCaisse);
                            lig.push(element2.qteLigneOperCaisse*element2.prixLigneOperCaisse);

                            lignes.push(lig);

                            totalFamille += element2.qteLigneOperCaisse*element2.prixLigneOperCaisse;

                          }
                          else{
                            lignes[concernedOldLineInde] [5] += element2.qteLigneOperCaisse;
                            lignes[concernedOldLineInde] [6] += element2.qteLigneOperCaisse*element2.prixLigneOperCaisse;
                            totalFamille += element2.qteLigneOperCaisse*element2.prixLigneOperCaisse;
                          }


                        }


                    }
                  });

                  if(finded){
                    autoTable(doc, {
                      theme: 'plain',
                      margin: { top: 8 },
                      columnStyles: {
                        0: { textColor: 0, fontStyle: 'bold', halign: 'right' },
                        1: { textColor: 0, halign: 'left' },
                      },
                      body: [
                        ['Famille : ', element.codeFamille+' - '+element.libFamille]
                      ]
                      ,
                    });

                    autoTable(doc, {
                      theme: 'grid',
                      head: [['Reçu', 'Date', 'Article', 'Intitulé', 'Prix U', 'Quantité', 'Montant']],
                      headStyles:{
                         fillColor: [41, 128, 185],
                         textColor: 255,
                         fontStyle: 'bold' ,
                      },
                      margin: { top: 10 },
                      body: lignes
                      ,
                    });

                    autoTable(doc, {
                      theme: 'grid',
                      margin: { top: 50, left:130 },
                      columnStyles: {
                        0: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold' },
                      },
                      body: [
                        ['Montant Total Famille '+element.codeFamille, totalFamille],
                      ]
                      ,
                    });

                    totalCaisse += totalFamille;

                  }

                });

                autoTable(doc, {
                  theme: 'grid',
                  margin: { top: 50, left:100 },
                  columnStyles: {
                    0: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold' },
                  },
                  body: [
                    ['Montant Total Caisse '+concernedCaisse.codeCaisse, totalCaisse],
                  ]
                  ,
                });

                totalGeneral += totalCaisse;

                autoTable(doc, {
                  theme: 'grid',
                  margin: { top: 50 },
                  columnStyles: {
                    0: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold' },
                  },
                  body: [
                    ['Montant Total Général ', totalGeneral],
                  ]
                  ,
                });


              }
              else{
                let concernedFamille:Famille = this.famillesArticle[this.repport2FormsGroup.value['rep2FamilleArticle']];

                let totalCaisse:number = 0;
                let totalGeneral:number = 0;
                let totalFamille:number = 0;

                let lignes = [];

                  data2.forEach(element2 => {
                    if(new Date(element2.opCaisse.dateOpCaisse).valueOf() >= new Date(this.repport2FormsGroup.value['rep2DateDebut']).valueOf() && new Date(element2.opCaisse.dateOpCaisse).valueOf() <= new Date(this.repport2FormsGroup.value['rep2DateFin']).valueOf()
                      && element2.article.famille.codeFamille == concernedFamille.codeFamille && element2.opCaisse.caisse.codeCaisse == concernedCaisse.codeCaisse && element2.article.livrableArticle == true){

                      if(this.repport2FormsGroup.value['rep2TypLivrable'] == -1){
                        let concernedOldLineInde = -1;
                        lignes.forEach((element3, index3) => {
                          if(element3[2] == element2.article.codeArticle){
                            concernedOldLineInde = index3;
                          }
                        });

                        if(concernedOldLineInde == -1){
                          let lig = [];
                          lig.push(element2.opCaisse.numOpCaisse);
                          lig.push(moment(element2.opCaisse.dateOpCaisse).format('DD/MM/YYYY à HH:mm'));
                          lig.push(element2.article.codeArticle);
                          lig.push(element2.article.libArticle);
                          lig.push(element2.prixLigneOperCaisse);
                          lig.push(element2.qteLigneOperCaisse);
                          lig.push(element2.qteLigneOperCaisse*element2.prixLigneOperCaisse);

                          lignes.push(lig);

                          totalFamille += element2.qteLigneOperCaisse*element2.prixLigneOperCaisse;

                        }
                        else{
                          lignes[concernedOldLineInde] [5] += element2.qteLigneOperCaisse;
                          lignes[concernedOldLineInde] [6] += element2.qteLigneOperCaisse*element2.prixLigneOperCaisse;
                          totalFamille += element2.qteLigneOperCaisse*element2.prixLigneOperCaisse;
                        }
                      }
                      else if(this.repport2FormsGroup.value['rep2TypLivrable'] == 0 && element2.livre == true){

                        let concernedOldLineInde = -1;
                        lignes.forEach((element3, index3) => {
                          if(element3[2] == element2.article.codeArticle){
                            concernedOldLineInde = index3;
                          }
                        });

                        if(concernedOldLineInde == -1){
                          let lig = [];
                          lig.push(element2.opCaisse.numOpCaisse);
                          lig.push(moment(element2.opCaisse.dateOpCaisse).format('DD/MM/YYYY à HH:mm'));
                          lig.push(element2.article.codeArticle);
                          lig.push(element2.article.libArticle);
                          lig.push(element2.prixLigneOperCaisse);
                          lig.push(element2.qteLigneOperCaisse);
                          lig.push(element2.qteLigneOperCaisse*element2.prixLigneOperCaisse);

                          lignes.push(lig);

                          totalFamille += element2.qteLigneOperCaisse*element2.prixLigneOperCaisse;

                        }
                        else{
                          lignes[concernedOldLineInde] [5] += element2.qteLigneOperCaisse;
                          lignes[concernedOldLineInde] [6] += element2.qteLigneOperCaisse*element2.prixLigneOperCaisse;
                          totalFamille += element2.qteLigneOperCaisse*element2.prixLigneOperCaisse;
                        }
                      }
                      else if(this.repport2FormsGroup.value['rep2TypLivrable'] == 1 && element2.livre == false){
                        let concernedOldLineInde = -1;
                        lignes.forEach((element3, index3) => {
                          if(element3[2] == element2.article.codeArticle){
                            concernedOldLineInde = index3;
                          }
                        });

                        if(concernedOldLineInde == -1){
                          let lig = [];
                          lig.push(element2.opCaisse.numOpCaisse);
                          lig.push(moment(element2.opCaisse.dateOpCaisse).format('DD/MM/YYYY à HH:mm'));
                          lig.push(element2.article.codeArticle);
                          lig.push(element2.article.libArticle);
                          lig.push(element2.prixLigneOperCaisse);
                          lig.push(element2.qteLigneOperCaisse);
                          lig.push(element2.qteLigneOperCaisse*element2.prixLigneOperCaisse);

                          lignes.push(lig);

                          totalFamille += element2.qteLigneOperCaisse*element2.prixLigneOperCaisse;

                        }
                        else{
                          lignes[concernedOldLineInde] [5] += element2.qteLigneOperCaisse;
                          lignes[concernedOldLineInde] [6] += element2.qteLigneOperCaisse*element2.prixLigneOperCaisse;
                          totalFamille += element2.qteLigneOperCaisse*element2.prixLigneOperCaisse;
                        }
                      }

                    }
                  });


                    autoTable(doc, {
                      theme: 'plain',
                      margin: { top: 8 },
                      columnStyles: {
                        0: { textColor: 0, fontStyle: 'bold', halign: 'right' },
                        1: { textColor: 0, halign: 'left' },
                      },
                      body: [
                        ['Famille : ', concernedFamille.codeFamille+' - '+concernedFamille.libFamille]
                      ]
                      ,
                    });

                    autoTable(doc, {
                      theme: 'grid',
                      head: [['Reçu', 'Date', 'Article', 'Intitulé', 'Prix U', 'Quantité', 'Montant']],
                      headStyles:{
                         fillColor: [41, 128, 185],
                         textColor: 255,
                         fontStyle: 'bold' ,
                      },
                      margin: { top: 10 },
                      body: lignes
                      ,
                    });

                    autoTable(doc, {
                      theme: 'grid',
                      margin: { top: 50, left:130 },
                      columnStyles: {
                        0: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold' },
                      },
                      body: [
                        ['Montant Total Famille '+concernedFamille.codeFamille, totalFamille],
                      ]
                      ,
                    });

                    totalCaisse += totalFamille;



                autoTable(doc, {
                  theme: 'grid',
                  margin: { top: 50, left:100 },
                  columnStyles: {
                    0: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold' },
                  },
                  body: [
                    ['Montant Total Caisse '+concernedCaisse.codeCaisse, totalCaisse],
                  ]
                  ,
                });

                totalGeneral += totalCaisse;

                autoTable(doc, {
                  theme: 'grid',
                  margin: { top: 50 },
                  columnStyles: {
                    0: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold' },
                  },
                  body: [
                    ['Montant Total Général ', totalGeneral],
                  ]
                  ,
                });



              }






            }
            else{

              let totalGeneral:number = 0;
              this.userAssociatedCaisse.forEach(concernedCaisse => {

              autoTable(doc, {
                theme: 'plain',
                margin: { top: 68 },
                columnStyles: {
                  0: { textColor: 0, fontStyle: 'bold', halign: 'right' },
                  1: { textColor: 0, halign: 'left' },
                },
                body: [
                  ['Arrondissement / Site : ', concernedCaisse.arrondissement.codeArrondi+' - '+concernedCaisse.arrondissement.nomArrondi],
                  ['Caisse :', concernedCaisse.codeCaisse+' - '+concernedCaisse.libeCaisse],
                  ['Type de Prestation : ', typePres+'']
                ]
                ,
              });

              if(this.repport2FormsGroup.value['rep2FamilleArticle'] == -1){

                let totalCaisse:number = 0;

                this.famillesArticle.forEach(element => {

                  let finded:boolean = false;
                  let lignes = [];
                  let totalFamille:number = 0;


                  data2.forEach(element2 => {
                    if(new Date(element2.opCaisse.dateOpCaisse).valueOf() >= new Date(this.repport2FormsGroup.value['rep2DateDebut']).valueOf() && new Date(element2.opCaisse.dateOpCaisse).valueOf() <= new Date(this.repport2FormsGroup.value['rep2DateFin']).valueOf()
                      && element2.article.famille.codeFamille == element.codeFamille && element2.opCaisse.caisse.codeCaisse == concernedCaisse.codeCaisse && element2.article.livrableArticle == true){

                        if(this.repport2FormsGroup.value['rep2TypLivrable'] == -1){
                          finded = true;
                          let concernedOldLineInde = -1;
                          lignes.forEach((element3, index3) => {
                            if(element3[2] == element2.article.codeArticle){
                              concernedOldLineInde = index3;
                            }
                          });

                          if(concernedOldLineInde == -1){
                            let lig = [];
                            lig.push(element2.opCaisse.numOpCaisse);
                            lig.push(moment(element2.opCaisse.dateOpCaisse).format('DD/MM/YYYY à HH:mm'));
                            lig.push(element2.article.codeArticle);
                            lig.push(element2.article.libArticle);
                            lig.push(element2.prixLigneOperCaisse);
                            lig.push(element2.qteLigneOperCaisse);
                            lig.push(element2.qteLigneOperCaisse*element2.prixLigneOperCaisse);

                            lignes.push(lig);

                            totalFamille += element2.qteLigneOperCaisse*element2.prixLigneOperCaisse;

                          }
                          else{
                            lignes[concernedOldLineInde] [5] += element2.qteLigneOperCaisse;
                            lignes[concernedOldLineInde] [6] += element2.qteLigneOperCaisse*element2.prixLigneOperCaisse;
                            totalFamille += element2.qteLigneOperCaisse*element2.prixLigneOperCaisse;
                          }

                        }
                        else if(this.repport2FormsGroup.value['rep2TypLivrable'] == 0 && element2.livre == true){
                          finded = true;
                          let concernedOldLineInde = -1;
                          lignes.forEach((element3, index3) => {
                            if(element3[2] == element2.article.codeArticle){
                              concernedOldLineInde = index3;
                            }
                          });

                          if(concernedOldLineInde == -1){
                            let lig = [];
                            lig.push(element2.opCaisse.numOpCaisse);
                            lig.push(moment(element2.opCaisse.dateOpCaisse).format('DD/MM/YYYY à HH:mm'));
                            lig.push(element2.article.codeArticle);
                            lig.push(element2.article.libArticle);
                            lig.push(element2.prixLigneOperCaisse);
                            lig.push(element2.qteLigneOperCaisse);
                            lig.push(element2.qteLigneOperCaisse*element2.prixLigneOperCaisse);

                            lignes.push(lig);

                            totalFamille += element2.qteLigneOperCaisse*element2.prixLigneOperCaisse;

                          }
                          else{
                            lignes[concernedOldLineInde] [5] += element2.qteLigneOperCaisse;
                            lignes[concernedOldLineInde] [6] += element2.qteLigneOperCaisse*element2.prixLigneOperCaisse;
                            totalFamille += element2.qteLigneOperCaisse*element2.prixLigneOperCaisse;
                          }

                        }
                        else if(this.repport2FormsGroup.value['rep2TypLivrable'] == 1 && element2.livre == false){

                          finded = true;
                          let concernedOldLineInde = -1;
                          lignes.forEach((element3, index3) => {
                            if(element3[2] == element2.article.codeArticle){
                              concernedOldLineInde = index3;
                            }
                          });

                          if(concernedOldLineInde == -1){
                            let lig = [];
                            lig.push(element2.opCaisse.numOpCaisse);
                            lig.push(moment(element2.opCaisse.dateOpCaisse).format('DD/MM/YYYY à HH:mm'));
                            lig.push(element2.article.codeArticle);
                            lig.push(element2.article.libArticle);
                            lig.push(element2.prixLigneOperCaisse);
                            lig.push(element2.qteLigneOperCaisse);
                            lig.push(element2.qteLigneOperCaisse*element2.prixLigneOperCaisse);

                            lignes.push(lig);

                            totalFamille += element2.qteLigneOperCaisse*element2.prixLigneOperCaisse;

                          }
                          else{
                            lignes[concernedOldLineInde] [5] += element2.qteLigneOperCaisse;
                            lignes[concernedOldLineInde] [6] += element2.qteLigneOperCaisse*element2.prixLigneOperCaisse;
                            totalFamille += element2.qteLigneOperCaisse*element2.prixLigneOperCaisse;
                          }


                        }

                    }
                  });

                  if(finded){
                    autoTable(doc, {
                      theme: 'plain',
                      margin: { top: 8 },
                      columnStyles: {
                        0: { textColor: 0, fontStyle: 'bold', halign: 'right' },
                        1: { textColor: 0, halign: 'left' },
                      },
                      body: [
                        ['Famille : ', element.codeFamille+' - '+element.libFamille]
                      ]
                      ,
                    });

                    autoTable(doc, {
                      theme: 'grid',
                      head: [['Reçu', 'Date', 'Article', 'Intitulé', 'Prix U', 'Quantité', 'Montant']],
                      headStyles:{
                         fillColor: [41, 128, 185],
                         textColor: 255,
                         fontStyle: 'bold' ,
                      },
                      margin: { top: 10 },
                      body: lignes
                      ,
                    });

                    autoTable(doc, {
                      theme: 'grid',
                      margin: { top: 50, left:130 },
                      columnStyles: {
                        0: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold' },
                      },
                      body: [
                        ['Montant Total Famille '+element.codeFamille, totalFamille],
                      ]
                      ,
                    });

                    totalCaisse += totalFamille;

                  }

                });

                autoTable(doc, {
                  theme: 'grid',
                  margin: { top: 50, left:100 },
                  columnStyles: {
                    0: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold' },
                  },
                  body: [
                    ['Montant Total Caisse '+concernedCaisse.codeCaisse, totalCaisse],
                  ]
                  ,
                });

                totalGeneral += totalCaisse;




              }
              else{
                let concernedFamille:Famille = this.famillesArticle[this.repport2FormsGroup.value['rep2FamilleArticle']];

                let totalCaisse:number = 0;
                let totalFamille:number = 0;

                let lignes = [];

                  data2.forEach(element2 => {
                    if(new Date(element2.opCaisse.dateOpCaisse).valueOf() >= new Date(this.repport2FormsGroup.value['rep2DateDebut']).valueOf() && new Date(element2.opCaisse.dateOpCaisse).valueOf() <= new Date(this.repport2FormsGroup.value['rep2DateFin']).valueOf()
                      && element2.article.famille.codeFamille == concernedFamille.codeFamille && element2.opCaisse.caisse.codeCaisse == concernedCaisse.codeCaisse && element2.article.livrableArticle == true){

                      if(this.repport2FormsGroup.value['rep2TypLivrable'] == -1){

                        let concernedOldLineInde = -1;
                        lignes.forEach((element3, index3) => {
                          if(element3[2] == element2.article.codeArticle){
                            concernedOldLineInde = index3;
                          }
                        });

                        if(concernedOldLineInde == -1){
                          let lig = [];
                          lig.push(element2.opCaisse.numOpCaisse);
                          lig.push(moment(element2.opCaisse.dateOpCaisse).format('DD/MM/YYYY à HH:mm'));
                          lig.push(element2.article.codeArticle);
                          lig.push(element2.article.libArticle);
                          lig.push(element2.prixLigneOperCaisse);
                          lig.push(element2.qteLigneOperCaisse);
                          lig.push(element2.qteLigneOperCaisse*element2.prixLigneOperCaisse);

                          lignes.push(lig);

                          totalFamille += element2.qteLigneOperCaisse*element2.prixLigneOperCaisse;

                        }
                        else{
                          lignes[concernedOldLineInde] [5] += element2.qteLigneOperCaisse;
                          lignes[concernedOldLineInde] [6] += element2.qteLigneOperCaisse*element2.prixLigneOperCaisse;
                          totalFamille += element2.qteLigneOperCaisse*element2.prixLigneOperCaisse;
                        }

                      }
                      else if(this.repport2FormsGroup.value['rep2TypLivrable'] == 0 && element2.livre == true){

                        let concernedOldLineInde = -1;
                        lignes.forEach((element3, index3) => {
                          if(element3[2] == element2.article.codeArticle){
                            concernedOldLineInde = index3;
                          }
                        });

                        if(concernedOldLineInde == -1){
                          let lig = [];
                          lig.push(element2.opCaisse.numOpCaisse);
                          lig.push(moment(element2.opCaisse.dateOpCaisse).format('DD/MM/YYYY à HH:mm'));
                          lig.push(element2.article.codeArticle);
                          lig.push(element2.article.libArticle);
                          lig.push(element2.prixLigneOperCaisse);
                          lig.push(element2.qteLigneOperCaisse);
                          lig.push(element2.qteLigneOperCaisse*element2.prixLigneOperCaisse);

                          lignes.push(lig);

                          totalFamille += element2.qteLigneOperCaisse*element2.prixLigneOperCaisse;

                        }
                        else{
                          lignes[concernedOldLineInde] [5] += element2.qteLigneOperCaisse;
                          lignes[concernedOldLineInde] [6] += element2.qteLigneOperCaisse*element2.prixLigneOperCaisse;
                          totalFamille += element2.qteLigneOperCaisse*element2.prixLigneOperCaisse;
                        }

                      }
                      else if(this.repport2FormsGroup.value['rep2TypLivrable'] == 1 && element2.livre == false){

                        let concernedOldLineInde = -1;
                        lignes.forEach((element3, index3) => {
                          if(element3[2] == element2.article.codeArticle){
                            concernedOldLineInde = index3;
                          }
                        });

                        if(concernedOldLineInde == -1){
                          let lig = [];
                          lig.push(element2.opCaisse.numOpCaisse);
                          lig.push(moment(element2.opCaisse.dateOpCaisse).format('DD/MM/YYYY à HH:mm'));
                          lig.push(element2.article.codeArticle);
                          lig.push(element2.article.libArticle);
                          lig.push(element2.prixLigneOperCaisse);
                          lig.push(element2.qteLigneOperCaisse);
                          lig.push(element2.qteLigneOperCaisse*element2.prixLigneOperCaisse);

                          lignes.push(lig);

                          totalFamille += element2.qteLigneOperCaisse*element2.prixLigneOperCaisse;

                        }
                        else{
                          lignes[concernedOldLineInde] [5] += element2.qteLigneOperCaisse;
                          lignes[concernedOldLineInde] [6] += element2.qteLigneOperCaisse*element2.prixLigneOperCaisse;
                          totalFamille += element2.qteLigneOperCaisse*element2.prixLigneOperCaisse;
                        }

                      }

                    }
                  });


                    autoTable(doc, {
                      theme: 'plain',
                      margin: { top: 8 },
                      columnStyles: {
                        0: { textColor: 0, fontStyle: 'bold', halign: 'right' },
                        1: { textColor: 0, halign: 'left' },
                      },
                      body: [
                        ['Famille : ', concernedFamille.codeFamille+' - '+concernedFamille.libFamille]
                      ]
                      ,
                    });

                    autoTable(doc, {
                      theme: 'grid',
                      head: [['Reçu', 'Date', 'Article', 'Intitulé', 'Prix U', 'Quantité', 'Montant']],
                      headStyles:{
                         fillColor: [41, 128, 185],
                         textColor: 255,
                         fontStyle: 'bold' ,
                      },
                      margin: { top: 10 },
                      body: lignes
                      ,
                    });

                    autoTable(doc, {
                      theme: 'grid',
                      margin: { top: 50, left:130 },
                      columnStyles: {
                        0: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold' },
                      },
                      body: [
                        ['Montant Total Famille '+concernedFamille.codeFamille, totalFamille],
                      ]
                      ,
                    });

                    totalCaisse += totalFamille;



                autoTable(doc, {
                  theme: 'grid',
                  margin: { top: 50, left:100 },
                  columnStyles: {
                    0: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold' },
                  },
                  body: [
                    ['Montant Total Caisse '+concernedCaisse.codeCaisse, totalCaisse],
                  ]
                  ,
                });

                totalGeneral += totalCaisse;





              }

              autoTable(doc, {
                theme: 'grid',
                margin: { top: 50 },
                columnStyles: {
                  0: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold' },
                },
                body: [
                  ['Montant Total Général ', totalGeneral],
                ]
                ,
              });

              });
            }

            this.pdfToShow = this.sanitizer.bypassSecurityTrustResourceUrl(doc.output('datauristring', {filename:'recapitulatifPrestation.pdf'}));
            this.viewPdfModal.show();

          },
          (erreur) => {
            console.log('Erreur lors de la récupération de la liste des lignes dOpération de caisse', erreur);
          }
        );

      },
      (erreur) => {
        console.log('Erreur lors de la récupération des opérationn de caisse', erreur);
      }
    );


  }


}
