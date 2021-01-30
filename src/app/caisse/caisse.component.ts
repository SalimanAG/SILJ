import {Component, ViewChild, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import {ModalDirective} from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { Caisse } from '../../models/caisse.model';
import { CaisseService } from '../../services/administration/caisse.service';

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
  editCaiss:Caisse = new Caisse('', '', '');
  suprCaiss:Caisse = new Caisse('', '', '');
  infoCaiss:Caisse = new Caisse('', '', '');

  constructor(private serviceCaisse : CaisseService, private formBulder:FormBuilder) {
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
    this.editCaiss = this.caisses[inde];
    this.infoModal.show();
  }

  onSubmitAddCaisseFormsGroup(){
    const newCaiss = new Caisse(this.addCaissFormsGroup.value['addCodeCaisse'], this.addCaissFormsGroup.value['addLibeCaisse'],
    this.addCaissFormsGroup.value['addArrondissement']);
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
    this.editCaissFormsGroup.value['editArrondissement']);
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
