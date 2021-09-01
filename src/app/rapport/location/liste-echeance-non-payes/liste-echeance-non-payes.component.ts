import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { AppBreadcrumbComponent } from '@coreui/angular';
import { jsPDF } from 'jspdf';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Contrat } from '../../../../models/contrat.model';
import { Echeance } from '../../../../models/echeance.model';
import { Locataire } from '../../../../models/locataire.model';
import { LocataireService } from '../../../../services/definition/locataire.service';
import { ValeurLocativeService } from '../../../../services/definition/valeur-locative.service';
import { ContratLocationService } from '../../../../services/saisie/contrat-location.service';
import { OperationCaisseService } from '../../../../services/saisie/operation-caisse.service';
import autotable from 'jspdf-autotable';
import * as moment from 'moment';
import { PrixImmeuble } from '../../../../models/prixImmeuble.model';
import { Arrondissement } from '../../../../models/arrondissement.model';
import { SiteMarcher } from '../../../../models/siteMarcher.model';
import { CommuneService } from '../../../../services/definition/commune.service';
import { PagerComponent, PaginationConfig } from 'ngx-bootstrap/pagination';
@Component({
  selector: 'app-liste-echeance-non-payes',
  templateUrl: './liste-echeance-non-payes.component.html',
  styleUrls: ['./liste-echeance-non-payes.component.css']
})
export class ListeEcheanceNonPayesComponent implements OnInit {


  locataires: Locataire[];
  contrats: Contrat[];
  contLoc: Contrat[];
  echeances: Echeance[];
  echeanceAPayer: Echeance[];
  echeCont: Echeance[];
  prix: PrixImmeuble[];
  prixBout: PrixImmeuble[];
  arrondissements: Arrondissement[];
  sites: SiteMarcher[];

  opened:number = 0;
  clicked:number = 0;

  locaGroup: FormGroup;
  imGroup: FormGroup;
  @ViewChild('appercu') public appercu: ModalDirective;
  vuePdf = null;
  totArr: number;
  totBout: number;
  totGen: number

  constructor(public locaSer: LocataireService, public conSer: ContratLocationService,
    public opserv: OperationCaisseService, public vls: ValeurLocativeService, public comSer: CommuneService,
    public fbuilder: FormBuilder, public sanit: DomSanitizer) {

    this.locaGroup = fbuilder.group({
      loca: new FormControl(-1),
      cont: new FormControl(-1)
    });

    this.imGroup = fbuilder.group({
      arrond: new FormControl(-1)
    });

    this.locaSer.getAllLocataire().subscribe(
      data => {
        this.locataires = data;
      },
      err => {
        console.log('chargement échoué: ', err);
      }
    );

    this.comSer.getAllArrondissement().subscribe(
      data => {
        this.arrondissements = data;
      },
      err => {
        console.log('chargement échoué: ', err);
      }
    );

    this.comSer.getAllSiteMarcher().subscribe(
      data => {
        this.sites = data;
      },
      err => {
        console.log('chargement échoué: ', err);
      }
    );

    this.conSer.getAllContrat().subscribe(
      data => {
        this.contrats = data;
      },
      err => {
        console.log('chargement échoué: ', err);
      }
    );

    this.opserv.getAllEcheances().subscribe(
      data => {
        this.echeances = data;
      },
      err => {
        console.log('chargement échoué: ', err);
      }
    );

    this.vls.getAllPrixImmeuble().subscribe(
      data => {
        this.prix = data;
      },
      err => {
        console.log('chargement échoué: ', err);
      }
    );

  }

  ngOnInit(): void {
  }

  filtreContrat() {
    if (this.locaGroup.value['loca'] != -1) {
      this.contLoc = this.contrats.filter(c => c.locataire.idLocataire == this.locataires[this.locaGroup.value['loca']].idLocataire);
      this.locaGroup.patchValue({ cont: -1 });
    }
  }

