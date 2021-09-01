import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as moment from 'moment';
import { AlertModule } from 'ngx-bootstrap/alert';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Arrondissement } from '../../../../models/arrondissement.model';
import { Article } from '../../../../models/article.model';
import { Correspondant } from '../../../../models/Correspondant.model';
import { LignePlacement } from '../../../../models/lignePlacement.model';
import { LignePointVente } from '../../../../models/lignePointVente.model';
import { Placement } from '../../../../models/placement.model';
import { PointVente } from '../../../../models/pointVente.model';
import { ArticleService } from '../../../../services/definition/article.service';
import { CommuneService } from '../../../../services/definition/commune.service';
import { CorrespondantService } from '../../../../services/definition/correspondant.service';
import { PlacementService } from '../../../../services/saisie/placement.service';
import { PointVenteService } from '../../../../services/saisie/point-vente.service';

@Component({
  selector: 'app-liste-imputation',
  templateUrl: './liste-imputation.component.html',
  styleUrls: ['./liste-imputation.component.css']
})
export class ListeImputationComponent implements OnInit {

  bilanGroup: FormGroup;
  journalGroup: FormGroup;
  // dispoGroup: FormGroup;
  // bilanGroup: FormGroup;
  // venteGroup: FormGroup;
  // operGroup: FormGroup;
  vuePdf = null;
  //  venteGroup: FormGroup;
  arrondissements: Arrondissement[];
  correspondants: Correspondant[];
  corresAct: Correspondant[];
  correspon: Correspondant[];
  articles: Article[];
  articleSt: Article[];

  lignePlacem: LignePlacement[];
  ligneVente: LignePointVente[];
  LigneImput: PointVente[];
  corresPV: PointVente[];
  corresPVImput: PointVente[];

  @ViewChild('appercu') public appercu: ModalDirective;

  opened: number = 0;
  clicked: number = 0;

  constructor(public pv: PointVenteService, public place: PlacementService, public cor: CorrespondantService,
    public sanit: DomSanitizer, public fbuilde: FormBuilder, public as: ArticleService,
    public tst: ToastrService) {
    this.getAllCorrespondants();
    this.getAllArticle();
    this.getAllLignesPlacement();
    this.getAllLignesPoint();
  }

  ngOnInit(): void {
    this.bilanGroup = this.fbuilde.group({
      corresp: [this.correspondants[0]],
      dateDeb: [moment(Date.now()) .format('YYYY-MM-DDTHH:mm')],
      dateFin: new FormControl(),
    });

    this.bilanGroup = this.fbuilde.group({
      cor: new FormControl(this.correspondants[0]),
      art: new FormControl(),
      dateDeb: new FormControl(),
      dateFin: new FormControl(),
    });

  }

  getAllCorrespondants() {
    this.tst.success('Chargement en cour');
    alert('On est là');
    this.cor.getAllCorres().subscribe(
      data => {
        this.correspondants = data;
      },
      erreura => {
        this.tst.info('Liste des arrondissements non chargée ');
        console.log(erreura);
      }
    );
  }

  getAllLignesPlacement() {
    // this.tst.success('Chargement en cour')
    this.place.getAllLignePlacement().subscribe(
      data => {
        this.lignePlacem = data;
      },
      erreura => {
        this.tst.info('Liste des arrondissements non chargée ');
        console.log(erreura);
      }
    );
  }

  getAllLignesPoint() {
    // this.tst.success('Chargement en cour')
    this.pv.getAllLignePointVente().subscribe(
      data => {
        this.ligneVente = data;
      },
      erreura => {
        this.tst.info('Liste des arrondissements non chargée ');
        console.log(erreura);
      }
    );
  }

  getAllArticle() {
    // this.tst.success('Chargement en cour')
    this.as.getAllArticle().subscribe(
      data => {
        this.articles = data.filter(a => a.stockerArticle === true);
      },
      erreura => {
        this.tst.info('Liste des arrondissements non chargée ');
        console.log(erreura);
      }
    );
  }

  /*getAllLignesPlacement() {
    // this.tst.success('Chargement en cour')
    this.place.getAllLignePlacement().subscribe(
      data => {
        this.lignePlacem = data;
      },
      erreura => {
        this.tst.info('Liste des arrondissements non chargée ');
        console.log(erreura);
      }
    );
  }*/

