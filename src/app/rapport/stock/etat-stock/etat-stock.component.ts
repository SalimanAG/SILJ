import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as moment from  'moment';
import { ModalDirective } from 'ngx-bootstrap/modal';
import {jsPDF} from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DomSanitizer } from '@angular/platform-browser';
import { CorrespondantService } from '../../../../services/definition/correspondant.service';
import { exit } from 'process';
import { Magasin } from '../../../../models/magasin.model';
import { RegisseurService } from '../../../../services/definition/regisseur.service';
import { TresorierCommunalService } from '../../../../services/definition/tresorier-communal.service';
import { Correspondant } from '../../../../models/Correspondant.model';
import { Arrondissement } from '../../../../models/arrondissement.model';
import { EtreAffecte } from '../../../../models/etreAffecte.model';
import { CommuneService } from '../../../../services/definition/commune.service';
import { AssocierUtilisateurService } from '../../../../services/administration/associer-utilisateur.service';
import { UtilisateurService } from '../../../../services/administration/utilisateur.service';
import { SiteMarcher } from '../../../../models/siteMarcher.model';
import { ToolsService } from '../../../../services/utilities/tools.service';

@Component({
  selector: 'app-etat-stock',
  templateUrl: './etat-stock.component.html',
  styleUrls: ['./etat-stock.component.css']
})
export class EtatStockComponent implements OnInit {

  opened:number = 0;
  clicked:number = 0;
  repport1FormsGroup: FormGroup;
  repport2FormsGroup: FormGroup;
  repport3FormsGroup: FormGroup;
  pdfToShow = null;
  @ViewChild('viewPdfModal') public viewPdfModal: ModalDirective;
  carveauxTresor:Magasin = new Magasin('', '');
  carveauxMairie:Magasin = new Magasin('', '');
  correspondants:Correspondant[] = [];
  correspondantsByArrondi:Correspondant[] = [];
  correspondantsBySite:Correspondant[] = [];
  arrondissements:Arrondissement[] = [];
  affectedArrondissements:Arrondissement[] = [];
  etreAffecters:EtreAffecte[] = [];
  sites:SiteMarcher[] = [];
  sitesByArrondi:SiteMarcher[] = [];

  constructor(private formBulder:FormBuilder, private sanitizer:DomSanitizer, private serviceCorres:CorrespondantService,
    private serviceRegiss:RegisseurService, private serviceCommune:CommuneService,
    private serviceTresorier:TresorierCommunalService, private serviceAssocierUser:AssocierUtilisateurService,
    private serviceUser:UtilisateurService, public serviceTools: ToolsService) {
    moment.locale('fr');

      this.repport1FormsGroup = this.formBulder.group({
        rep1Carveau:0
      });

      this.repport2FormsGroup = this.formBulder.group({
        rep2Corres:-1,
        rep2Arrondi:0
      });

      this.repport3FormsGroup = this.formBulder.group({
        rep3Corres:-1,
        rep3Site:-1,
        rep3Arrondi:0
      });
  }