  affichePaiement() {
    if (this.contLoc.length > 0) {
      const doc = new jsPDF();
      doc.setDrawColor(0);
      doc.setFillColor(255, 255, 255);
      doc.setFontSize(18);
      doc.deletePage(1);
      if (this.locaGroup.value['cont'] == -1) {
        //console.log(this.echeCont[]);
        let total = 0;
        this.contLoc.forEach(element => {
          this.echeCont = this.echeances.filter(
            ec => ec.contrat.numContrat == element.numContrat);
          if (this.echeCont.length > 0) {
            let tCont = 0;
            this.echeCont.sort((a, b) => <any>new Date(a.dateEcheance) - <any>new Date(b.dateEcheance));
            let list = [];
            this.echeCont.forEach(e => {
              let eche = [];
              eche.push(e.annee);
              eche.push(e.moisEcheance);
              eche.push(e.dateEcheance);
              eche.push(e.prix);
              eche.push(e.opCaisse.numOpCaisse);
              eche.push(moment(new Date(e.opCaisse.dateOpCaisse)).format('DD/MM/yyyy hh:mm'));
              eche.push(e.opCaisse.contribuable);
              tCont += e.prix.valueOf();
              list.push(eche);
            });
            if (tCont > 0) {
              total += tCont;
              doc.addPage();
              doc.text('' + doc.getNumberOfPages(), 8, 10);
              var df = "";
              if (element.dateFinContrat != null) {
                df = ' Au : ' + new Date(element.dateFinContrat).toLocaleDateString()
              }
              doc.text('Locataire : ' + this.locataires[this.locaGroup.value['loca']].identiteLocataire, 40, 20);
              doc.text('Contrat : ' + element.numContrat + ' Du ' +
                element.dateEffetContrat + df, 45, 30);
              doc.text('Valeur locative : ' + element.immeuble.libIm, 50, 40);
              doc.text('Site : ' + element.immeuble.siteMarcher.libSite, 50, 50);
              autotable(doc, {
                theme: 'grid',
                head: [['Année', 'Mois', 'Echéance', 'Prix', 'Reçu N°', 'Date Paiement', 'Déposant']],
                headStyles: {
                  fillColor: [41, 128, 185],
                  textColor: 255,
                  fontStyle: 'bold',
                },
                margin: { top: 60 },
                body: list,
              });
              autotable(doc, {
                theme: 'grid',
                margin: { top: 0, left: 30, right: 5 },
                columnStyles: {
                  0: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold', fontSize: 8 },
                },
                body: [
                  ['Total contrat', tCont]
                ],
                bodyStyles: {
                  fontSize: 8,
                  cellPadding: 1,
                },
              });
            }
          }
          else {
            alert('Le locataire ' + this.locataires[this.locaGroup.value['loca']].identiteLocataire +
              ' n\'a payé aucune échéance sur le contrat de location N°: ' + this.contLoc[this.locaGroup.value['cont']].numContrat);
          }
        });
        if (total > 0) {
          autotable(doc, {
            theme: 'grid',
            margin: { top: 0, left: 30, right: 5 },
            columnStyles: {
              0: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold', fontSize: 8 },
            },
            body: [
              ['Total de tous les contrats', total]
            ],
            bodyStyles: {
              fontSize: 8,
              cellPadding: 1,
            },
          });
          this.vuePdf = this.sanit.bypassSecurityTrustResourceUrl(doc.output('datauristring', { filename: 'paiement.pdf' }));
          this.appercu.show();
        }

      }
      else {
        let tcont = 0;
        this.echeCont = this.echeances.filter(
          ec => ec.contrat.numContrat == this.contLoc[this.locaGroup.value['cont']].numContrat);
        if (this.echeCont.length > 0) {
          this.echeCont.sort((a, b) => <any>new Date(a.dateEcheance) - <any>new Date(b.dateEcheance));
          let list = [];
          this.echeCont.forEach(e => {
            let eche = [];
            eche.push(e.annee);
            eche.push(e.moisEcheance);
            eche.push(e.dateEcheance);
            eche.push(e.prix);
            eche.push(e.opCaisse.numOpCaisse);
            eche.push(moment(new Date(e.opCaisse.dateOpCaisse)).format('DD/MM/yyyy hh:mm'));
            eche.push(e.opCaisse.contribuable);
            tcont += e.prix.valueOf();
            list.push(eche);
          });
          doc.addPage();
          doc.text('' + doc.getNumberOfPages(), 8, 10);
          doc.text('Locataire : ' + this.locataires[this.locaGroup.value['loca']].identiteLocataire, 40, 20);

          var df = "";
          if (this.contLoc[this.locaGroup.value['cont']].dateFinContrat != null) {
            df = ' Au : ' + new Date(this.contLoc[this.locaGroup.value['cont']].dateFinContrat).toLocaleDateString()
          }
          doc.text('Contrat : ' + this.contLoc[this.locaGroup.value['cont']].numContrat + ' Du ' +
            this.contrats[this.locaGroup.value['cont']].dateEffetContrat + df, 45, 30);
          doc.text('Valeur locative : ' + this.contrats[this.locaGroup.value['cont']].immeuble.libIm, 50, 40);
          doc.text('Site : ' + this.contrats[this.locaGroup.value['cont']].immeuble.siteMarcher.libSite, 50, 50);
          autotable(doc, {
            theme: 'grid',
            head: [['Année', 'Mois', 'Echéance', 'Prix', 'Reçu N°', 'Date Paiement', 'Déposant']],
            headStyles: {
              fillColor: [41, 128, 185],
              textColor: 255,
              fontStyle: 'bold',
            },
            margin: { top: 60 },
            body: list,
          });
          autotable(doc, {
            theme: 'grid',
            margin: { top: 0, left: 30, right: 5 },
            columnStyles: {
              0: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold', fontSize: 8 },
            },
            body: [
              ['Total contrat', tcont]
            ],
            bodyStyles: {
              fontSize: 8,
              cellPadding: 1,
            },
          });
        }
        else {
          doc.text('Le locataire ' + this.locataires[this.locaGroup.value['loca']].identiteLocataire +
            ' est à jour sur le contrat de location N°: ' + this.contLoc[this.locaGroup.value['cont']].numContrat,
            40, 20);
        }
        this.vuePdf = this.sanit.bypassSecurityTrustResourceUrl(doc.output('datauristring', { filename: 'paiement.pdf' }));
        this.appercu.show();
      }
    }
  }

