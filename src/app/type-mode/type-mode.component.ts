import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { ModePaiement } from '../../models/mode.model';
import { TypCorres } from '../../models/typCorres.model';
import { CorrespondantService } from '../../services/definition/correspondant.service';
import { OperationCaisseService } from '../../services/saisie/operation-caisse.service';

@Component({
  selector: 'app-type-mode',
  templateUrl: './type-mode.component.html',
  styleUrls: ['./type-mode.component.css']
})
export class TypeModeComponent implements OnInit {


  ////////////////////// institution
  // tslint:disable-next-line: typedef-whitespace
  typeCorres : TypCorres[];
  tcor = new TypCorres('', '');
  addTypGrou: FormGroup;
  modTypGrou: FormGroup;
  tabTyp: DataTables.Settings = {};
  dtrigTyp: Subject<TypCorres> = new Subject<TypCorres>();

  @ViewChild('addTyp') public addTyp: ModalDirective;
  @ViewChild('modTyp') public modTyp: ModalDirective;
  @ViewChild('delTyp') public delTyp: ModalDirective;

  ////////////////////// Mode de paiement
  mod = new ModePaiement('', '');
  modes: ModePaiement[];
  addModGrou: FormGroup;
  modModGrou: FormGroup;
  tabMod: DataTables.Settings = {};
  dtrigMod: Subject<ModePaiement> = new Subject<ModePaiement>();

  @ViewChild('addMod') public addMod: ModalDirective;
  @ViewChild('modMod') public modMod: ModalDirective;
  @ViewChild('delmod') public delMod: ModalDirective;

  constructor(private os: OperationCaisseService, private fbuilder: FormBuilder, private router: Router,
    private cs: CorrespondantService, public tst: ToastrService) {
    this.initialiseTableau();
  }

  ngOnInit(): void {
    this.os.getAllModes().subscribe(
      data => {
        this.modes = data;
        this.dtrigMod.next();
      }
    );
    this.cs.getAllTypCorres()
    .subscribe(
      (data) => {
        this.typeCorres = data;
        this.dtrigTyp.next();
      },
      (erreur) => {
        console.log('erreur chargement institution : ' + erreur);
      }
    );

    this.addModGrou = this.fbuilder.group({
      cod: ['', Validators.requiredTrue],
      alib: ['', Validators.requiredTrue]
    });

    this.modModGrou = this.fbuilder.group({
      cod: [this.mod.codeModPay, Validators.requiredTrue],
      lib: [this.mod.libeModPay, Validators.requiredTrue],
    });

    this.addTypGrou = this.fbuilder.group({
      Cod: ['', Validators.requiredTrue],
      lib: ['', Validators.requiredTrue]
    });

    this.modTypGrou = this.fbuilder.group({
      cod: [this.tcor.codeTypCorres, Validators.requiredTrue],
      lib: [this.tcor.libTypeCorres, Validators.requiredTrue]
    });

  }

  initialiseTableau() {
    this.tabMod = {
      pagingType: 'full_numbers',
      pageLength: 5,
      lengthMenu: [5, 10, 25, 50, 100],
      language: {
        lengthMenu: 'Affichage de _MENU_ lignes par page',
        zeroRecords: 'Aucune ligne trouvée - Desolé',
        info: 'Affichage de la page _PAGE_ sur _PAGES_',
        infoEmpty: 'Pas de ligne trouvée',
        infoFiltered: '(Filtré à partie de _MAX_ lignes)',
        search: 'Rechercher',
        loadingRecords: 'Chargement en cours...',
        paginate: {
          first: 'Début',
          last: 'Fin',
          next: 'Suivant',
          previous: 'Précédent'
        }
      }
    };

    this.tabTyp = {

      responsive: true,
      pagingType: 'full_numbers',
      pageLength: 5,
      lengthMenu: [5, 10, 25, 50, 100],
      language: {
        lengthMenu: 'Affichage de _MENU_ lignes par page',
        zeroRecords: 'Aucune ligne trouvée - Desolé',
        info: 'Affichage de la page _PAGE_ sur _PAGES_',
        infoEmpty: 'Pas de ligne trouvée',
        infoFiltered: '(Filtré à partie de _MAX_ lignes)',
        search: 'Rechercher',
        loadingRecords: 'Chargement en cours...',
        paginate: {
          first: 'Début',
          last: 'Fin',
          next: 'Suivant',
          previous: 'Précédent'
        }
      }
    };

  }

