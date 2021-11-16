import { Component, OnInit, Sanitizer, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { jsPDF } from 'jspdf';
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
import { ToolsService } from '../../../../services/utilities/tools.service';
import { ToastrService } from 'ngx-toastr';

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
    public fbuilder: FormBuilder, public sanit: DomSanitizer, public outils: ToolsService,
    public tst: ToastrService) {
    moment.locale('fr');
    this.imGroup = fbuilder.group({
      arrond: new FormControl(-1),
      typVlA: new FormControl(-1),
      qtr: new FormControl(-1),
      sit: new FormControl(-1)
    });

    this.imLibGroup = fbuilder.group({
      arrondl: new FormControl(-1),
      typVlAl: new FormControl(-1),
      qtrl: new FormControl(-1),
      sitl: new FormControl(-1)
    });

    this.imOcGroup = fbuilder.group({
      arrondo: new FormControl(-1),
      typVlAo: new FormControl(-1),
      qtro: new FormControl(-1),
      sito: new FormControl(-1)
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
    const doc = new jsPDF();
    doc.setDrawColor(0);
    doc.setFillColor(255, 255, 255);
    doc.setFontSize(18);
    doc.deletePage(1);
    var val: Number;
    if (this.imGroup.value['typVlA'] != -1) {        //////Type spécifié//////
      if (this.imGroup.value['arrond'] != -1) {     //////Type et Arrondissement spécifiés//////
        if (this.imGroup.value['sit'] != -1) {     //////Type, Arrondissement et sit spécifiés//////
            this.immeub = this.immeubles.filter(im =>
              im.typeImmeuble.codeTypIm === this.typesVL[this.imGroup.value['typVlA']].codeTypIm &&
              im.siteMarcher.codeSite === this.aSites[this.imGroup.value['sit']].codeSite);
            if (this.immeub.length > 0) {
              let list = [];
              this.immeub.forEach(elt => {
                let imm = [];
                imm.push(elt.codeIm);
                imm.push(elt.libIm);
                imm.push(elt.stuctResp);
                imm.push(elt.superficie);
                if (elt.etatIm)
                  imm.push("En contrat");
                else
                  imm.push("Libre");
                if (this.prix.find(p => p.dateFinPrixIm == null && p.immeuble.codeIm == elt.codeIm) != null)
                  imm.push(this.prix.find(p => p.dateFinPrixIm == null && p.immeuble.codeIm == elt.codeIm).prixIm);
                list.push(imm);
              });
              doc.addPage();
              //doc.addImage(this.outils.ente, 'jpeg', 5, 0, 200, 25);
              doc.addImage(this.outils.ente,'jpeg',5,0,200,30);
              autotable(doc, {
              theme: 'plain',
              margin: { top: 35, left: 0, right: 0,},
              body: [
                [
                  this.arrondissements[this.imGroup.value['arrond']].nomArrondi +
                  '\t\t\t' + this.sites[this.imGroup.value['sit']].libSite +
                  ' \nListe des '+this.typesVL[this.imGroup.value['typVlA']].libTypIm]
                ],
                bodyStyles: {
                  fontSize: 14,
                  cellPadding: 1,
                  halign:'center'
              },
            });
              autotable(doc, {
              theme: 'grid',
              head: [['Code', 'Libellé', 'Structure responsable', 'Surface', 'Etat', 'Prix']],
              headStyles: {
                fillColor: [41, 128, 185],
                textColor: 255,
                fontStyle: 'bold',
              },
              margin: { top: 50 },
              body: list,
            });
            this.vuePdf = this.sanit.bypassSecurityTrustResourceUrl(doc.output('datauristring', { filename: 'immeuble.pdf' }));
            this.appercu.show();
          }
          else {
            this.tst.info('Aucune valeur inactive ne répond aux critères spécifiés');
          }
        }
        else {
          this.aSites.forEach(sit => {
            this.immeub = this.immeubles.filter(im =>
              im.typeImmeuble.codeTypIm === this.typesVL[this.imGroup.value['typVlA']].codeTypIm &&
              im.siteMarcher.codeSite === sit.codeSite);
            if (this.immeub.length > 0) {
              let list = [];
              this.immeub.forEach(elt => {
                let imm = [];
                imm.push(elt.codeIm);
                imm.push(elt.libIm);
                imm.push(elt.stuctResp);
                //imm.push(elt.quartier.nomQuartier);
                imm.push(elt.superficie);
                if (elt.etatIm)
                  imm.push("En contrat");
                else
                  imm.push("Libre");
                if (this.prix.find(p => p.dateFinPrixIm == null && p.immeuble.codeIm == elt.codeIm) != null)
                  imm.push(this.prix.find(p => p.dateFinPrixIm == null && p.immeuble.codeIm == elt.codeIm).prixIm);
                list.push(imm);
              });
              doc.addPage();
              //doc.addImage(this.outils.ente, 'jpeg', 5, 5, 200, 25);
              doc.addImage(this.outils.ente,'jpeg',5,0,200,30);
              autotable(doc, {
              theme: 'plain',
              margin: { top: 35, left: 0, right: 0,},
              body: [
                [
                  this.arrondissements[this.imGroup.value['arrond']].nomArrondi +
                  '\t\t\t' + sit.libSite +
                  ' \nListe des '+this.typesVL[this.imGroup.value['typVlA']].libTypIm]
                ],
                bodyStyles: {
                  fontSize: 14,
                  cellPadding: 1,
                  halign:'center'
              },
            });
              autotable(doc, {
                theme: 'grid',
                head: [['Code', 'Libellé', 'Structure responsable', 'Surface', 'Etat', 'Prix']],
                headStyles: {
                  fillColor: [41, 128, 185],
                  textColor: 255,
                  fontStyle: 'bold',
                },
                margin: { top: 50 },
                body: list,
              });
              this.vuePdf = this.sanit.bypassSecurityTrustResourceUrl(doc.output('datauristring', { filename: 'immeuble.pdf' }));
              this.appercu.show();
            }
            else {
              this.tst.info(sit.libSite+' : Aucune valeur inactive ne répond aux critères spécifiés');
            }
          });
        }
      }
      else {
        this.arrondissements.forEach(ar => {
          this.aSites = this.sites.filter(s => s.arrondissement.codeArrondi == ar.codeArrondi);
          this.aSites.forEach(sit => {
            this.immeub = this.immeubles.filter(im =>
              im.typeImmeuble.codeTypIm == this.typesVL[this.imGroup.value['typVlA']].codeTypIm &&
              im.siteMarcher.codeSite == sit.codeSite);
            if (this.immeub.length > 0) {
              let list = [];
              this.immeub.forEach(elt => {
                let imm = [];
                imm.push(elt.codeIm);
                imm.push(elt.libIm);
                imm.push(elt.stuctResp);
                imm.push(elt.quartier.nomQuartier);
                imm.push(elt.superficie);
                if (elt.etatIm)
                  imm.push("En contrat");
                else
                  imm.push("Libre");
                if (this.prix.find(p => p.dateFinPrixIm == null && p.immeuble.codeIm == elt.codeIm) != null)
                  imm.push(this.prix.find(p => p.dateFinPrixIm == null && p.immeuble.codeIm == elt.codeIm).prixIm);
                list.push(imm);
              });
              doc.addPage();
              //doc.addImage(this.outils.ente, 'jpeg', 5, 5, 200, 25);
              doc.addImage(this.outils.ente,'jpeg',5,0,200,30);
              autotable(doc, {
              theme: 'plain',
              margin: { top: 35, left: 30, right: 25,},
              body: [
                [
                  this.arrondissements[this.imGroup.value['arrond']].nomArrondi +
                  '\t\t\t' + sit.libSite +
                  ' \nListe des '+this.typesVL[this.imGroup.value['typVlA']].libTypIm]
                ],
                bodyStyles: {
                  fontSize: 14,
                  cellPadding: 1,
                  halign:'center'
              },
            });
              autotable(doc, {
                theme: 'grid',
                head: [['Code', 'Libellé', 'Structure responsable', 'Surface', 'Etat', 'Prix']],
                headStyles: {
                  fillColor: [41, 128, 185],
                  textColor: 255,
                  fontStyle: 'bold',
                },
                margin: { top: 50 },
                body: list,
              });
              this.vuePdf = this.sanit.bypassSecurityTrustResourceUrl(doc.output('datauristring', { filename: 'immeuble.pdf' }));
              this.appercu.show();
            }
            else {
            this.tst.info(sit.libSite+' : Aucune valeur inactive ne répond aux critères spécifiés');
            }
          });
        });
      }
    }
    else {
      if (this.imGroup.value['arrond'] == -1) {
        this.arrondissements.forEach(ar => {
          this.aSites = this.sites.filter(s => s.arrondissement.codeArrondi == ar.codeArrondi);
          this.aSites.forEach(sit => {
            this.typesVL.forEach(tvl => {
              this.immeub = this.immeubles.filter(im => im.siteMarcher.codeSite == sit.codeSite &&
                im.typeImmeuble.codeTypIm == tvl.codeTypIm);
              if (this.immeub.length > 0) {
                let list = [];
                this.immeub.forEach(elt => {
                  let imm = [];
                  imm.push(elt.codeIm);
                  imm.push(elt.libIm);
                  imm.push(elt.stuctResp);
                  imm.push(elt.superficie);
                  if (elt.etatIm)
                    imm.push("En contrat");
                  else
                    imm.push("Libre");
                    imm.push(elt.valUnit);
                    if (this.prix.find(p => p.dateFinPrixIm == null && p.immeuble.codeIm == elt.codeIm) != null)
                      imm.push(this.prix.find(p => p.dateFinPrixIm == null && p.immeuble.codeIm == elt.codeIm).prixIm);
                  imm.push(elt.quartier.nomQuartier)
                    list.push(imm);
                  });
                doc.addPage();
                //doc.addImage(this.outils.ente, 'jpeg', 5, 5, 200, 20);
                doc.addImage(this.outils.ente,'jpeg',5,0,200,30);
                autotable(doc, {
                theme: 'plain',
                margin: { top: 35, left: 0, right: 0,},
                    body: [
                      ['' + sit.arrondissement.nomArrondi + '\t\t\t' + sit.libSite +
                        '\nListe des : ' + tvl.libTypIm]
                    ],
                  bodyStyles: {
                    fontSize: 14,
                    cellPadding: 1,
                    halign:'center'
                },
              });
               autotable(doc, {
                  theme: 'grid',
                  head: [['Code', 'Libellé', 'Structure responsable', 'Surface', 'Etat', 'Prix', 'Quartier']],
                  headStyles: {
                    fillColor: [41, 128, 185],
                    textColor: 255,
                    fontStyle: 'bold',
                  },
                  margin: { top: 50 },
                  body: list,
                });
                this.vuePdf = this.sanit.bypassSecurityTrustResourceUrl(doc.output('datauristring', { filename: 'immeuble.pdf' }));
                this.appercu.show();
              }
            });
          });
        });
      }
      else {
        this.aSites.forEach(sit => {
          this.typesVL.forEach(typ => {
            this.immeub = this.immeubles.filter(im =>
              im.siteMarcher.codeSite == sit.codeSite && im.typeImmeuble.codeTypIm == typ.codeTypIm);
            if (this.immeub.length > 0) {
              let list = [];
              this.immeub.forEach(elt => {
                let imm = [];
                  imm.push(elt.codeIm);
                  imm.push(elt.libIm);
                  imm.push(elt.stuctResp);
                  imm.push(elt.superficie);
                  if (elt.etatIm)
                    imm.push("En contrat");
                  else
                    imm.push("Libre");
                  imm.push(elt.valUnit);
                  if (this.prix.find(p => p.dateFinPrixIm == null && p.immeuble.codeIm == elt.codeIm) != null)
                    imm.push(this.prix.find(p => p.dateFinPrixIm == null && p.immeuble.codeIm == elt.codeIm).prixIm);
                imm.push(elt.quartier.nomQuartier);
                list.push(imm);
                });
                doc.addPage();
                //doc.addImage(this.outils.ente, 'jpeg', 5, 5, 200, 25);
                doc.addImage(this.outils.ente,'jpeg',5,0,200,30);
                autotable(doc, {
                  theme: 'plain',
                  margin: { top: 35, left: 0, right: 0,},
                      body: [
                        ['' + sit.arrondissement.nomArrondi + '\t\t\t' + sit.libSite +
                          '\nListe des : ' + typ.libTypIm]
                      ],
                    bodyStyles: {
                      fontSize: 14,
                      cellPadding: 1,
                      halign:'center'
                  },
                });
                autotable(doc, {
                  theme: 'grid',
                  head: [['Code', 'Libellé', 'Structure responsable', 'Surface', 'Etat', 'Prix', 'Quartier']],
                  headStyles: {
                    fillColor: [41, 128, 185],
                    textColor: 255,
                    fontStyle: 'bold',
                  },
                  margin: { top: 50 },
                  body: list,
                });
              this.vuePdf = this.sanit.bypassSecurityTrustResourceUrl(doc.output('datauristring', { filename: 'immeuble.pdf' }));
              this.appercu.show();
            }
          });
        });
      }
    }
  }

  vlLibresParSite() {
    const doc = new jsPDF();
    doc.text('' + doc.getNumberOfPages(), 55, 5)
    doc.setDrawColor(0);
    doc.setFillColor(255, 255, 255);
    doc.setFontSize(18);
    doc.deletePage(1);
    var val: Number;
    if (this.imLibGroup.value['typVlAl'] != -1) {        //////Type spécifié//////
      if (this.imLibGroup.value['arrondl'] != -1) {     //////Type et Arrondissement spécifiés//////
        if (this.imLibGroup.value['sitl'] != -1) {     //////Type, Arrondissement et sit spécifiés//////
          this.immeub = this.immeubles.filter(im => im.etatIm == false &&
            im.typeImmeuble.codeTypIm === this.typesVL[this.imLibGroup.value['typVlAl']].codeTypIm &&
            im.siteMarcher.codeSite === this.aSites[this.imLibGroup.value['sitl']].codeSite);
            if (this.immeub.length > 0) {
              let list = [];
              this.immeub.forEach(elt => {
                let imm = [];
                imm.push(elt.codeIm);
                imm.push(elt.libIm);
                imm.push(elt.stuctResp);
                imm.push(elt.superficie);
                if (this.prix.find(p => p.dateFinPrixIm == null && p.immeuble.codeIm == elt.codeIm) != null)
                  imm.push(this.prix.find(p => p.dateFinPrixIm == null && p.immeuble.codeIm == elt.codeIm).prixIm);
                list.push(imm);
              });
              doc.addPage();
              doc.addImage(this.outils.ente, 5, 5, 200, 20);
              autotable(doc, {
                  theme: 'plain',
                  margin: { top: 35, left: 30, right: 25,},
                      body: [
                        ['' + this.arrondissements[this.imLibGroup.value['arondl']].nomArrondi + '\t\t\t' +
                        this.sites[this.imLibGroup.value['sitl']].libSite +
                          '\nListe des : ' + this.typesVL[this.imLibGroup.value['typVlAl']].libTypIm]
                      ],
                    bodyStyles: {
                      fontSize: 14,
                      cellPadding: 1,
                      halign:'center'
                  },
                });
              autotable(doc, {
                theme: 'grid',
                head: [['Code', 'Libellé', 'Structure responsable', 'Surface', 'Prix actuel']],
                headStyles: {
                  fillColor: [41, 128, 185],
                  textColor: 255,
                  fontStyle: 'bold',
                },
                margin: { top: 50 },
                body: list,
              });
              this.vuePdf = this.sanit.bypassSecurityTrustResourceUrl(doc.output('datauristring', { filename: 'immeuble.pdf' }));
              this.appercu.show();
            }
            else {
              this.tst.info('Aucune valeur inactive ne répond aux critères spécifiés');
            }
        }
        else {
          this.aSites.forEach(sit => {
            this.immeub = this.immeubles.filter(im => im.etatIm == false &&
              im.typeImmeuble.codeTypIm === this.typesVL[this.imLibGroup.value['typVlAl']].codeTypIm &&
              im.siteMarcher.codeSite === sit.codeSite);
            if (this.immeub.length > 0) {
              let list = [];
              this.immeub.forEach(elt => {
                let imm = [];
                imm.push(elt.codeIm);
                imm.push(elt.libIm);
                imm.push(elt.stuctResp);
                imm.push(elt.quartier.nomQuartier);
                imm.push(elt.superficie);
                  if (this.prix.find(p => p.dateFinPrixIm == null && p.immeuble.codeIm == elt.codeIm) != null)
                    imm.push(elt.codeIm);
                  list.push(imm);
                });
                doc.addPage();
              //doc.addImage(this.outils.ente, 5, 5, 200, 20);
              doc.addImage(this.outils.ente,'jpeg',5,0,200,30);
              autotable(doc, {
                  theme: 'plain',
                  margin: { top: 35, left: 30, right: 25,},
                      body: [
                        ['' + this.arrondissements[this.imLibGroup.value['arondl']].nomArrondi + '\t\t\t' +
                        sit.libSite +
                          '\nListe des : ' + this.typesVL[this.imLibGroup.value['typVlAl']].libTypIm+'s libres']
                      ],
                    bodyStyles: {
                      fontSize: 14,
                      cellPadding: 1,
                      halign:'center'
                  },
                });
                autotable(doc, {
                  theme: 'grid',
                  head: [['Code', 'Libellé', 'Structure responsable', 'Surface', 'Etat', 'Prix']],
                  headStyles: {
                    fillColor: [41, 128, 185],
                    textColor: 255,
                    fontStyle: 'bold',
                  },
                  margin: { top: 50 },
                  body: list,
                });
              this.vuePdf = this.sanit.bypassSecurityTrustResourceUrl(doc.output('datauristring', { filename: 'immeuble.pdf' }));
              this.appercu.show();
            }
            else {
              this.tst.info(sit.libSite+' : Aucune valeur inactive ne répond aux critères spécifiés');
            }
          });
        }
      }
      else {
        this.sites.forEach(sit => {
          this.immeub = this.immeubles.filter(im => im.etatIm == false &&
            im.typeImmeuble.codeTypIm == this.typesVL[this.imLibGroup.value['typVlAl']].codeTypIm &&
            im.siteMarcher.codeSite == sit.codeSite);
          if (this.immeub.length > 0) {
            let list = [];
            this.immeub.forEach(elt => {
              let imm = [];
              imm.push(elt.codeIm);
              imm.push(elt.libIm);
              imm.push(elt.stuctResp);
              imm.push(elt.quartier.nomQuartier);
              imm.push(elt.superficie);
              if (this.prix.find(p => p.dateFinPrixIm == null && p.immeuble.codeIm == elt.codeIm) != null)
                imm.push(this.prix.find(p => p.dateFinPrixIm == null && p.immeuble.codeIm == elt.codeIm).prixIm);
              list.push(imm);
            });
            doc.addPage();
              //doc.addImage(this.outils.ente, 5, 5, 200, 20);
              doc.addImage(this.outils.ente,'jpeg',5,0,200,30);
              autotable(doc, {
                theme: 'plain',
                margin: { top: 35, left: 0, right: 0,},
                    body: [
                      ['' + this.arrondissements[this.imLibGroup.value['arondl']].nomArrondi + '\t\t\t' +
                      sit.libSite +
                        '\nListe des : ' + this.typesVL[this.imLibGroup.value['typVlAl']].libTypIm+'s libres']
                    ],
                  bodyStyles: {
                    fontSize: 14,
                    cellPadding: 1,
                    halign:'center'
                },
              });
            autotable(doc, {
              theme: 'grid',
              head: [['Code', 'Libellé', 'Structure responsable', 'Surface', 'Prix actuel']],
              headStyles: {
                fillColor: [41, 128, 185],
                textColor: 255,
                fontStyle: 'bold',
              },
              margin: { top: 50 },
              body: list,
            });
            this.vuePdf = this.sanit.bypassSecurityTrustResourceUrl(doc.output('datauristring', { filename: 'immeuble.pdf' }));
            this.appercu.show();
          }
          else {
            this.tst.info(sit.libSite+' : Aucune valeur inactive ne répond aux critères spécifiés');
          }
        });
      }
    }
    else {
      if (this.imLibGroup.value['arrondl'] == -1) {
        this.sites.forEach(sit => {
          this.typesVL.forEach(tvl => {
            this.immeub = this.immeubles.filter(im => im.etatIm == false &&
              im.siteMarcher.codeSite == sit.codeSite && im.typeImmeuble.codeTypIm == tvl.codeTypIm);
            if (this.immeub.length > 0) {
              let list = [];
              this.immeub.forEach(elt => {
                let imm = [];
                imm.push(elt.codeIm);
                imm.push(elt.libIm);
                imm.push(elt.stuctResp);
                imm.push(elt.superficie);
                if (elt.etatIm)
                  imm.push("En contrat");
                else
                  imm.push("Libre");
                imm.push(elt.valUnit);
                if (this.prix.find(p => p.dateFinPrixIm == null && p.immeuble.codeIm == elt.codeIm) != null)
                  imm.push(elt.codeIm);
                list.push(imm);
              });
              doc.addPage();
              //doc.addImage(this.outils.ente, 5, 5, 200, 20);
              doc.addImage(this.outils.ente,'jpeg',5,0,200,30);
              autotable(doc, {
                  theme: 'plain',
                  margin: { top: 35, left: 30, right: 25,},
                      body: [
                        ['' + this.arrondissements[this.imLibGroup.value['arondl']].nomArrondi + '\t\t\t' +
                        sit.libSite +
                          '\nListe des : ' + tvl.libTypIm+'s libres']
                      ],
                    bodyStyles: {
                      fontSize: 14,
                      cellPadding: 1,
                      halign:'center'
                  },
                });
              autotable(doc, {
                theme: 'grid',
                head: [['Code', 'Libellé', 'Structure responsable', 'Surface', 'Valeur U', 'Etat', 'Prix']],
                headStyles: {
                  fillColor: [41, 128, 185],
                  textColor: 255,
                  fontStyle: 'bold',
                },
                margin: { top: 60 },
                body: list,
              });
              this.vuePdf = this.sanit.bypassSecurityTrustResourceUrl(doc.output('datauristring', { filename: 'immeuble.pdf' }));
              this.appercu.show();
            }
          });
        });
      }
      else {
        this.aSites.forEach(sit => {
          this.typesVL.forEach(typ => {
            this.immeub = this.immeubles.filter(im =>
              im.siteMarcher.codeSite == sit.codeSite && im.typeImmeuble.codeTypIm == typ.codeTypIm);
            if (this.immeub.length > 0) {
              let list = [];
              this.immeub.forEach(elt => {
                let imm = [];
                imm.push(elt.codeIm);
                imm.push(elt.libIm);
                imm.push(elt.stuctResp);
                  imm.push(elt.superficie);
                  if (elt.etatIm)
                    imm.push("En contrat");
                  else
                    imm.push("Libre");
                  imm.push(elt.valUnit);
                  if (this.prix.find(p => p.dateFinPrixIm == null && p.immeuble.codeIm == elt.codeIm) != null)
                    imm.push(elt.codeIm);
                  list.push(imm);
                });
              doc.addPage();

              //doc.addImage(this.outils.ente, 5, 5, 200, 20);
              doc.addImage(this.outils.ente,'jpeg',5,0,200,30);
              autotable(doc, {
                  theme: 'plain',
                  margin: { top: 35, left: 0, right: 0,},
                      body: [
                        ['' + this.arrondissements[this.imLibGroup.value['arondl']].nomArrondi + '\t\t\t' +
                        sit.libSite +
                          '\nListe des : ' + this.typesVL[this.imLibGroup.value['typVlAl']].libTypIm+'s libres']
                      ],
                    bodyStyles: {
                      fontSize: 14,
                      cellPadding: 1,
                      halign:'center'
                  },
                });
                doc.text('' + doc.getNumberOfPages(), 8, 10);
                doc.text('' + sit.arrondissement.nomArrondi, 40, 20);
                doc.text('Site: ' + sit.libSite, 45, 30);
                doc.text('Liste des : ' + typ.libTypIm, 50, 40);
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
                this.vuePdf = this.sanit.bypassSecurityTrustResourceUrl(doc.output('datauristring', { filename: 'immeuble.pdf' }));
                this.appercu.show();
              }
          });
        });
      }
    }
  }

  vlOccupeesParSite() {
    const doc = new jsPDF();
    doc.text('' + doc.getNumberOfPages(), 55, 5)
    doc.setDrawColor(0);
    doc.setFillColor(255, 255, 255);
    doc.setFontSize(18);
    doc.deletePage(1);
    var val: Number;
    if (this.imOcGroup.value['typVlAo'] != -1) {        //////Type spécifié//////
      if (this.imOcGroup.value['arrondo'] != -1) {     //////Type et Arrondissement spécifiés//////
        if (this.imOcGroup.value['sito'] != -1) {     //////Type, Arrondissement et sit spécifiés//////
          this.immeub = this.immeubles.filter(im => im.etatIm == true &&
            im.typeImmeuble.codeTypIm === this.typesVL[this.imOcGroup.value['typVlAo']].codeTypIm &&
            im.siteMarcher.codeSite === this.aSites[this.imOcGroup.value['sito']].codeSite);
          if (this.immeub.length > 0) {
            let list = [];
            this.immeub.forEach(elt => {
              let imm = [];
              imm.push(elt.codeIm);
              imm.push(elt.libIm);
              imm.push(elt.stuctResp);
              imm.push(elt.superficie);
              if (this.prix.find(p => p.dateFinPrixIm == null && p.immeuble.codeIm == elt.codeIm) != null)
                imm.push(this.prix.find(p => p.dateFinPrixIm == null && p.immeuble.codeIm == elt.codeIm).prixIm);
              list.push(imm);
            });
            doc.addPage();
            doc.text('' + doc.getNumberOfPages(), 8, 10);
            doc.text('Arrondissement : ' + this.arrondissements[this.imOcGroup.value['arrondo']].nomArrondi, 40, 20);
            doc.text('Site : ' + this.sites[this.imOcGroup.value['sito']].libSite, 50, 30);
            doc.text('Liste des  : ' + this.typesVL[this.imOcGroup.value['typVlAo']].libTypIm + ' en contrat', 55, 40);
            autotable(doc, {
              theme: 'grid',
              head: [['Code', 'Libellé', 'Structure responsable', 'Surface', 'Prix actuelle ']],
              headStyles: {
                fillColor: [41, 128, 185],
                textColor: 255,
                fontStyle: 'bold',
              },
              margin: { top: 50 },
              body: list,
            });
            this.vuePdf = this.sanit.bypassSecurityTrustResourceUrl(doc.output('datauristring', { filename: 'immeuble.pdf' }));
            this.appercu.show();
          }
          else {
            alert('Aucune valeur inactive ne répond aux critères spécifiés');
          }
        }
        else {
          this.aSites.forEach(sit => {
            this.immeub = this.immeubles.filter(im => im.etatIm == true &&
              im.typeImmeuble.codeTypIm === this.typesVL[this.imOcGroup.value['typVlAo']].codeTypIm &&
              im.siteMarcher.codeSite === sit.codeSite);
            if (this.immeub.length > 0) {
              let list = [];
              this.immeub.forEach(elt => {
                let imm = [];
                imm.push(elt.codeIm);
                imm.push(elt.libIm);
                imm.push(elt.stuctResp);
                imm.push(elt.quartier.nomQuartier);
                imm.push(elt.superficie);
                if (this.prix.find(p => p.dateFinPrixIm == null && p.immeuble.codeIm == elt.codeIm) != null)
                  imm.push(this.prix.find(p => p.dateFinPrixIm == null && p.immeuble.codeIm == elt.codeIm).prixIm);
                list.push(imm);
              });
              doc.addPage();
              doc.text('' + doc.getNumberOfPages(), 8, 10);
              doc.text('Arrondissement : ' + this.arrondissements[this.imOcGroup.value['arrondo']].nomArrondi, 40, 20);
              doc.text('Site : ' + sit.libSite, 45, 3);
              doc.text('Liste des  : ' + this.typesVL[this.imOcGroup.value['typVlAo']].libTypIm + ' en contrat', 40, 40);
              autotable(doc, {
                theme: 'grid',
                head: [['Code', 'Libellé', 'Structure responsable', 'Surface', 'Prix actuel']],
                headStyles: {
                  fillColor: [41, 128, 185],
                  textColor: 255,
                  fontStyle: 'bold',
                },
                margin: { top: 50 },
                body: list,
              });
                this.vuePdf = this.sanit.bypassSecurityTrustResourceUrl(doc.output('datauristring', { filename: 'immeuble.pdf' }));
                this.appercu.show();
              }
            else {
              alert('Aucune valeur inactive ne répond aux critères spécifiés');
            }
          });
        }
      }
      else {
        this.arrondissements.forEach(ar => {
          this.aSites = this.sites.filter(s => s.arrondissement.codeArrondi == ar.codeArrondi);
          this.aSites.forEach(sit => {
            this.immeub = this.immeubles.filter(im => im.etatIm == true &&
              im.typeImmeuble.codeTypIm == this.typesVL[this.imOcGroup.value['typVlAo']].codeTypIm &&
              im.siteMarcher.codeSite == sit.codeSite);
            if (this.immeub.length > 0) {
              let list = [];
              this.immeub.forEach(elt => {
                let imm = [];
                imm.push(elt.codeIm);
                imm.push(elt.libIm);
                imm.push(elt.stuctResp);
                imm.push(elt.quartier.nomQuartier);
                imm.push(elt.superficie);
                if (elt.etatIm)
                  imm.push("En contrat");
                else
                  imm.push("Libre");
                if (this.prix.find(p => p.dateFinPrixIm == null && p.immeuble.codeIm == elt.codeIm) != null)
                  imm.push(this.prix.find(p => p.dateFinPrixIm == null && p.immeuble.codeIm == elt.codeIm).prixIm);
                list.push(imm);
              });
              doc.addPage();
              doc.text('' + doc.getNumberOfPages(), 8, 10);
              doc.text('Arrondissement : ' + sit.arrondissement.nomArrondi, 40, 20);
              doc.text('Site : ' + sit.libSite, 45, 30);
              doc.text('Liste des  : ' + this.typesVL[this.imOcGroup.value['typVlAo']].libTypIm, 50, 40);
              autotable(doc, {
                theme: 'grid',
                head: [['Code', 'Libellé', 'Structure responsable', 'Surface', 'Prix actuel']],
                headStyles: {
                  fillColor: [41, 128, 185],
                  textColor: 255,
                  fontStyle: 'bold',
                },
                margin: { top: 50 },
                body: list,
              });
              this.vuePdf = this.sanit.bypassSecurityTrustResourceUrl(doc.output('datauristring', { filename: 'immeuble.pdf' }));
              this.appercu.show();
            }
            else {
              alert('Aucune valeur inactive ne répond aux critères spécifiés');
            }
          });
        });
      }
    }
    else {
      if (this.imOcGroup.value['arrondo'] == -1) {
        this.arrondissements.forEach(ar => {
          this.aSites = this.sites.filter(s => s.arrondissement.codeArrondi == ar.codeArrondi);
          this.aSites.forEach(sit => {
            this.typesVL.forEach(tvl => {
              this.immeub = this.immeubles.filter(im => im.etatIm == true &&
                im.siteMarcher.codeSite == sit.codeSite && im.typeImmeuble.codeTypIm == tvl.codeTypIm);
              if (this.immeub.length > 0) {
                let list = [];
                this.immeub.forEach(elt => {
                  let imm = [];
                  imm.push(elt.codeIm);
                  imm.push(elt.libIm);
                  imm.push(elt.stuctResp);
                  imm.push(elt.superficie);
                  imm.push(elt.valUnit);
                  if (this.prix.find(p => p.dateFinPrixIm == null && p.immeuble.codeIm == elt.codeIm) != null)
                    imm.push(this.prix.find(p => p.dateFinPrixIm == null && p.immeuble.codeIm == elt.codeIm).prixIm);
                  list.push(imm);
                });
                doc.addPage();
                doc.text('' + sit.arrondissement.nomArrondi, 40, 20);
                doc.text('Site: ' + sit.libSite, 45, 30);
                doc.text('Liste des : ' + tvl.libTypIm + ' en contrat', 50, 40);
                autotable(doc, {
                  theme: 'grid',
                  head: [['Code', 'Libellé', 'Structure responsable', 'Surface', 'Valeur U', 'Prix actuel']],
                  headStyles: {
                    fillColor: [41, 128, 185],
                    textColor: 255,
                    fontStyle: 'bold',
                  },
                  margin: { top: 50 },
                  body: list,
                });
                this.vuePdf = this.sanit.bypassSecurityTrustResourceUrl(doc.output('datauristring', { filename: 'immeuble.pdf' }));
                this.appercu.show();
              }
            });
          });
        });
      }
      else {
        this.aSites.forEach(sit => {
          this.typesVL.forEach(typ => {
            this.immeub = this.immeubles.filter(im => im.etatIm == true &&
              im.siteMarcher.codeSite == sit.codeSite && im.typeImmeuble.codeTypIm == typ.codeTypIm);
            if (this.immeub.length > 0) {
              let list = [];
              this.immeub.forEach(elt => {
                let imm = [];
                imm.push(elt.codeIm);
                imm.push(elt.libIm);
                imm.push(elt.stuctResp);
                imm.push(elt.superficie);
                imm.push(elt.valUnit);
                if (this.prix.find(p => p.dateFinPrixIm == null && p.immeuble.codeIm == elt.codeIm) != null)
                  imm.push(this.prix.find(p => p.dateFinPrixIm == null && p.immeuble.codeIm == elt.codeIm).prixIm);
                list.push(imm);
              });
              doc.addPage();
              doc.text('' + doc.getNumberOfPages(), 8, 10);
              doc.text('' + sit.arrondissement.nomArrondi, 40, 20);
              doc.text('Site: ' + sit.libSite, 45, 30);
              doc.text('Liste des : ' + typ.libTypIm, 50, 40);
              autotable(doc, {
                theme: 'grid',
                head: [['Code', 'Libellé', 'Structure responsable', 'Surface', 'Valeur U', 'Prix actuel']],
                headStyles: {
                  fillColor: [41, 128, 185],
                  textColor: 255,
                  fontStyle: 'bold',
                },
                margin: { top: 50 },
                body: list,
              });
              this.vuePdf = this.sanit.bypassSecurityTrustResourceUrl(doc.output('datauristring', { filename: 'immeuble.pdf' }));
              this.appercu.show();
            }
          });
        });
      }
    }
  }
}