  ngOnInit(): void {
    this.getCarveauMairie();
    this.getCarveauTresor();
    this.getAllSite();
    this.getAllCorrespondant();
    this.getAllEtreAffecter();
    this.serviceAssocierUser.getAllAffectUserToArrondi().subscribe(
      (data) => {
        data.forEach(element => {
          if(element.utilisateur.idUtilisateur == this.serviceUser.connectedUser.idUtilisateur){
            this.affectedArrondissements.push(element.arrondissement);
          }
        });
        if(this.affectedArrondissements.length != 0){
          this.getAllCorrespByArrondi(0);
          this.serviceCommune.getAllSiteMarcher().subscribe(
            (data2) => {
              this.sites = data2;
              this.sitesByArrondi = [];
              this.sites.forEach(element2 => {
                if(element2.arrondissement.codeArrondi == this.affectedArrondissements[0].codeArrondi){
                  this.sitesByArrondi.push(element2);
                }
              });

              if(this.sitesByArrondi.length != 0){
                this.serviceCorres.getAllEtreAffecte().subscribe(
                  (data3) => {
                    this.etreAffecters = data3;
                    this.getCorresBySite(-1);
                  },
                  (erreur) => {
                    console.log('Erreur lors de la récupération des relations etre affecté', erreur);
                  }
                );
              }

            },
            (erreur) => {
              console.log('Erreur lors de la récupération de la liste des sites', erreur);
            }
          );
        }
      },
      (erreur) => {
        console.log('Erreur lors de la récupération des association dUn user à arrondissement', erreur);
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

  getAllSite(){
    this.serviceCommune.getAllSiteMarcher().subscribe(
      (data) => {
        this.sites = data;
      },
      (erreur) => {
        console.log('Erreur lors de la récupération de la liste des sites', erreur);
      }
    );
  }

  getAllCorrespByArrondi(inde:number){
    this.correspondantsByArrondi = [];
    this.serviceCorres.getAllEtreAffecte().subscribe(
      (data) => {

        data.forEach(element => {
          if(this.affectedArrondissements.length != 0 && element.arrondissement.codeArrondi == this.affectedArrondissements[inde].codeArrondi){
            this.correspondantsByArrondi.push(element.corres);
          }
        });


      },
      (erreur) => {
        console.log('Erreur lors de la récupération des etre affecter', erreur);
      }
    );
  }

  onAddArrondiSelected(){

    this.getAllCorrespByArrondi(this.repport2FormsGroup.value['rep2Arrondi']);
  }

  getAllSiteByArrondi(inde:number){
    this.sitesByArrondi = [];
    this.sites.forEach(element2 => {
      if(this.affectedArrondissements.length != 0 && element2.arrondissement.codeArrondi == this.affectedArrondissements[inde].codeArrondi){
        this.sitesByArrondi.push(element2);
      }
    });
  }

  onAddArrondi2Selected(){
    this.getAllSiteByArrondi(this.repport3FormsGroup.value['rep3Arrondi']);
    this.onAddSiteSelected();
  }

  getCorresBySite(inde:number){
    let concernedSites:SiteMarcher[] = [];
    if(inde == -1){
      concernedSites = this.sitesByArrondi;

    }
    else {
      if(this.sitesByArrondi.length != 0)
      concernedSites.push(this.sitesByArrondi[inde]);
    }
    this.correspondantsBySite = [];

    concernedSites.forEach(element => {

      this.etreAffecters.forEach(element2 => {

        if(element2.site != null && element2.site.codeSite == element.codeSite){
          let exister:boolean = false;
          this.correspondantsBySite.forEach(element3 => {
            if(element3.idCorrespondant == element2.corres.idCorrespondant){
              exister = true;
              exit;
            }
          });

          if(!exister){
            this.correspondantsBySite.push(element2.corres);
          }
        }
      });
    });

  }

  onAddSiteSelected(){
    this.getCorresBySite(this.repport3FormsGroup.value['rep3Site']);
  }

  manageCollapses(inde:number){
    this.opened = inde;
    this.clicked = inde;
  }

  onRep1GenerateClicked(){

    let magasinName:String = '';
    let concernedMag:Magasin = new Magasin('', '');
    if(this.repport1FormsGroup.value['rep1Carveau'] == 0){
      magasinName = 'Carveau Trésor';
      concernedMag = this.carveauxTresor;
    }
    else if(this.repport1FormsGroup.value['rep1Carveau'] == 1){
      magasinName = 'Carveau Mairie';
      concernedMag = this.carveauxMairie;
    }

    const doc = new jsPDF();
    /*doc.setDrawColor(0);
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(50, 20, 120, 15, 3, 3, 'FD');
    doc.setFontSize(25);
    doc.text('ETAT DE STOCK', 75, 30);
    doc.setFontSize(14);*/

    doc.addImage(this.serviceTools.ente,'jpeg',5,0,200,30);

    doc.setDrawColor(0);
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(50, 29, 110, 9, 3, 3, 'FD');
    //doc.setFont("Times New Roman");
    doc.setFontSize(15);
    doc.text('ETAT DE STOCK', 75, 35);
    doc.setFontSize(12);

    doc.text('Magasin :   '+magasinName, 15, 45);
    doc.text('Date : \t'+moment( Date.now()).format('DD/MM/YYYY \tà\t HH : mm '), 15, 55);

    let lignes = [];
    let montantTotal:number = 0;

    this.serviceCorres.getAllStocker().subscribe(
      (data) => {

        data.forEach(element => {
          if(element.magasin.codeMagasin == concernedMag.codeMagasin){
            let lig = [];
            lig.push(element.article.codeArticle);
            lig.push(element.article.libArticle);
            lig.push(element.article.prixVenteArticle);
            lig.push(element.quantiterStocker);
            lig.push(element.quantiterStocker*element.article.prixVenteArticle);
            lig.push('');
            montantTotal += element.quantiterStocker*element.article.prixVenteArticle;
            lignes.push(lig);
          }
        });


        autoTable(doc, {
          theme: 'grid',
          head: [['Article', 'Désignation', 'Prix U.', 'Quantité', 'Montant', 'Observation']],
          headStyles:{
             fillColor: [41, 128, 185],
             textColor: 255,
             fontStyle: 'bold' ,
          },
          margin: { top: 80 },
          body: lignes
          ,
        });

        autoTable(doc, {
          theme: 'grid',
          margin: { top: 100 },
          columnStyles: {
            0: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold', halign:'left' },
            1: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold', halign:'right' },
          },
          body: [
            ['Montant Total', montantTotal],
          ]
          ,
        });

        doc.save();
        //this.pdfToShow = this.sanitizer.bypassSecurityTrustResourceUrl(doc.output('datauristring', {filename:'bonAppro.pdf'}));
        //this.viewPdfModal.show();

      },
      (erreur) => {
        console.log('Erreur lors de la récupération des Stocks', erreur);
      }
    );



  }

  onRep2GenerateClicked(){
    const doc = new jsPDF();
    /*doc.setDrawColor(0);
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(50, 20, 120, 15, 3, 3, 'FD');
    doc.setFontSize(25);
    doc.text('ETAT DE STOCK', 75, 30);
    doc.setFontSize(14);*/

    doc.addImage(this.serviceTools.ente,'jpeg',5,0,200,30);

    doc.setDrawColor(0);
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(50, 29, 110, 9, 3, 3, 'FD');
    //doc.setFont("Times New Roman");
    doc.setFontSize(15);
    doc.text('ETAT DE STOCK', 75, 35);
    doc.setFontSize(12);

    doc.text('Date : \t'+moment( Date.now()).format('DD/MM/YYYY \tà\t HH : mm '), 15, 45);
    autoTable(doc, {
      theme: 'plain',
      margin: { top: 55 },
      columnStyles: {
        0: { textColor: 0, fontStyle: 'bold', halign: 'right' },
        1: { textColor: 0, halign: 'left' },
      },
      body: [
        ['Arrondissement / Site : ', this.affectedArrondissements[this.repport2FormsGroup.value['rep2Arrondi']].codeArrondi+' - '+this.affectedArrondissements[this.repport2FormsGroup.value['rep2Arrondi']].nomArrondi],

      ]
      ,
    });

    this.serviceCorres.getAllStocker().subscribe(
      (data1) => {
        this.serviceCorres.getAllGerer().subscribe(
          (data2) => {


            let selectedCorres:Correspondant[] = [];
            let montantTotal:number = 0;

            if(this.repport2FormsGroup.value['rep2Corres'] == -1){
              selectedCorres = this.correspondantsByArrondi;
            }
            else {
              selectedCorres.push(this.correspondantsByArrondi[this.repport2FormsGroup.value['rep2Corres']]);
            }

            selectedCorres.forEach(element => {

              let lignes = [];
              let sousTotal:number = 0;

              autoTable(doc, {
                theme: 'plain',
                margin: { top: 35 },
                columnStyles: {
                  0: { textColor: 0,  halign: 'right' },
                  1: { textColor: 0, fontStyle: 'bold', halign: 'left' },
                },
                body: [
                  ['Magasin du corresponndant ',element.idCorrespondant+' - '+element.magasinier.nomMagasinier+' '+element.magasinier.prenomMagasinier],

                ]
                ,
              });

              let concernedMagasin:Magasin = null;
              data2.forEach(element2 => {
                if(element2.magasinier.numMAgasinier == element.magasinier.numMAgasinier){
                  concernedMagasin = element2.magasin;
                  exit;
                }
              });

              if(concernedMagasin != null)
              data1.forEach(element1 => {
                if(element1.magasin.codeMagasin == concernedMagasin.codeMagasin){
                  let lig = [];
                  lig.push(element1.article.codeArticle);
                  lig.push(element1.article.libArticle);
                  lig.push(element1.article.prixVenteArticle);
                  lig.push(element1.quantiterStocker);
                  lig.push(element1.article.prixVenteArticle*element1.quantiterStocker);
                  lig.push('');

                  lignes.push(lig);
                  sousTotal+=element1.article.prixVenteArticle*element1.quantiterStocker;
                }
              });
              else console.log('Pas de Magasin trouvé pour un correspondant : ',element);

              autoTable(doc, {
                theme: 'grid',
                head: [['Article', 'Désignation', 'Prix U.', 'Quantité', 'Montant', 'Observation']],
                headStyles:{
                   fillColor: [41, 128, 185],
                   textColor: 255,
                   fontStyle: 'bold' ,
                },
                margin: { top: 80 },
                body: lignes
                ,
              });

              autoTable(doc, {
                theme: 'grid',
                margin: { top: 100, left:100 },
                columnStyles: {
                  0: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold', halign:'left' },
                  1: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold', halign:'right' },
                },
                body: [
                  ['Sous Total Correspondant '+element.idCorrespondant, sousTotal],
                ]
                ,
              });

              montantTotal += sousTotal;

            });

            autoTable(doc, {
              theme: 'grid',
              margin: { top: 100 },
              columnStyles: {
                0: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold', halign:'left' },
                1: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold', halign:'right' },
              },
              body: [
                ['Total Général', montantTotal],
              ]
              ,
            });

            doc.save();
            //this.pdfToShow = this.sanitizer.bypassSecurityTrustResourceUrl(doc.output('datauristring', {filename:'etatStock.pdf'}));
            //this.viewPdfModal.show();



          },
          (erreur) => {
            console.log('Erreur lors de la récupération des gérers', erreur);
          }
        );

      },
      (erreur) => {
        console.log('Erreur lors de la récupération des stocker ', erreur);
      }
    );

  }

  onRep3GenerateClicked(){
    const doc = new jsPDF();
    /*
    doc.setDrawColor(0);
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(50, 20, 120, 15, 3, 3, 'FD');
    doc.setFontSize(25);
    doc.text('ETAT DE STOCK', 75, 30);
    doc.setFontSize(14);*/

    doc.addImage(this.serviceTools.ente,'jpeg',5,0,200,30);

    doc.setDrawColor(0);
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(50, 29, 110, 9, 3, 3, 'FD');
    //doc.setFont("Times New Roman");
    doc.setFontSize(15);
    doc.text('ETAT DE STOCK', 75, 35);
    doc.setFontSize(12);

    doc.text('Date : \t'+moment( Date.now()).format('DD/MM/YYYY \tà\t HH : mm '), 15, 45);

    autoTable(doc, {
      theme: 'plain',
      margin: { top: 55 },
      columnStyles: {
        0: { textColor: 0, fontStyle: 'bold', halign: 'right' },
        1: { textColor: 0, halign: 'left' },
      },
      body: [
        ['Arrondissement : ', this.affectedArrondissements[this.repport3FormsGroup.value['rep3Arrondi']].codeArrondi+' - '+this.affectedArrondissements[this.repport3FormsGroup.value['rep3Arrondi']].nomArrondi],

      ]
      ,
    });

    let selectedSites:SiteMarcher[] = [];
    let montantTotal:number = 0;

    if(this.repport3FormsGroup.value['rep3Site'] == -1){
      selectedSites = this.sitesByArrondi;
    }
    else {
      selectedSites.push(this.sitesByArrondi[this.repport3FormsGroup.value['rep3Site']]);
    }

    this.serviceCorres.getAllStocker().subscribe(
      (data1) => {
        this.serviceCorres.getAllGerer().subscribe(
          (data2) => {

            this.serviceCorres.getAllEtreAffecte().subscribe(
              (data33) => {

                selectedSites.forEach(elementt => {

                  let montantTotalSite:number = 0;

                  autoTable(doc, {
                    theme: 'plain',
                    margin: { top: 55 },
                    columnStyles: {
                      0: { textColor: 0, fontStyle: 'bold', halign: 'right' },
                      1: { textColor: 0, halign: 'left' },
                    },
                    body: [
                      ['Site : ', elementt.codeSite+' - '+elementt.libSite],

                    ]
                    ,
                  });

                  let selectedCorres:Correspondant[] = [];

                  if(this.repport3FormsGroup.value['rep3Corres'] == -1){
                    selectedCorres = this.correspondantsBySite;
                  }
                  else {
                    selectedCorres.push(this.correspondantsBySite[this.repport3FormsGroup.value['rep3Corres']]);
                  }

                  selectedCorres.forEach(element22 => {

                    let belong:boolean = false;

                    data33.forEach(element33 => {

                      if( element33.site != null && element33.corres.idCorrespondant == element22.idCorrespondant && element33.site.codeSite == elementt.codeSite){
                        belong = true;
                        exit;
                      }

                    });


                    if(belong){


                      let lignes = [];
                      let sousTotal:number = 0;

                      autoTable(doc, {
                        theme: 'plain',
                        margin: { top: 35 },
                        columnStyles: {
                          0: { textColor: 0,  halign: 'right' },
                          1: { textColor: 0, fontStyle: 'bold', halign: 'left' },
                        },
                        body: [
                          ['Magasin du corresponndant ',element22.idCorrespondant+' - '+element22.magasinier.nomMagasinier+' '+element22.magasinier.prenomMagasinier],

                        ]
                        ,
                      });

                      let concernedMagasin:Magasin = null;
                      data2.forEach(element2 => {
                        if(element2.magasinier.numMAgasinier == element22.magasinier.numMAgasinier){
                          concernedMagasin = element2.magasin;
                          exit;
                        }
                      });

                      if(concernedMagasin != null)
                      data1.forEach(element1 => {
                        if(element1.magasin.codeMagasin == concernedMagasin.codeMagasin){
                          let lig = [];
                          lig.push(element1.article.codeArticle);
                          lig.push(element1.article.libArticle);
                          lig.push(element1.article.prixVenteArticle);
                          lig.push(element1.quantiterStocker);
                          lig.push(element1.article.prixVenteArticle*element1.quantiterStocker);
                          lig.push('');

                          lignes.push(lig);
                          sousTotal+=element1.article.prixVenteArticle*element1.quantiterStocker;
                        }
                      });
                      else console.log('Pas de Magasin trouvé pour un correspondant : ',element22);

                      autoTable(doc, {
                        theme: 'grid',
                        head: [['Article', 'Désignation', 'Prix U.', 'Quantité', 'Montant', 'Observation']],
                        headStyles:{
                          fillColor: [41, 128, 185],
                          textColor: 255,
                          fontStyle: 'bold' ,
                        },
                        margin: { top: 80 },
                        body: lignes
                        ,
                      });

                      autoTable(doc, {
                        theme: 'grid',
                        margin: { top: 100, left:100 },
                        columnStyles: {
                          0: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold', halign:'left' },
                          1: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold', halign:'right' },
                        },
                        body: [
                          ['Sous Total Correspondant '+element22.idCorrespondant, sousTotal],
                        ]
                        ,
                      });

                      montantTotalSite += sousTotal;

                    }



                  });



                  autoTable(doc, {
                    theme: 'grid',
                    margin: { top: 100, left:40 },
                    columnStyles: {
                      0: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold', halign:'left' },
                      1: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold', halign:'right' },
                    },
                    body: [
                      ['Sous Total Site '+elementt.codeSite, montantTotalSite],
                    ]
                    ,
                  });

                  montantTotal += montantTotalSite;

                });


                autoTable(doc, {
                  theme: 'grid',
                  margin: { top: 100 },
                  columnStyles: {
                    0: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold', halign:'left' },
                    1: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold', halign:'right' },
                  },
                  body: [
                    ['Total Général', montantTotal],
                  ]
                  ,
                });

                doc.save('sal.pdf');

                //this.pdfToShow = this.sanitizer.bypassSecurityTrustResourceUrl(doc.output('datauristring', {filename:'etatStock.pdf'}));
                //this.viewPdfModal.show();



              },
              (erreur) => {
                console.log('Erreur lors de la récupération des être affectés', erreur);
              }
            );


          },
          (erreur) => {
            console.log('Erreur lors de la récupération des gérers', erreur);
          }
        );

      },
      (erreur) => {
        console.log('Erreur lors de la récupération des stocker ', erreur);
      }
    );





    return;



    this.serviceCorres.getAllStocker().subscribe(
      (data1) => {
        this.serviceCorres.getAllGerer().subscribe(
          (data2) => {


            let selectedCorres:Correspondant[] = [];
            let montantTotal:number = 0;

            if(this.repport3FormsGroup.value['rep3Corres'] == -1){
              selectedCorres = this.correspondantsBySite;
            }
            else {
              selectedCorres.push(this.correspondantsBySite[this.repport3FormsGroup.value['rep3Corres']]);
            }

            selectedCorres.forEach(element => {

              let lignes = [];
              let sousTotal:number = 0;

              autoTable(doc, {
                theme: 'plain',
                margin: { top: 35 },
                columnStyles: {
                  0: { textColor: 0,  halign: 'right' },
                  1: { textColor: 0, fontStyle: 'bold', halign: 'left' },
                },
                body: [
                  ['Magasin du corresponndant ',element.idCorrespondant+' - '+element.magasinier.nomMagasinier+' '+element.magasinier.prenomMagasinier],

                ]
                ,
              });

              let concernedMagasin:Magasin = null;
              data2.forEach(element2 => {
                if(element2.magasinier.numMAgasinier == element.magasinier.numMAgasinier){
                  concernedMagasin = element2.magasin;
                  exit;
                }
              });

              if(concernedMagasin != null)
              data1.forEach(element1 => {
                if(element1.magasin.codeMagasin == concernedMagasin.codeMagasin){
                  let lig = [];
                  lig.push(element1.article.codeArticle);
                  lig.push(element1.article.libArticle);
                  lig.push(element1.article.prixVenteArticle);
                  lig.push(element1.quantiterStocker);
                  lig.push(element1.article.prixVenteArticle*element1.quantiterStocker);
                  lig.push('');

                  lignes.push(lig);
                  sousTotal+=element1.article.prixVenteArticle*element1.quantiterStocker;
                }
              });
              else console.log('Pas de Magasin trouvé pour un correspondant : ',element);

              autoTable(doc, {
                theme: 'grid',
                head: [['Article', 'Désignation', 'Prix U.', 'Quantité', 'Montant', 'Observation']],
                headStyles:{
                   fillColor: [41, 128, 185],
                   textColor: 255,
                   fontStyle: 'bold' ,
                },
                margin: { top: 80 },
                body: lignes
                ,
              });

              autoTable(doc, {
                theme: 'grid',
                margin: { top: 100, left:100 },
                columnStyles: {
                  0: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold', halign:'left' },
                  1: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold', halign:'right' },
                },
                body: [
                  ['Sous Total Correspondant '+element.idCorrespondant, sousTotal],
                ]
                ,
              });

              montantTotal += sousTotal;

            });

            autoTable(doc, {
              theme: 'grid',
              margin: { top: 100 },
              columnStyles: {
                0: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold', halign:'left' },
                1: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold', halign:'right' },
              },
              body: [
                ['Total Général', montantTotal],
              ]
              ,
            });

            doc.save();

            //this.pdfToShow = this.sanitizer.bypassSecurityTrustResourceUrl(doc.output('datauristring', {filename:'etatStock.pdf'}));
            //this.viewPdfModal.show();



          },
          (erreur) => {
            console.log('Erreur lors de la récupération des gérers', erreur);
          }
        );

      },
      (erreur) => {
        console.log('Erreur lors de la récupération des stocker ', erreur);
      }
    );

  }

}