  imprimePlacement() {
    // if (this.bilanGroup.value['corresp'] != null) {

    if (this.bilanGroup.value['corresp'] === -1) {
      this.tst.success('Bilan de tous les correspondants');
    } else {
      alert('Bilan d\'un correspondant unique');
    }
    const lignePlaceCon = this.lignePlacem.filter(a =>
      a.placement.correspondant.idCorrespondant === this.bilanGroup.value['corresp'].idCorrespondant &&
      a.placement.datePlacement > this.bilanGroup.value['dateDeb'] && a.placement.datePlacement <= this.bilanGroup.value['dateFin']);
    if (lignePlaceCon.length > 0) {
      const line = [];
      let j: String = '';
      let totPlac = 0;
      let pla = 0;
      lignePlaceCon.forEach(elt => {
        // tslint:disable-next-line: triple-equals
        if (elt.placement.numPlacement != j) {
          // tslint:disable-next-line: triple-equals
          if (pla != 0) {
            const col = [];
            col.push('');
            col.push('Total placement :');
            col.push('');
            col.push(pla);
            col.push('');
            line.push(col);
            }
            totPlac += pla;
            j = elt.placement.numPlacement;
            line.push('Placement numéro ' + { j } + ' du ' + moment(new Date(elt.placement.datePlacement)).format('DD/MM/YYYY'));
            pla = 0;
          } else {
            const col = [];
            col.push(elt.article.codeArticle);
            col.push(elt.article.libArticle);
            col.push(elt.pulignePlacement);
            col.push(elt.quantiteLignePlacement);
            col.push((elt.pulignePlacement * elt.quantiteLignePlacement));
            line.push(col);
            pla += elt.pulignePlacement * elt.quantiteLignePlacement;
          }
        });
      const doc = new jsPDF();
      autoTable(doc, {
        theme: 'plain',
        margin: { top: 5, left: 35, right: 9, bottom: 100 },
        columnStyles: {
          0: { textColor: 'blue', fontStyle: 'bold', halign: 'left' },
          1: { textColor: 'blue', fontStyle: 'bold', halign: 'right' },
        },
        body: [
          ['REPUBLIQUE DU BENIN\nDEPARTEMENT DU LITTORAL\nMAIRIE DE COTONOU\n']
        ]
      });
      doc.setDrawColor(0);
      doc.setFillColor(233, 242, 248);
      doc.roundedRect(50, 35, 110, 10, 3, 3, 'FD');
      doc.setFontSize(20);

      autoTable(doc, {
        theme: 'grid',
        head: [['Article', 'Libellé article', 'Prix Unit.', 'Quantite', 'Montant']],
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: 255,
          fontStyle: 'bold',
        },
        margin: { top: 10 },
        body: [['Detail des placements de valeurs effectués auprès de ' +
          this.bilanGroup.value['corresp'].magasinier.nomMagasinier + ' ' + this.bilanGroup.value['corresp'].magasinier.prenomMagasinier +
          ' courant la période du ' + this.bilanGroup.value['dateDeb'] + ' au ' + this.bilanGroup.value['dateFin']]],
      });
      autoTable(doc, {
        theme: 'grid',
        head: [['Article', 'Libellé article', 'Prix Unit.', 'Quantite', 'Montant']],
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: 255,
          fontStyle: 'bold',
        },
        margin: { top: 70 },
        body: line,
      });
      this.vuePdf = this.sanit.bypassSecurityTrustResourceUrl(doc.output('datauristring', { filename: 'paiement.pdf' }));
      this.appercu.show();
    } else {
      alert('Ce correspondant n\'a reçu aucun placement de valeur');
    }
  }

  imprimeVente() { }

  imprimeImputAV() { }

  imprimeImput() { }

  manageCollapses(inde: number) {
    this.opened = inde;
    this.clicked = inde;
  }

  imprimeJournal() {
    const a = this.journalGroup.value['art'];
    const c = this.journalGroup.value['cor'];
    const d = this.journalGroup.value['dateDeb'];
    const f = this.journalGroup.value['datFin'];
    const line = [];
    const lPlace = this.lignePlacem.filter(lp =>
      lp.article.codeArticle === a.codeArticle &&
      lp.placement.correspondant.idCorrespondant === c.idCorrespondant &&
      lp.placement.datePlacement >= new Date(d) &&
      lp.placement.datePlacement <= new Date(f)
    );
    const lPoin = this.ligneVente.filter(lv =>
      lv.article.codeArticle === a.codeArticle &&
      lv.pointVente.opCaisse.dateOpCaisse >= new Date(d) &&
      lv.pointVente.opCaisse.dateOpCaisse <= new Date(f)
    );
    let i: number;
    let j = 0;
    for (i = 0; i < lPlace.length; i++) {
      if (new Date(lPlace[i].placement.datePlacement) <=
        new Date(lPoin[j].pointVente.opCaisse.dateOpCaisse) || j >= lPoin.length
          ) {
        const col = [];
        col.push(moment(lPlace[i].placement.datePlacement).format('DD/MM/YYYY HH:mm'));
        col.push('Placement');
        col.push(lPlace[i].quantiteLignePlacement);
        col.push(lPlace[i].pulignePlacement);
        col.push(lPlace[i].quantiteLignePlacement * lPlace[i].pulignePlacement);
        line.push(col);
      } else {
        do {
          const col = [];
          col.push(moment(lPoin[j].pointVente.datePointVente).format('DD/MM/YYYY HH:mm'));
          col.push('Placement');
          col.push(lPoin[j].quantiteLignePointVente);
          col.push(lPoin[j].pulignePointVente);
          col.push(lPoin[j].quantiteLignePointVente * lPoin[i].pulignePointVente);
          line.push(col);
          j++;
        } while (new Date(lPlace[i].placement.datePlacement) <=
          new Date(lPoin[j].pointVente.opCaisse.dateOpCaisse) && j < lPoin.length);
      }

      }

    }

  }


