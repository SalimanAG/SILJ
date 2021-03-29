import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Caisse } from '../../../../models/caisse.model';
import { Famille } from '../../../../models/famille.model';
import { AssocierUtilisateurService } from '../../../../services/administration/associer-utilisateur.service';
import { CaisseService } from '../../../../services/administration/caisse.service';
import { UtilisateurService } from '../../../../services/administration/utilisateur.service';
import { ArticleService } from '../../../../services/definition/article.service';
import { OperationCaisseService } from '../../../../services/saisie/operation-caisse.service';
import * as moment from  'moment';
import { ModalDirective } from 'ngx-bootstrap/modal';
import {jsPDF} from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DomSanitizer } from '@angular/platform-browser';
import { data } from 'jquery';
import { ModePaiement } from '../../../../models/mode.model';
import { TypeRecette } from '../../../../models/type.model';
import { LigneOpCaisse } from '../../../../models/ligneopcaisse.model';
import { Immeuble } from '../../../../models/immeuble.model';

@Component({
  selector: 'app-journal-caisse',
  templateUrl: './journal-caisse.component.html',
  styleUrls: ['./journal-caisse.component.css']
})
export class JournalCaisseComponent implements OnInit {

  opened:number = 0;
  clicked:number = 0;
  userAssociatedCaisse:Caisse[] = [];
  famillesArticle:Famille[] = [];
  modePayements:ModePaiement[] = [];
  typeRecettes:TypeRecette[] =[];
  repport1FormsGroup: FormGroup;
  pdfToShow = null;
  @ViewChild('viewPdfModal') public viewPdfModal: ModalDirective;


  constructor(private serviceCaisse:CaisseService, private serviceOpCaisse:OperationCaisseService,
    private serviceUser:UtilisateurService, private serviceAssoUserToCaisse:AssocierUtilisateurService,
    private serviceArticle:ArticleService, private formBulder:FormBuilder, private sanitizer:DomSanitizer) {

      moment.locale('fr');

      this.repport1FormsGroup = this.formBulder.group({
        rep1Caisse:-1,
        rep1ModePaiement:-1,
        rep1DateDebut:[moment(Date.now()).format('yyyy-MM-DD') , Validators.required],
        rep1DateFin:[moment(Date.now()).format('yyyy-MM-DD'), Validators.required]
      });

    }

