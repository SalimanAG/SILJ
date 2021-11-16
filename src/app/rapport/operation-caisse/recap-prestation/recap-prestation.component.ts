import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Caisse } from '../../../../models/caisse.model';
import { Famille } from '../../../../models/famille.model';
import { ModePaiement } from '../../../../models/mode.model';
import { TypeRecette } from '../../../../models/type.model';
import {jsPDF} from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as moment from  'moment';
import { ArticleService } from '../../../../services/definition/article.service';
import { UtilisateurService } from '../../../../services/administration/utilisateur.service';
import { AssocierUtilisateurService } from '../../../../services/administration/associer-utilisateur.service';
import { OperationCaisseService } from '../../../../services/saisie/operation-caisse.service';
import { element } from 'protractor';
import { exit } from 'process';
import { CaisseService } from '../../../../services/administration/caisse.service';
import { ToolsService } from '../../../../services/utilities/tools.service';

@Component({
  selector: 'app-recap-prestation',
  templateUrl: './recap-prestation.component.html',
  styleUrls: ['./recap-prestation.component.css']
})
export class RecapPrestationComponent implements OnInit {
  

  opened:number = 0;
  clicked:number = 0;
  userAssociatedCaisse:Caisse[] = [];
  famillesArticle:Famille[] = [];
  modePayements:ModePaiement[] = [];
  typeRecettes:TypeRecette[] =[];
  repport1FormsGroup: FormGroup;
  pdfToShow = null;
  @ViewChild('viewPdfModal') public viewPdfModal: ModalDirective;

  constructor(private formBulder:FormBuilder, private sanitizer:DomSanitizer, private serviceOpCaisse:OperationCaisseService,
    private serviceUser:UtilisateurService, private serviceAssoUserToCaisse:AssocierUtilisateurService,
    private serviceArticle:ArticleService, private serviceCaisse:CaisseService, public outils:ToolsService) {

    moment.locale('fr');

      this.repport1FormsGroup = this.formBulder.group({
        rep1Caisse:-1,
        rep1FamilleArticle:-1,
        rep1DateDebut:[moment(Date.now()).format('yyyy-MM-DDTHH:mm') , Validators.required],
        rep1DateFin:[moment(Date.now()).format('yyyy-MM-DDTHH:mm'), Validators.required]
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

    doc.addImage(this.outils.ente,'jpeg',5,0,200,30);

    this.serviceOpCaisse.getAllOp().subscribe(
      (data) => {

        this.serviceOpCaisse.getAllValideLines().subscribe(
          (data2) => {

            doc.setDrawColor(0);
            doc.setFillColor(255, 255, 255);
            doc.roundedRect(50, 35, 110, 9, 3, 3, 'FD');
            doc.setFontSize(20);
            doc.text('RAPPORT DE PRESTATION', 58, 42);
            doc.setFontSize(14);
            doc.text('Etat : Cumul des Recettes par Prestations', 15, 51);
            doc.setFontSize(12);
            doc.text('  Période du \t\t'+moment(this.repport1FormsGroup.value['rep1DateDebut']).format('DD/MM/YYYY \t\tà\t\t HH:mm'), 15, 58);
            doc.text('\t\tAu\t\t'+moment(this.repport1FormsGroup.value['rep1DateFin']).format('DD/MM/YYYY \t\tà\t\t HH:mm'), 15, 66);

            if(this.repport1FormsGroup.value['rep1Caisse'] != -1){
              let concernedCaisse:Caisse = this.userAssociatedCaisse[this.repport1FormsGroup.value['rep1Caisse']];

              autoTable(doc, {
                theme: 'plain',
                margin: { top: 68 },
                columnStyles: {
                  0: { textColor: 0, fontStyle: 'bold', halign: 'right' },
                  1: { textColor: 0, halign: 'left' },
                },
                body: [
                  ['Arrondissement / Site : ', concernedCaisse.arrondissement.codeArrondi+' - '+concernedCaisse.arrondissement.nomArrondi],
                  ['Caisse :', concernedCaisse.codeCaisse+' - '+concernedCaisse.libeCaisse]
                ]
                ,
              });

              if(this.repport1FormsGroup.value['rep1FamilleArticle'] == -1){

                let totalCaisse:number = 0;
                let totalGeneral:number = 0;

                this.famillesArticle.forEach(element => {

                  let finded:boolean = false;
                  let lignes = [];
                  let totalFamille:number = 0;


                  data2.forEach(element2 => {
                    if(new Date(element2.opCaisse.dateOpCaisse).valueOf() >= new Date(this.repport1FormsGroup.value['rep1DateDebut']).valueOf() && new Date(element2.opCaisse.dateOpCaisse).valueOf() <= new Date(this.repport1FormsGroup.value['rep1DateFin']).valueOf()
                      && element2.article.famille.codeFamille == element.codeFamille && element2.opCaisse.caisse.codeCaisse == concernedCaisse.codeCaisse){
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
                let concernedFamille:Famille = this.famillesArticle[this.repport1FormsGroup.value['rep1FamilleArticle']];

                let totalCaisse:number = 0;
                let totalGeneral:number = 0;
                let totalFamille:number = 0;

                let lignes = [];

                  data2.forEach(element2 => {
                    if(new Date(element2.opCaisse.dateOpCaisse).valueOf() >= new Date(this.repport1FormsGroup.value['rep1DateDebut']).valueOf() && new Date(element2.opCaisse.dateOpCaisse).valueOf() <= new Date(this.repport1FormsGroup.value['rep1DateFin']).valueOf()
                      && element2.article.famille.codeFamille == concernedFamille.codeFamille && element2.opCaisse.caisse.codeCaisse == concernedCaisse.codeCaisse){

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
                  ['Caisse :', concernedCaisse.codeCaisse+' - '+concernedCaisse.libeCaisse]
                ]
                ,
              });

              if(this.repport1FormsGroup.value['rep1FamilleArticle'] == -1){

                let totalCaisse:number = 0;

                this.famillesArticle.forEach(element => {

                  let finded:boolean = false;
                  let lignes = [];
                  let totalFamille:number = 0;


                  data2.forEach(element2 => {
                    if(new Date(element2.opCaisse.dateOpCaisse).valueOf() >= new Date(this.repport1FormsGroup.value['rep1DateDebut']).valueOf() && new Date(element2.opCaisse.dateOpCaisse).valueOf() <= new Date(this.repport1FormsGroup.value['rep1DateFin']).valueOf()
                      && element2.article.famille.codeFamille == element.codeFamille && element2.opCaisse.caisse.codeCaisse == concernedCaisse.codeCaisse){
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
                let concernedFamille:Famille = this.famillesArticle[this.repport1FormsGroup.value['rep1FamilleArticle']];

                let totalCaisse:number = 0;
                let totalFamille:number = 0;

                let lignes = [];

                  data2.forEach(element2 => {
                  if(new Date(element2.opCaisse.dateOpCaisse).valueOf() >= new Date(this.repport1FormsGroup.value['rep1DateDebut']).valueOf() && new Date(element2.opCaisse.dateOpCaisse).valueOf() <= new Date(this.repport1FormsGroup.value['rep1DateFin']).valueOf()
                      && element2.article.famille.codeFamille == concernedFamille.codeFamille && element2.opCaisse.caisse.codeCaisse == concernedCaisse.codeCaisse){

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
