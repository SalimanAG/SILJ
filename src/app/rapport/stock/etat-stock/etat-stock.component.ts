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
  arrondissements:Arrondissement[] = [];
  etreAffecters:EtreAffecte[] = [];

  constructor(private formBulder:FormBuilder, private sanitizer:DomSanitizer, private serviceCorres:CorrespondantService,
    private serviceRegiss:RegisseurService, private serviceCommune:CommuneService,
    private serviceTresorier:TresorierCommunalService) {
    moment.locale('fr');

      this.repport1FormsGroup = this.formBulder.group({
        rep1Carveau:0
      });

      this.repport2FormsGroup = this.formBulder.group({
        rep2Corres:0,
        rep2Arrondi:0
      });
  }

  ngOnInit(): void {
    this.getCarveauMairie();
    this.getCarveauTresor();
    this.getAllArrondissement();
    this.getAllCorrespondant();
    this.getAllEtreAffecter();

    
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

  getAllCorrespByArrondi(inde:number){
    this.correspondantsByArrondi = [];
    this.serviceCorres.getAllEtreAffecte().subscribe(
      (data) => {

        data.forEach(element => {
          if(element.site.arrondissement.codeArrondi == this.arrondissements[inde].codeArrondi){
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
    doc.setDrawColor(0);
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(50, 20, 120, 15, 3, 3, 'FD');
    doc.setFontSize(25);
    doc.text('ETAT DE STOCK', 75, 30);
    doc.setFontSize(14);
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

        this.pdfToShow = this.sanitizer.bypassSecurityTrustResourceUrl(doc.output('datauristring', {filename:'bonAppro.pdf'}));
        this.viewPdfModal.show();

      },
      (erreur) => {
        console.log('Erreur lors de la récupération des Stocks', erreur);
      }
    );



  }

  onRep2GenerateClicked(){

  }

}
