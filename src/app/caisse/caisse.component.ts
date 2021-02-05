import {Component, ViewChild, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import {ModalDirective} from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { Arrondissement } from '../../models/arrondissement.model';
import { Caisse } from '../../models/caisse.model';
import { Commune } from '../../models/commune.model';
import { Departement } from '../../models/departement.model';
import { Pays } from '../../models/pays.model';
import { CaisseService } from '../../services/administration/caisse.service';
import { CommuneService } from '../../services/definition/commune.service';

@Component({
  selector: 'app-caisse',
  templateUrl: './caisse.component.html',
  styleUrls: ['./caisse.component.css']
})
export class CaisseComponent implements OnInit {

  @ViewChild('primaryModal') public primaryModal: ModalDirective;
  @ViewChild('successModal') public successModal: ModalDirective;
  @ViewChild('warningModal') public warningModal: ModalDirective;
  @ViewChild('dangerModal') public dangerModal: ModalDirective;
  @ViewChild('infoModal') public infoModal: ModalDirective;

  dtOptions1: DataTables.Settings = {};
  dtTrigger1: Subject<any> = new Subject<any>();
  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;
  addCaissFormsGroup: FormGroup;
  editCaissFormsGroup: FormGroup;
  caisses:Caisse[];
  editCaiss:Caisse = new Caisse('', '', new Arrondissement('','','','',new Commune('','','','',new Departement('','',new Pays('','','')))));
  suprCaiss:Caisse = new Caisse('', '', new Arrondissement('','','','',new Commune('','','','',new Departement('','',new Pays('','','')))));
  infoCaiss:Caisse = new Caisse('', '', new Arrondissement('','','','',new Commune('','','','',new Departement('','',new Pays('','','')))));

  //Liste de tous les arrondissements
  arrondissements:Arrondissement[];

  constructor(private serviceCaisse : CaisseService, private formBulder:FormBuilder, private serviceCommu:CommuneService) {
    this.dtOptions1 = {
      pagingType: 'full_numbers',
      pageLength: 5,
      lengthMenu: [5, 10, 25, 50, 100],
      language: {
        lengthMenu: "Affichage de _MENU_ lignes par page",
        zeroRecords: "Aucune ligne trouvée - Desolé",
        info: "Affichage de la page _PAGE_ sur _PAGES_",
        infoEmpty: "Pas de ligne trouvée",
        infoFiltered: "(Filtré à partie de _MAX_ lignes)",
        search: "Rechercher",
        loadingRecords: "Chargement en cours...",
        paginate:{
          first:"Début",
          last: "Fin",
          next: "Suivant",
          previous: "Précédent"
        }
      }
    };

    this.addCaissFormsGroup = this.formBulder.group({
      addCodeCaisse:['', Validators.required],
      addLibeCaisse:['', Validators.required],
      addArrondissement:0
    });

    this.editCaissFormsGroup = this.formBulder.group({
      editCodeCaisse:['', Validators.required],
      editLibeCaisse:['', Validators.required],
      editArrondissement:0
    });

  }

  ngOnInit(): void {

    this.getAllArrondissement();

    this.serviceCaisse.getAllCaisse().subscribe(
      (data) => {
        this.caisses = data;
        this.dtTrigger1.next();
      },
      (erreur) => {
        console.log('Erreur lors de la récupération de la liste de caisse', erreur);
      }
    );

  }

  getAllArrondissement(){
    this.serviceCommu.getAllArrondissement().subscribe(
      (data) => {
        this.arrondissements = data;
      },
      (erreur) => {
        console.log('Erreur lors de la récupération de la liste des arrondissements', erreur);
      }
    );
  }

  getAllCaisse(){
    this.serviceCaisse.getAllCaisse().subscribe(
      (data) => {
        this.caisses = data;
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
          this.dtTrigger1.next();
        });
      },
      (erreur) => {
        console.log('Erreur lors de la récupération de la liste de caisse', erreur);
      }
    );
  }

  initEditCaisse(inde:number){
    this.editCaiss = this.caisses[inde];
    this.warningModal.show();
  }

  initDeleteCaisse(inde:number){
    this.suprCaiss = this.caisses[inde];
    this.dangerModal.show();
  }

  initInfosCaisse(inde:number){
    this.infoCaiss = this.caisses[inde];
    this.infoModal.show();
  }

  onSubmitAddCaisseFormsGroup(){
    const newCaiss = new Caisse(this.addCaissFormsGroup.value['addCodeCaisse'], this.addCaissFormsGroup.value['addLibeCaisse'],
    this.arrondissements[this.addCaissFormsGroup.value['addArrondissement']]);
    this.serviceCaisse.addACaisse(newCaiss).subscribe(
      (data) => {
        this.primaryModal.hide();
        this.getAllCaisse();
      },
      (erreur) => {
        console.log('Erreur lors de lAjout : ', erreur);
      }
    );

  }

  onSubmitEditCaisseFormsGroup(){
    const newCaiss = new Caisse(this.editCaissFormsGroup.value['editCodeCaisse'], this.editCaissFormsGroup.value['editLibeCaisse'],
    this.arrondissements[this.editCaissFormsGroup.value['editArrondissement']]);
    this.serviceCaisse.editACaisse(this.editCaiss.codeCaisse, newCaiss).subscribe(
      (data) => {
        this.warningModal.hide();
        this.getAllCaisse();
      },
      (erreur) => {
        console.log('Erreur lors de la modification : ', erreur);
      }
    );

  }

  onConfirmDeleteCaisse(){
    this.serviceCaisse.deleteACaisse(this.suprCaiss.codeCaisse).subscribe(
      (data) => {
        this.dangerModal.hide();
        this.getAllCaisse();
      },
      (erreur) => {
        console.log('Erreur lors de la suppression de caisse : ', erreur);
      }
    );
  }


}