  ngOnInit(): void {
    this.serviceAssoUserToCaisse.getAllAffecter().subscribe(
      (data) => {
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

    doc.setDrawColor(0);
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(50, 20, 110, 15, 3, 3, 'FD');
    //doc.setFont("Times New Roman");
    doc.setFontSize(25);
    doc.text('JOURNAL DE CAISSE', 59, 30);
    doc.setFontSize(14);
    doc.text('  Période du \t\t'+moment(this.repport1FormsGroup.value['rep1DateDebut']).format('DD/MM/YYYY')+'\t\t\t00 H 00 min', 15, 45);
    doc.text('\t\tAu\t\t'+moment(this.repport1FormsGroup.value['rep1DateFin']).format('DD/MM/YYYY')+'\t\t\t23 H 59 min', 15, 55);

    this.serviceOpCaisse.getAllOpLines().subscribe(
      (data) => {
        this.serviceOpCaisse.getAllEcheances().subscribe(
          (data2) => {
            this.serviceOpCaisse.getAllOp().subscribe(
              (data3) => {

                let totalGeneral = 0;


                if(this.repport1FormsGroup.value['rep1Caisse']==-1){

                  let modePai:String = '';
                  if(this.repport1FormsGroup.value['rep1ModePaiement'] == -1){
                    modePai = 'Tous les modes';
                  }else{
                    modePai = this.modePayements[this.repport1FormsGroup.value['rep1ModePaiement']].libeModPay;
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
                        if(element2.dateOpCaisse >= this.repport1FormsGroup.value['rep1DateDebut'] && element2.dateOpCaisse <= this.repport1FormsGroup.value['rep1DateFin']
                        && element2.caisse.codeCaisse == element.codeCaisse){


                          if(element2.typeRecette.codeTypRec == 'L'){
                            let lig = [];
                            lig.push(element2.numOpCaisse);
                            lig.push(moment(element2.dateOpCaisse).format('DD/MM/YYYY'));
                            lig.push(element2.typeRecette.libeTypRec);
                            let qte:number = 0;
                            let montan:number = 0;
                            let immeuble:Immeuble = null;
                            data2.forEach(element3 => {
                              if(element3.opCaisse.numOpCaisse == element2.numOpCaisse){
                                immeuble = element3.contrat.immeuble;
                                qte++;
                                montan += element3.prix.valueOf();
                              }
                            });
                            lig.push('Location de la valeur Locative '+immeuble.codeIm+' du Site '+immeuble.siteMarcher.codeSite);
                            lig.push('');
                            lig.push(qte);
                            lig.push(montan);

                            lignes.push(lig);
                            totalCaisse += montan;

                          }
                          else {

                            data.forEach(element3 => {
                              let lig = [];
                              if(element3.opCaisse.numOpCaisse == element2.numOpCaisse){

                                lig.push(element2.numOpCaisse);
                                lig.push(moment(element2.dateOpCaisse).format('DD/MM/YYYY'));
                                lig.push(element3.article.codeArticle);
                                lig.push(element3.article.libArticle);
                                lig.push(element3.prixLigneOperCaisse);
                                lig.push(element3.qteLigneOperCaisse);
                                lig.push(element3.prixLigneOperCaisse*element3.qteLigneOperCaisse)
                                totalCaisse+=element3.prixLigneOperCaisse*element3.qteLigneOperCaisse;
                                lignes.push(lig);
                              }
                            });

                          }
                        }
                      });

                    }
                    else{

                      data3.forEach(element2 => {
                        //console.log('Location', element2);
                        if(element2.dateOpCaisse >= this.repport1FormsGroup.value['rep1DateDebut'] && element2.dateOpCaisse <= this.repport1FormsGroup.value['rep1DateFin']
                        && element2.caisse.codeCaisse == element.codeCaisse && element2.modePaiement.codeModPay == this.modePayements[this.repport1FormsGroup.value['rep1ModePaiement']].codeModPay){


                          if(element2.typeRecette.codeTypRec == 'L'){
                            let lig = [];
                            lig.push(element2.numOpCaisse);
                            lig.push(moment(element2.dateOpCaisse).format('DD/MM/YYYY'));
                            lig.push(element2.typeRecette.libeTypRec);
                            let qte:number = 0;
                            let montan:number = 0;
                            let immeuble:Immeuble = null;
                            data2.forEach(element3 => {
                              if(element3.opCaisse.numOpCaisse == element2.numOpCaisse){
                                immeuble = element3.contrat.immeuble;
                                qte++;
                                montan += element3.prix.valueOf();
                              }
                            });
                            lig.push('Location de la valeur Locative '+immeuble.codeIm+' du Site '+immeuble.siteMarcher.codeSite);
                            lig.push('');
                            lig.push(qte);
                            lig.push(montan);

                            lignes.push(lig);
                            totalCaisse += montan;

                          }
                          else {
                            data.forEach(element3 => {
                              let lig = [];
                              if(element3.opCaisse.numOpCaisse == element2.numOpCaisse){

                                lig.push(element2.numOpCaisse);
                                lig.push(moment(element2.dateOpCaisse).format('DD/MM/YYYY'));
                                lig.push(element3.article.codeArticle);
                                lig.push(element3.article.libArticle);
                                lig.push(element3.prixLigneOperCaisse);
                                lig.push(element3.qteLigneOperCaisse);
                                lig.push(element3.prixLigneOperCaisse*element3.qteLigneOperCaisse)
                                totalCaisse+=element3.prixLigneOperCaisse*element3.qteLigneOperCaisse;
                                lignes.push(lig);
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
                      if(element2.dateOpCaisse >= this.repport1FormsGroup.value['rep1DateDebut'] && element2.dateOpCaisse <= this.repport1FormsGroup.value['rep1DateFin']
                      && element2.caisse.codeCaisse == element.codeCaisse){


                        if(element2.typeRecette.codeTypRec == 'L'){
                          let lig = [];
                          lig.push(element2.numOpCaisse);
                          lig.push(moment(element2.dateOpCaisse).format('DD/MM/YYYY'));
                          lig.push(element2.typeRecette.libeTypRec);
                          let qte:number = 0;
                          let montan:number = 0;
                          let immeuble:Immeuble = null;
                          data2.forEach(element3 => {
                            if(element3.opCaisse.numOpCaisse == element2.numOpCaisse){
                              immeuble = element3.contrat.immeuble;
                              qte++;
                              montan += element3.prix.valueOf();
                            }
                          });
                          lig.push('Location de la valeur Locative '+immeuble.codeIm+' du Site '+immeuble.siteMarcher.codeSite);
                          lig.push('');
                          lig.push(qte);
                          lig.push(montan);

                          lignes.push(lig);
                          totalCaisse += montan;

                        }
                        else {
                          data.forEach(element3 => {
                            let lig = [];
                            if(element3.opCaisse.numOpCaisse == element2.numOpCaisse){

                              lig.push(element2.numOpCaisse);
                              lig.push(moment(element2.dateOpCaisse).format('DD/MM/YYYY'));
                              lig.push(element3.article.codeArticle);
                              lig.push(element3.article.libArticle);
                              lig.push(element3.prixLigneOperCaisse);
                              lig.push(element3.qteLigneOperCaisse);
                              lig.push(element3.prixLigneOperCaisse*element3.qteLigneOperCaisse)
                              totalCaisse+=element3.prixLigneOperCaisse*element3.qteLigneOperCaisse;
                              lignes.push(lig);
                            }
                          });

                        }
                      }
                    });

                  }
                  else{

                    data3.forEach(element2 => {
                      //console.log('Location', element2);
                      if(element2.dateOpCaisse >= this.repport1FormsGroup.value['rep1DateDebut'] && element2.dateOpCaisse <= this.repport1FormsGroup.value['rep1DateFin']
                      && element2.caisse.codeCaisse == element.codeCaisse && element2.modePaiement.codeModPay == this.modePayements[this.repport1FormsGroup.value['rep1ModePaiement']].codeModPay){


                        if(element2.typeRecette.codeTypRec == 'L'){
                          let lig = [];
                          lig.push(element2.numOpCaisse);
                          lig.push(moment(element2.dateOpCaisse).format('DD/MM/YYYY'));
                          lig.push(element2.typeRecette.libeTypRec);
                          let qte:number = 0;
                          let montan:number = 0;
                          let immeuble:Immeuble = null;
                          data2.forEach(element3 => {
                            if(element3.opCaisse.numOpCaisse == element2.numOpCaisse){
                              immeuble = element3.contrat.immeuble;
                              qte++;
                              montan += element3.prix.valueOf();
                            }
                          });
                          lig.push('Location de la valeur Locative '+immeuble.codeIm+' du Site '+immeuble.siteMarcher.codeSite);
                          lig.push('');
                          lig.push(qte);
                          lig.push(montan);

                          lignes.push(lig);
                          totalCaisse += montan;

                        }
                        else {
                          data.forEach(element3 => {
                            let lig = [];
                            if(element3.opCaisse.numOpCaisse == element2.numOpCaisse){

                              lig.push(element2.numOpCaisse);
                              lig.push(moment(element2.dateOpCaisse).format('DD/MM/YYYY'));
                              lig.push(element3.article.codeArticle);
                              lig.push(element3.article.libArticle);
                              lig.push(element3.prixLigneOperCaisse);
                              lig.push(element3.qteLigneOperCaisse);
                              lig.push(element3.prixLigneOperCaisse*element3.qteLigneOperCaisse)
                              totalCaisse+=element3.prixLigneOperCaisse*element3.qteLigneOperCaisse;
                              lignes.push(lig);
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
        //console.log('Lignes dOperation de Caisse', data);
      },
      (erreur) => {
        console.log('Erreur lors de la récupération des lignes dOpération de Caisse', erreur);
      }
    );

  }

}