  //////////////////////// Mode de paiement

  ChargerModes() {
    this.os.getAllModes().subscribe(
      data => {
        this.modes = data;
        $('#dtMod').dataTable().api().destroy();
        this.dtrigMod.next();
      },
      err => {
        console.log('Chargement echouée', err);
      }
    );
  }

  initAddMod() {
    this.addModGrou.reset();
    this.addMod.show();
  }

  ajouteMod() {
    this.os.addAMode(new ModePaiement(this.addModGrou.value['code'], this.addModGrou.value['lib'])).subscribe(
      data => {
        console.log('ajout avec succès');
        this.ChargerModes();
      },
      err => {
        console.log('Nouvelle institution échouée ', err);
      }
    );
    this.addModGrou.reset();
    this.addMod.hide();
  }

  initDelMod(i: number) {
    this.mod = this.modes[i];
    this.delMod.show();
  }

  modifieMod() {
    this.os.editAMode(this.mod.codeModPay, new ModePaiement(this.modModGrou.value['code'], this.modModGrou.value['lib'])).subscribe(
      data => {
        console.log('ajout avec succès');
        this.ChargerModes();
      },
      err => {
        console.log('Nouvelle institution échouée ', err);
      }
    );
    this.modMod.hide();
  }

  initModMod(i: number) {
    this.mod = this.modes[i];
    this.modMod.show();
}

  deleteMod() {
    this.os.deleteAMode(this.mod.codeModPay).subscribe(
      data => {
        this.ChargerModes();
      },
      err => {
        console.log('Suppression échouée ', err);
      }
    );
    this.delMod.hide();
  }

///////// Type de correspondant

  initAddTyp() {
    this.addTypGrou.reset();
    this.addTyp.show();
  }

  ajouteType() {
      this. tcor = new TypCorres(this.addTypGrou.value['code'], this.addTypGrou.value['lib']);
      this.cs.addATypCorres (this.tcor).subscribe(
        data => {
          console.log('Ajout réussi');
          this.chargerTypes();
          this.addTyp.hide();
        },
        err => {
          console.log('Ajout échoué: ', err);

        }
      );
    }

  chargerTypes() {
    this.cs.getAllTypCorres().subscribe(
      data => {
        this.typeCorres = data;
        $('#dtTyp').dataTable().api().destroy();
        this.dtrigTyp.next();
      }
    );
  }

  initModTyp(typ: TypCorres) {
    this.tcor = typ;
    this.modTyp.show();
  }

  modifieType() {
    const np = new TypCorres(this.modTypGrou.value['cod'], this.modTypGrou.value['lib']);
    this.cs.editATypCorres(this.tcor.codeTypCorres, np).subscribe(
      data => {
        console.log('Modification effectuée avec succès');
        this.chargerTypes();
        this.modTyp.hide();
      },
      err => {
        console.log('La modification a échoué. ', err);
      }
    );
  }

  initDelTyp(i: number) {
    this.tcor = this.typeCorres[i];
    this.delTyp.show();
  }

  deleteType() {
    this.cs.deleteATypCorres(this.tcor.codeTypCorres).subscribe(
      data => {
        console.log('Suppresion réussie');
        this.chargerTypes();
        this.delTyp.hide();
      },
      err => {
        this.tst.warning('Suppression échouée ', err);

      }
    );
  }


}