  genererEcheancier(con: Contrat) {
    this.totBout = 0;
    if (con == null) {
      this.echeanceAPayer = []
    }
    else {
      var fa: Date;
      if (con.dateFinContrat == null) {
        fa = new Date(new Date());
      }
      else {
        fa = new Date(con.dateFinContrat);
      }

      this.echeanceAPayer = [];
      this.totBout = 0;
      var dde: Date = new Date(con.dateEffetContrat);
      var mois = new Array("Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet",
        "Août", "Septembre", "Octobre", "Novembre", "Décembre");
      var i = 0, n = 0;
      //var fa = new Date();
      var des = new Date(dde.getFullYear(), dde.getMonth() + 1, dde.getDate());
      var n = 0;
      var echeanceContrat = this.echeances.filter(eche => eche.contrat.numContrat == con.numContrat);

      while (des <= fa) {
        var exist = echeanceContrat.filter(function (eche) {
          return eche.contrat.numContrat == con.numContrat && eche.moisEcheance == mois[dde.getMonth()]
            && eche.annee == dde.getFullYear();
        });
        if (exist.length == 0) {
          var prix = this.prix.find(pri => pri.immeuble.codeIm == con.immeuble.codeIm &&
            ((new Date(dde) >= new Date(pri.dateDebPrixIm) && new Date(dde) < new Date(pri.dateFinPrixIm)) ||
              (new Date(dde) >= new Date(pri.dateDebPrixIm) && pri.dateFinPrixIm == null))
          );

          if (prix != null) {
            const eche = new Echeance(mois[dde.getMonth()], dde.getFullYear(), new Date(des), false,
              prix.prixIm, con, null);
            this.totBout += eche.prix.valueOf();
            this.echeanceAPayer.push(eche);
            n++;
          }
        }
        dde = des;
        des.setMonth(des.getMonth() + 1);
      }
    }
  }

