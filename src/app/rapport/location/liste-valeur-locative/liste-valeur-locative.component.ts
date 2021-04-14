import { Component, OnInit, Sanitizer, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import jsPDF from 'jspdf';
import * as moment from 'moment';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Arrondissement } from '../../../../models/arrondissement.model';
import { Immeuble } from '../../../../models/immeuble.model';
import { Quartier } from '../../../../models/quartier.model';
import { SiteMarcher } from '../../../../models/siteMarcher.model';
import { TypeImmeuble } from '../../../../models/typeImmeuble.model';
import { CommuneService } from '../../../../services/definition/commune.service';
import { ValeurLocativeService } from '../../../../services/definition/valeur-locative.service';
import autotable from 'jspdf-autotable'
import { PrixImmeuble } from '../../../../models/prixImmeuble.model';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-liste-valeur-locative',
  templateUrl: './liste-valeur-locative.component.html',
  styleUrls: ['./liste-valeur-locative.component.css']
})
export class ListeValeurLocativeComponent implements OnInit {

  @ViewChild('appercu') public appercu: ModalDirective;
  vuePdf = null;

  imGroup: FormGroup;
  imLibGroup: FormGroup;
  imOcGroup: FormGroup;
  opened: number = 0;
  clicked: number = 0;


  arrondissements: Arrondissement[];
  arrondissement: Arrondissement;

  quartiers: Quartier[];
  aQuartiers: Quartier[];
  prix: PrixImmeuble[];

  sites: SiteMarcher[];
  aSites: SiteMarcher[];
  site: SiteMarcher;

  typesVL: TypeImmeuble[];
  typeVL: TypeImmeuble;

  immeubles: Immeuble[];
  immeub: Immeuble[];

  constructor(public communeService: CommuneService, public vlService: ValeurLocativeService,
    public fbuilder: FormBuilder, public sanit: DomSanitizer) {
    moment.locale('fr');
    this.imGroup = fbuilder.group({
      arrond: new FormControl(),
      typVlA: new FormControl(),
      qtr: new FormControl(),
      sit: new FormControl()
    });

    this.imLibGroup = fbuilder.group({
      arrondl: new FormControl(),
      typVlAl: new FormControl(),
      qtrl: new FormControl(),
      sitl: new FormControl()
    });

    this.imOcGroup = fbuilder.group({
      arrondo: new FormControl(),
      typVlAo: new FormControl(),
      qtro: new FormControl(),
      sito: new FormControl()
    });
  }

  ngOnInit(): void {
    this.communeService.getAllArrondissement().subscribe(
      data1 => {
        this.arrondissements = data1;
        this.arrondissements = data1
      }
    );

    this.communeService.getAllSiteMarcher().subscribe(
      data2 => {
        this.sites = data2;
        this.aSites = this.sites.filter(q => q.arrondissement.codeArrondi === null)
      }
    );

    this.communeService.getAllQuartier().subscribe(
      data4 => {
        this.quartiers = data4;
        this.aQuartiers = this.quartiers.filter(q => q.arrondissement.codeArrondi === null);
      }
    );

    this.vlService.getAllTypeImmeuble().subscribe(
      data3 => {
        this.typesVL = data3;
      }
    );

    this.vlService.getAllImmeuble().subscribe(
      data5 => {
        this.immeubles = data5;
      }
    );

    this.vlService.getAllPrixImmeuble().subscribe(
      data6 => {
        this.prix = data6;
      }
    );

  }

  filtre(pos: number) {
    if (pos >= 0) {
      this.aQuartiers = this.quartiers.filter(q => q.arrondissement.codeArrondi === this.arrondissements[pos].codeArrondi);
      this.aSites = this.sites.filter(q => q.arrondissement.codeArrondi === this.arrondissements[pos].codeArrondi);
    }
    else {
      this.aQuartiers = [];
      this.aSites = [];
    }
  }

  manageCollapses(inde: number) {
    this.opened = inde;
    this.clicked = inde;
  }

  vlParSite() {
    console.log("Toutes les Valeurs locatives par site");
  }

  vlLibresParSite() {
    console.log("Valeurs locatives Libres par site");
  }

  vlOccupeesParSite() {
    console.log("Valeurs locatives occupées par site");
  }

