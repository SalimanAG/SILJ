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
import { exit } from 'process';
import { ToolsService } from '../../../../services/utilities/tools.service';
import { SearchLinesOpCaissDTO } from '../../../../models/searchLinesOpCaissDTO.model';
import { LignePointVente } from '../../../../models/lignePointVente.model';

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
  annulGroup: FormGroup;
  imputGroup: FormGroup;
  pdfToShow = null;

  lignePv: LignePointVente [] = [];
  @ViewChild('viewPdfModal') public viewPdfModal: ModalDirective;
  deb = new Date();

  constructor(private serviceCaisse:CaisseService, private serviceOpCaisse:OperationCaisseService,
    private serviceUser:UtilisateurService, private serviceAssoUserToCaisse:AssocierUtilisateurService,
    private serviceArticle:ArticleService, private formBulder:FormBuilder, private sanitizer:DomSanitizer) {

    moment.locale('fr');
    this.deb.setHours(0);
    this.deb.setMinutes(0)


      this.repport1FormsGroup = this.formBulder.group({
        rep1Caisse:-1,
        rep1ModePaiement:-1,
        rep1DateDebut:[moment(this.deb).format('yyyy-MM-DDTHH:mm') , Validators.required],
        rep1DateFin:[moment(Date.now()).format('yyyy-MM-DDTHH:mm'), Validators.required]
      });

      this.annulGroup = this.formBulder.group({
        annulCaisse:-1,
        annulMode:-1,
        annulDebut:[moment(this.deb).format('yyyy-MM-DDTHH:mm') , Validators.required],
        annulFin:[moment(Date.now()).format('yyyy-MM-DDTHH:mm'), Validators.required]
      });

      this.imputGroup = this.formBulder.group({
        imputCaisse:-1,
        //annulMode:-1,
        imputDebut:[moment(this.deb).format('yyyy-MM-DDTHH:mm') , Validators.required],
        imputFin:[moment(Date.now()).format('yyyy-MM-DDTHH:mm'), Validators.required]
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

    this.serviceOpCaisse.getAllValideLines().subscribe(
      (data) => {
        this.serviceOpCaisse.getAllEcheancesValides().subscribe(
          (data2) => {
            this.serviceOpCaisse.getOpValide().subscribe(
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
                        //console.log('Essaie', new Date(element2.dateOpCaisse).valueOf(), 'ed', new Date(this.repport1FormsGroup.value['rep1DateDebut']));
                        //console.log('comp1', element2.dateOpCaisse >= this.repport1FormsGroup.value['rep1DateDebut']);
                        //console.log('comp2', element2.dateOpCaisse <= this.repport1FormsGroup.value['rep1DateFin']);
                        if(new Date(element2.dateOpCaisse).valueOf() >= new Date(this.repport1FormsGroup.value['rep1DateDebut']).valueOf() && new Date(element2.dateOpCaisse).valueOf() <= new Date(this.repport1FormsGroup.value['rep1DateFin']).valueOf()
                        && element2.caisse.codeCaisse == element.codeCaisse){


                          if(element2.typeRecette.codeTypRec == 'L'){
                            let lig = [];
                            lig.push(element2.numOpCaisse);
                            lig.push(moment(element2.dateOpCaisse).format('DD/MM/YYYY à HH:mm'));
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
                                lig.push(moment(element2.dateOpCaisse).format('DD/MM/YYYY à HH:mm'));
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
                        if(new Date(element2.dateOpCaisse).valueOf() >= new Date(this.repport1FormsGroup.value['rep1DateDebut']).valueOf() && new Date(element2.dateOpCaisse).valueOf() <= new Date(this.repport1FormsGroup.value['rep1DateFin']).valueOf()
                        && element2.caisse.codeCaisse == element.codeCaisse && element2.modePaiement.codeModPay == this.modePayements[this.repport1FormsGroup.value['rep1ModePaiement']].codeModPay){


                          if(element2.typeRecette.codeTypRec == 'L'){
                            let lig = [];
                            lig.push(element2.numOpCaisse);
                            lig.push(moment(element2.dateOpCaisse).format('DD/MM/YYYY à HH:mm'));
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
                                lig.push(moment(element2.dateOpCaisse).format('DD/MM/YYYY à HH:mm'));
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
                      if(new Date(element2.dateOpCaisse).valueOf() >= new Date(this.repport1FormsGroup.value['rep1DateDebut']).valueOf() && new Date(element2.dateOpCaisse).valueOf() <= new Date(this.repport1FormsGroup.value['rep1DateFin']).valueOf()
                      && element2.caisse.codeCaisse == element.codeCaisse){


                        if(element2.typeRecette.codeTypRec == 'L'){
                          let lig = [];
                          lig.push(element2.numOpCaisse);
                          lig.push(moment(element2.dateOpCaisse).format('DD/MM/YYYY à HH:mm'));
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
                              lig.push(moment(element2.dateOpCaisse).format('DD/MM/YYYY à HH:mm'));
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
                      if(new Date(element2.dateOpCaisse).valueOf() >= new Date(this.repport1FormsGroup.value['rep1DateDebut']).valueOf() && new Date(element2.dateOpCaisse).valueOf() <= new Date(this.repport1FormsGroup.value['rep1DateFin']).valueOf()
                      && element2.caisse.codeCaisse == element.codeCaisse && element2.modePaiement.codeModPay == this.modePayements[this.repport1FormsGroup.value['rep1ModePaiement']].codeModPay){


                        if(element2.typeRecette.codeTypRec == 'L'){
                          let lig = [];
                          lig.push(element2.numOpCaisse);
                          lig.push(moment(element2.dateOpCaisse).format('DD/MM/YYYY à HH:mm'));
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
                              lig.push(moment(element2.dateOpCaisse).format('DD/MM/YYYY à HH:mm'));
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

  annulClicked(){

    const doc = new jsPDF();

    doc.addImage(ToolsService.ente,'jpeg',0,0,200,30);

    doc.setDrawColor(0);
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(50, 29, 110, 9, 3, 3, 'FD');
    //doc.setFont("Times New Roman");
    doc.setFontSize(15);
    doc.text('JOURNAL DES ANNULATIONS', 75, 35);
    doc.setFontSize(12);
    doc.text('  Période du \t\t'+moment(this.annulGroup.value['annulDebut']).format('DD/MM/YYYY \t\t\t\t HH:mm'), 15, 45);
    doc.text('\t\tAu\t\t'+moment(this.annulGroup.value['annulFin']).format('DD/MM/YYYY \t\t\t\t HH:mm'), 15, 55);

    this.serviceOpCaisse.getAllAnnulLines().subscribe(
      (data) => {
        this.serviceOpCaisse.getAllEcheancesAnnulees().subscribe(
          (data2) => {
            this.serviceOpCaisse.getOpAnnulees().subscribe(
              (data3) => {

                let totalGeneral = 0;


                if(this.annulGroup.value['annulCaisse']==-1){

                  let modePai:String = '';
                  if(this.annulGroup.value['annulMode'] == -1){
                    modePai = 'Tous les modes';
                  } else {
                    console.log('mode ', this.annulGroup.value['annulMode'])
                    modePai = this.modePayements[this.annulGroup.value['annulMode']].libeModPay;
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

                    if(this.annulGroup.value['annulMode'] == -1){
                      //console.log('opCaisses', data3);
                      data3.forEach(element2 => {
                        //console.log('Location', element2);
                        //console.log('Essaie', new Date(element2.dateOpCaisse).valueOf(), 'ed', new Date(this.repport1FormsGroup.value['rep1DateDebut']));
                        //console.log('comp1', element2.dateOpCaisse >= this.repport1FormsGroup.value['rep1DateDebut']);
                        //console.log('comp2', element2.dateOpCaisse <= this.repport1FormsGroup.value['rep1DateFin']);
                        if(new Date(element2.dateOpCaisse).valueOf() >= new Date(this.repport1FormsGroup.value['rep1DateDebut']).valueOf() && new Date(element2.dateOpCaisse).valueOf() <= new Date(this.repport1FormsGroup.value['rep1DateFin']).valueOf()
                        && element2.caisse.codeCaisse == element.codeCaisse){


                          if(element2.typeRecette.codeTypRec == 'L'){
                            let lig = [];
                            lig.push(element2.numOpCaisse);
                            lig.push(moment(element2.dateOpCaisse).format('DD/MM/YYYY à HH:mm'));
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
                                lig.push(moment(element2.dateOpCaisse).format('DD/MM/YYYY à HH:mm'));
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
                        if(new Date(element2.dateOpCaisse).valueOf() >= new Date(this.annulGroup.value['annulDebut']).valueOf() && new Date(element2.dateOpCaisse).valueOf() <= new Date(this.repport1FormsGroup.value['rep1DateFin']).valueOf()
                        && element2.caisse.codeCaisse == element.codeCaisse && element2.modePaiement.codeModPay == this.modePayements[this.annulGroup.value['annulMode']].codeModPay){


                          if(element2.typeRecette.codeTypRec == 'L'){
                            let lig = [];
                            lig.push(element2.numOpCaisse);
                            lig.push(moment(element2.dateOpCaisse).format('DD/MM/YYYY à HH:mm'));
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
                                lig.push(moment(element2.dateOpCaisse).format('DD/MM/YYYY à HH:mm'));
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
                  if(this.annulGroup.value['annulMode'] == -1){
                    modePai = 'Tous les modes';
                  }else{
                    modePai = this.modePayements[this.annulGroup.value['annulMode']].libeModPay;
                  }

                  let element:Caisse = this.userAssociatedCaisse[this.annulGroup.value['annulCaisse']];

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

                  if(this.annulGroup.value['annulMode'] == -1){
                    //console.log('opCaisses', data3);
                    data3.forEach(element2 => {
                      //console.log('Location', element2);
                      if(new Date(element2.dateOpCaisse).valueOf() >= new Date(this.annulGroup.value['annulDebut']).valueOf() && new Date(element2.dateOpCaisse).valueOf() <= new Date(this.repport1FormsGroup.value['rep1DateFin']).valueOf()
                      && element2.caisse.codeCaisse == element.codeCaisse){


                        if(element2.typeRecette.codeTypRec == 'L'){
                          let lig = [];
                          lig.push(element2.numOpCaisse);
                          lig.push(moment(element2.dateOpCaisse).format('DD/MM/YYYY à HH:mm'));
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
                              lig.push(moment(element2.dateOpCaisse).format('DD/MM/YYYY à HH:mm'));
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
                      if(new Date(element2.dateOpCaisse).valueOf() >= new Date(this.annulGroup.value['annulDebut']).valueOf() && new Date(element2.dateOpCaisse).valueOf() <= new Date(this.repport1FormsGroup.value['rep1DateFin']).valueOf()
                      && element2.caisse.codeCaisse == element.codeCaisse && element2.modePaiement.codeModPay == this.modePayements[this.annulGroup.value['annulMode']].codeModPay){


                        if(element2.typeRecette.codeTypRec == 'L'){
                          let lig = [];
                          lig.push(element2.numOpCaisse);
                          lig.push(moment(element2.dateOpCaisse).format('DD/MM/YYYY à HH:mm'));
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
                              lig.push(moment(element2.dateOpCaisse).format('DD/MM/YYYY à HH:mm'));
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

  imputClicked(){

    
    const doc = new jsPDF();

    doc.addImage(ToolsService.ente,'jpeg',0,0,200,30);

    doc.setDrawColor(0);
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(50, 29, 110, 9, 3, 3, 'FD');
    //doc.setFont("Times New Roman");
    doc.setFontSize(15);
    doc.text('JOURNAL DES IMPUTATIONS', 70, 35);
    doc.setFontSize(12);
    doc.text('  Période du \t\t'+moment(this.imputGroup.value['imputDebut']).format('DD/MM/YYYY \t\t\t\t HH:mm'), 15, 45);
    doc.text('\t\tAu\t\t'+moment(this.imputGroup.value['imputFin']).format('DD/MM/YYYY \t\t\t\t HH:mm'), 15, 55);
   
    let Cais:String = '';
    if(this.imputGroup.value['imputCaisse'] == -1){
      Cais = 'Toutes les caises';
      
    let element:Caisse = this.userAssociatedCaisse[this.imputGroup.value['imputCaisse']];
    }else{
      Cais = this.userAssociatedCaisse[this.imputGroup.value['imputCaisse']].libeCaisse;
    }

    let element:Caisse = this.userAssociatedCaisse[this.imputGroup.value['imputCaisse']];

    
    let totalCaisse = 0;
        let lignes = [];

    autoTable(doc, {
      theme: 'plain',
      margin: { top: 68 },
      columnStyles: {
        0: { textColor: 0, fontStyle: 'bold', halign: 'right' },
        1: { textColor: 0, halign: 'left' },
      },
      body: [
        ['Arrondissement / Site : ', element.arrondissement.codeArrondi+' - '+element.arrondissement.nomArrondi],
        ['Caisse :', element?.codeCaisse+' - '+element?.libeCaisse]
      ]
      ,
    });

    let searchLinesOpCaissDTO = new SearchLinesOpCaissDTO;
    searchLinesOpCaissDTO.startDateTime = this.imputGroup.value['imputDebut'];
    searchLinesOpCaissDTO.endDateTime = this.imputGroup.value['imputFin'];
    searchLinesOpCaissDTO.codeCaisse = this.userAssociatedCaisse[this.imputGroup.value['imputCaisse']]?.codeCaisse.toString();
    console.log('payload');
    console.log(searchLinesOpCaissDTO);
   

    this.serviceOpCaisse.getAllLinesImputation(searchLinesOpCaissDTO).subscribe(
      (data: LignePointVente[]) => {
        //this.modePayements = data;
        console.log('data',data);
        
        data.forEach(element=>{
          let lig = [];
          
          lig.push(element.pointVente.numPointVente);
          lig.push(moment(element.pointVente.datePointVente).format('DD/MM/YYYY à HH:mm'));
          lig.push(element.article.codeArticle+'-'+element.article.libArticle);
          lig.push(element.quantiteLignePointVente);
          lig.push(element.pulignePointVente);
          lig.push((element.quantiteLignePointVente)*(element.pulignePointVente));
          lig.push(element.pointVente.correspondant.magasinier.nomMagasinier+' '+element.pointVente.correspondant.magasinier.prenomMagasinier);
          totalCaisse +=element.pulignePointVente*element.quantiteLignePointVente;

          lignes.push(lig);

        });
         console.log('data', lignes);

         autoTable(doc, {
          theme: 'grid',
          head: [['Numéro', 'Date', 'Article', 'Qté', 'Prix U','Montant', 'Correspondant']],
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
    
      
    

        this.pdfToShow = this.sanitizer.bypassSecurityTrustResourceUrl(doc.output('datauristring', {filename:'journalImputation.pdf'}));
        this.viewPdfModal.show();

       
        
      },
      (erreur) => {
        console.log('Erreur lors de la récupération des modes de payements', erreur);
      }
    );

    console.log('data', lignes);
  

    


  }


}