  afficheImpayes() {
    var totCont = 0;
    var total = 0;
    const doc = new jsPDF();
    doc.setDrawColor(0);
    doc.setFillColor(255, 255, 255);
    doc.setFontSize(18);
    doc.deletePage(1);
    if (this.locaGroup.value['cont'] != -1) {
      this.genererEcheancier(this.contLoc[this.locaGroup.value['cont']]);
      if (this.echeanceAPayer.length > 0) {
        let list = [];
        this.echeanceAPayer.forEach(element => {
          let col = [];
          col.push(element.annee);
          col.push(element.moisEcheance);
          col.push(moment(new Date(element.dateEcheance)).format("DD/MM/YYYY"));
          col.push(element.prix);
          list.push(col);
          totCont += element.prix.valueOf();
        });
        doc.addPage();
        doc.text('' + doc.getNumberOfPages(), 8, 10);

        var df = '';
        if (this.contLoc[this.locaGroup.value['cont']].dateFinContrat != null) {
          df = ' Au ' + this.contLoc[this.locaGroup.value['cont']].dateFinContrat;
        }
        doc.text('Locataire : ' + this.locataires[this.locaGroup.value['loca']].identiteLocataire, 40, 20);
        doc.text('Contrat : ' + this.contLoc[this.locaGroup.value['cont']].numContrat + ' Du ' +
          this.contLoc[this.locaGroup.value['cont']].dateEffetContrat + df, 45, 30);
        doc.text('Valeur locative : ' + this.contrats[this.locaGroup.value['cont']].immeuble.libIm, 50, 40);
        doc.text('Site : ' + this.contrats[this.locaGroup.value['cont']].immeuble.siteMarcher.libSite, 50, 50);
        doc.text('Point des impayés', 60, 60);
        autotable(doc, {
          theme: 'grid',
          head: [['Année', 'Mois', 'Echéance', 'Prix']],
          headStyles: {
            fillColor: [41, 128, 185],
            textColor: 255,
            fontStyle: 'bold',
          },
          margin: { top: 70 },
          body: list,
        });
        autotable(doc, {
          theme: 'grid',
          margin: { top: 0, left: 30, right: 5 },
          columnStyles: {
            0: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold', fontSize: 8 },
          },
          body: [
            ['Total', totCont]
          ],
          bodyStyles: {
            fontSize: 8,
            cellPadding: 1,
          },
        });
        this.vuePdf = this.sanit.bypassSecurityTrustResourceUrl(doc.output('datauristring', { filename: 'paiement.pdf' }));
        this.appercu.show();
      }
      else {
        alert('Le locataire est à jour sur le contrat');
      }
    }
    else {
      this.contLoc.forEach(elt => {
        totCont = 0;
        this.genererEcheancier(elt);
        if (this.echeanceAPayer.length > 0) {
          let list = [];
          this.echeanceAPayer.forEach(element => {
            let col = [];
            col.push(element.annee);
            col.push(element.moisEcheance);
            col.push(moment(new Date(element.dateEcheance)).format("DD/MM/YYYY"));
            col.push(element.prix);
            list.push(col);
            totCont += element.prix.valueOf();
          });
          total += totCont;
          doc.addPage();
          doc.text('' + doc.getNumberOfPages(), 8, 10);
          var df = '';
          if (elt.dateFinContrat != null) {
            df = ' Au ' + elt.dateFinContrat;
          }
          doc.text('Locataire : ' + this.locataires[this.locaGroup.value['loca']].identiteLocataire, 40, 20);
          doc.text('Contrat : ' + elt.numContrat + ' Du ' + elt.dateEffetContrat + df, 45, 30);
          doc.text('Valeur locative : ' + elt.immeuble.libIm, 50, 40);
          doc.text('Site : ' + elt.immeuble.siteMarcher.libSite, 50, 50);
          doc.text('Point des impayés', 60, 60);
          autotable(doc, {
            theme: 'grid',
            head: [['Année', 'Mois', 'Echéance', 'Prix']],
            headStyles: {
              fillColor: [41, 128, 185],
              textColor: 255,
              fontStyle: 'bold',
            },
            margin: { top: 70 },
            body: list,
          });
          autotable(doc, {
            theme: 'grid',
            margin: { top: 0, left: 30, right: 5 },
            columnStyles: {
              0: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold', fontSize: 8 },
            },
            body: [
              ['Impayé', totCont]
            ],
            bodyStyles: {
              fontSize: 8,
              cellPadding: 1,
            },
          });
          if (this.contLoc[this.contLoc.length - 1].numContrat == elt.numContrat) {
            autotable(doc, {
              theme: 'grid',
              margin: { top: 0, left: 30, right: 5 },
              columnStyles: {
                0: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold', fontSize: 8 },
              },
              body: [
                ['Total', total]
              ],
              bodyStyles: {
                fontSize: 8,
                cellPadding: 1,
              },
            });
          }
          this.vuePdf = this.sanit.bypassSecurityTrustResourceUrl(doc.output('datauristring', { filename: 'paiement.pdf' }));
          this.appercu.show();
        }
        else {
          alert('Le locataire est à jour sur le contrat');
        }
      });
    }

  }