  vlParArrondissement() {
    let imm = [];
    let list = [];

    const doc = new jsPDF();

    doc.setDrawColor(0);
    doc.setFillColor(255, 255, 255);
    //doc.roundedRect(50, 20, 110, 15, 3, 3, 'FD');
    //doc.setFont("Times New Roman");
    doc.setFontSize(18);
    var val: Number;
    /*this.vlService.getAllImmeuble().subscribe(
      data => {
        this.immeubles = data;*/
    ///////////////////////////////////////////Type spécifié/////////////////
    if (this.imGroup.value['typVlA'] != null) {
      doc.text('\nListe des ' + this.typesVL[this.imGroup.value['typVlA']].libTypIm, 85, 20);

      //////////////////////////////////Type et Arrondissement spécifiés////////////////////
      if (this.imGroup.value['arrond'] != null) {
        doc.text('\nArrondissement : ' + this.arrondissements[this.imGroup.value['arrond']].nomArrondi, 30, 30);

        //////////////////////////////////Type, Arrondissement et quartier spécifiés////////////////////
        if (this.imGroup.value['qtr'] != null) {
          //////////////////////////////////Type, Arrondissement, quartier et site spécifiés////////////////////
          if (this.imGroup.value['sit'] != null) {
            doc.text('Quartier: ' + this.aQuartiers[this.imGroup.value['qtr']].nomQuartier +
              '\tSite : ' + this.aSites[this.imGroup.value['sit']].libSite, 15, 40);

            this.immeub = this.immeubles.filter(im =>
              im.typeImmeuble.codeTypIm === this.typesVL[this.imGroup.value['typVlA']].codeTypIm &&
              im.arrondissement.codeArrondi === this.arrondissements[this.imGroup.value['arrond']].codeArrondi &&
              im.quartier.codeQuartier === this.aQuartiers[this.imGroup.value['qtr']].codeQuartier &&
              im.siteMarcher.codeSite === this.aSites[this.imGroup.value['sit']].codeSite);
            if (this.immeub.length > 0) {
              this.immeub.forEach(elt => {
                imm.push(elt.codeIm);
                imm.push(elt.libIm);
                imm.push(elt.stuctResp);
                imm.push(elt.superficie);
                imm.push(elt.valUnit);
                imm.push(elt.etatIm);
                if (this.prix.find(p => p.dateFinPrixIm == null && p.immeuble.codeIm == elt.codeIm) != null)
                  imm.push(elt.codeIm);
                list.push(imm);
              });
              autotable(doc, {
                theme: 'grid',
                head: [['Code', 'Libellé', 'Structure responsable', 'Surface', 'Valeur U', 'Etat', 'Prix']],
                headStyles: {
                  fillColor: [41, 128, 185],
                  textColor: 255,
                  fontStyle: 'bold',
                },
                margin: { top: 50 },
                body: list,
              });
            }
          }
          //////////////////////////////////Type, Arrondissement et quartier spécifiés site non spécifié////////////////////
          else {
            doc.text('Quartier: ' + this.aQuartiers[this.imGroup.value['qtr']].nomQuartier, 30, 40);

            this.immeub = this.immeubles.filter(im =>
              im.typeImmeuble.codeTypIm === this.typesVL[this.imGroup.value['typVlA']].codeTypIm &&
              im.arrondissement.codeArrondi === this.arrondissements[this.imGroup.value['arrond']].codeArrondi &&
              im.quartier.codeQuartier === this.aQuartiers[this.imGroup.value['qtr']].codeQuartier);
            if (this.immeub.length > 0) {
              this.immeub.forEach(elt => {
                imm.push(elt.codeIm);
                imm.push(elt.libIm);
                imm.push(elt.stuctResp);
                imm.push(elt.siteMarcher.libSite);
                imm.push(elt.superficie);
                imm.push(elt.valUnit);
                imm.push(elt.etatIm);
                if (this.prix.find(p => p.dateFinPrixIm == null && p.immeuble.codeIm == elt.codeIm) != null)
                  imm.push(elt.codeIm);
                list.push(imm);
              });
              autotable(doc, {
                theme: 'grid',
                head: [['Code', 'Libellé', 'Structure responsable', 'Site', 'Surface', 'Valeur U', 'Etat', 'Prix']],
                headStyles: {
                  fillColor: [41, 128, 185],
                  textColor: 255,
                  fontStyle: 'bold',
                },
                margin: { top: 50 },
                body: list,
              });
            }
          }
        }
        /////////////////////////////Avec Type, Arrondissement spécifiés site et sans quartier////////////////////
        else {
          if (this.imGroup.value['sit'] !== null) {
            doc.text('Site : ' + this.aSites[this.imGroup.value['sit']].libSite, 50, 40);

            this.immeub = this.immeubles.filter(im =>
              im.typeImmeuble.codeTypIm === this.typesVL[this.imGroup.value['typVlA']].codeTypIm &&
              im.arrondissement.codeArrondi === this.arrondissements[this.imGroup.value['arrond']].codeArrondi &&
              im.siteMarcher.codeSite === this.aSites[this.imGroup.value['sit']].codeSite);
            if (this.immeubles.length > 0) {
              this.immeub.forEach(elt => {
                imm.push(elt.codeIm);
                imm.push(elt.libIm);
                imm.push(elt.stuctResp);
                imm.push(elt.quartier.nomQuartier);
                imm.push(elt.superficie);
                imm.push(elt.valUnit);
                imm.push(elt.etatIm);
                if (this.prix.find(p => p.dateFinPrixIm == null && p.immeuble.codeIm == elt.codeIm) != null)
                  imm.push(elt.codeIm);
                list.push(imm);
              });
              autotable(doc, {
                theme: 'grid',
                head: [['Code', 'Libellé', 'Structure responsable', 'Quartier', 'Site', 'Surface', 'Valeur U', 'Etat', 'Prix']],
                headStyles: {
                  fillColor: [41, 128, 185],
                  textColor: 255,
                  fontStyle: 'bold',
                },
                margin: { top: 50 },
                body: list,
              });
            }
          }
          else {
            this.immeub = this.immeubles.filter(im =>
              im.typeImmeuble.codeTypIm === this.typesVL[this.imGroup.value['typVlA']].codeTypIm &&
              im.arrondissement.codeArrondi === this.arrondissements[this.imGroup.value['arrond']].codeArrondi);
            if (this.immeubles.length > 0) {
              this.immeub.forEach(elt => {
                imm.push(elt.codeIm);
                imm.push(elt.libIm);
                imm.push(elt.stuctResp);
                imm.push(elt.quartier.nomQuartier);
                imm.push(elt.siteMarcher.libSite);
                imm.push(elt.superficie);
                imm.push(elt.valUnit);
                imm.push(elt.etatIm);
                if (this.prix.find(p => p.dateFinPrixIm == null && p.immeuble.codeIm == elt.codeIm) != null)
                  imm.push(elt.codeIm);
                list.push(imm);
              });
              autotable(doc, {
                theme: 'grid',
                head: [['Code', 'Libellé', 'Structure responsable', 'Site', 'Surface', 'Valeur U', 'Etat', 'Prix']],
                headStyles: {
                  fillColor: [41, 128, 185],
                  textColor: 255,
                  fontStyle: 'bold',
                },
                margin: { top: 50 },
                body: list,
              });
            }
          }
        }
      }
      else {
        this.immeub = this.immeubles.filter(im =>
          im.typeImmeuble.codeTypIm === this.typesVL[this.imGroup.value['typVlA']].codeTypIm);
        if (this.immeubles.length > 0) {
          this.immeub.forEach(elt => {
            imm.push(elt.codeIm);
            imm.push(elt.libIm);
            imm.push(elt.stuctResp);
            imm.push(elt.siteMarcher.libSite);
            imm.push(elt.superficie);
            imm.push(elt.valUnit);
            imm.push(elt.etatIm);
            if (this.prix.find(p => p.dateFinPrixIm == null && p.immeuble.codeIm == elt.codeIm) != null)
              imm.push(elt.codeIm);
            list.push(imm);
          });
          autotable(doc, {
            theme: 'grid',
            head: [['Code', 'Libellé', 'Structure responsable', 'Site', 'Surface', 'Valeur U', 'Etat', 'Prix']],
            headStyles: {
              fillColor: [41, 128, 185],
              textColor: 255,
              fontStyle: 'bold',
            },
            margin: { top: 50 },
            body: list,
          });
        }
      }
    }
    else {
      doc.text('\nListe des valeurs locatives', 80, 20);
    }

    if (this.immeub.length > 0) {
      this.vuePdf = this.sanit.bypassSecurityTrustResourceUrl(doc.output('datauristring', { filename: 'immeuble.pdf' }));
      this.appercu.show();
    }
    else
      console.log('Aucun immeuble ne répond aux citères énoncés');

    //});
  }

  vlLibresParArrondissement() {
    console.log("Valeurs locative libres par Arrondissement");
  }

  vlOccupeesParArrondissement() {
    console.log("Valeurs locatives occupées par Arrondissement");
  }

  vlParType() {
    console.log("Valeurs locative par site");
  }

  vlLibres() {
    console.log("Valeurs locatives libres");
  }

  vlOccupees() {
    console.log("Valeurs locative en location");
  }
}