  Statut() {
    let lig = [];

    const doc = new jsPDF();
    doc.setDrawColor(0);
    doc.setFillColor(255, 255, 255);
    doc.setFontSize(18);
    doc.deletePage(1);
    let tot = 0;

    if (this.imGroup.value['arrond'] != -1) {
      this.contLoc = this.contrats.filter(c => c.immeuble.arrondissement.codeArrondi ==
        this.arrondissements[this.imGroup.value['arrond']].codeArrondi);
      if (this.contLoc.length > 0) {
        let totarr = 0;
        this.contLoc.forEach(element => {
          let col = [];
          this.genererEcheancier(element);
          if (this.echeanceAPayer.length > 0) {
            col.push(element.numContrat);
            col.push(element.immeuble.codeIm);
            col.push(element.locataire.identiteLocataire);
            col.push(this.echeanceAPayer.length);
            col.push(this.totBout);
            totarr += this.totBout;
            lig.push(col);
          }
        });
        if (totarr > 0) {
          //tot+=totarr;
          doc.addPage();
          doc.text('' + doc.getNumberOfPages(), 8, 10);
          doc.text('Arrondissement : ' + this.arrondissements[this.imGroup.value['arrond']].nomArrondi, 40, 20);
          doc.text('Point des impayés', 60, 30);
          autotable(doc, {
            theme: 'grid',
            head: [['Contrat N°', 'Boutique', 'Locataire', 'Nb. échéances', 'Montant']],
            headStyles: {
              fillColor: [41, 128, 185],
              textColor: 255,
              fontStyle: 'bold',
            },
            margin: { top: 40 },
            body: lig,
          });
          autotable(doc, {
            theme: 'grid',
            margin: { top: 0, left: 30, right: 5 },
            columnStyles: {
              0: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold', fontSize: 8 },
            },
            body: [
              ['Impayé de l\'arrondissement', this.totArr]
            ],
            bodyStyles: {
              fontSize: 8,
              cellPadding: 1,
            },
          });
          this.vuePdf = this.sanit.bypassSecurityTrustResourceUrl(doc.output('datauristring', { filename: 'paiement.pdf' }));
          this.appercu.show();
        }
      }
    }
    else {
      this.totGen = 0
      this.arrondissements.forEach(arr => {
        this.contLoc = this.contrats.filter(c => c.immeuble.arrondissement.codeArrondi ==
          arr.codeArrondi);
        if (this.contLoc.length > 0) {
          this.totArr = 0;
          this.contLoc.forEach(element => {
            let col = [];
            this.genererEcheancier(element);
            if (this.echeanceAPayer.length > 0) {
              col.push(element.numContrat);
              col.push(element.immeuble.codeIm);
              col.push(element.locataire.identiteLocataire);
              col.push(this.echeanceAPayer.length);
              col.push(this.totBout);
              this.totArr += this.totBout;
              lig.push(col);
            }
          });
          if (this.totArr > 0) {
            doc.addPage();
            doc.text('' + doc.getNumberOfPages(), 8, 10);
            doc.text('Arrondissement : ' + arr.nomArrondi, 40, 20);
            doc.text('Point des impayés', 60, 30);
            autotable(doc, {
              theme: 'grid',
              head: [['Contrat N°', 'Boutique', 'Locataire', 'Nb. échéances', 'Montant']],
              headStyles: {
                fillColor: [41, 128, 185],
                textColor: 255,
                fontStyle: 'bold',
              },
              margin: { top: 40 },
              body: lig,
            });
            autotable(doc, {
              theme: 'grid',
              margin: { top: 0, left: 30, right: 25 },
              columnStyles: {
                0: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold', fontSize: 8 },
              },
              body: [
                ['Impayés de l\'arrondissement:  ', this.totArr]
              ],
              bodyStyles: {
                fontSize: 8,
                cellPadding: 1,
              },
            });
            this.totGen += this.totArr;
          }
        }
      });

      if (this.totGen > 0) {
        autotable(doc, {
          theme: 'grid',
          margin: { top: 0, left: 30, right: 25 },
          columnStyles: {
            0: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold', fontSize: 8 },
          },
          body: [
            ['Total général des impayés: ', this.totGen]
          ],
          bodyStyles: {
            fontSize: 8,
            cellPadding: 1,
          },
        });
        this.vuePdf = this.sanit.bypassSecurityTrustResourceUrl(doc.output('datauristring', { filename: 'paiement.pdf' }));
        this.appercu.show();
      }
    }
    console.log(lig[0]);

  }

  manageCollapses(inde:number){
    this.opened = inde;
    this.clicked = inde;
  }

}
