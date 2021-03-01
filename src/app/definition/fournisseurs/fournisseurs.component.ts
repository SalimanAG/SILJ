import {Component, ViewChild, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import {ModalDirective} from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { Fournisseur } from '../../../models/fournisseur.model';
import { FournisseurService } from '../../../services/definition/fournisseur.service';

@Component({
  selector: 'app-fournisseurs',
  templateUrl: './fournisseurs.component.html',
  styleUrls: ['./fournisseurs.component.css']
})
export class FournisseursComponent implements OnInit {

  @ViewChild('primaryModal') public primaryModal: ModalDirective;
  @ViewChild('successModal') public successModal: ModalDirective;
  @ViewChild('warningModal') public warningModal: ModalDirective;
  @ViewChild('dangerModal') public dangerModal: ModalDirective;
  @ViewChild('infoModal') public infoModal: ModalDirective;

  dtOptions1: DataTables.Settings = {};
  dtTrigger1: Subject<any> = new Subject<any>();
  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;
  addFrsFormsGroup: FormGroup;
  editFrsFormsGroup: FormGroup;
  fournisseurs:Fournisseur[];
  editFrs:Fournisseur = new Fournisseur('', '', '', '', '', '', '');
  suprFrs:Fournisseur = new Fournisseur('', '', '', '', '', '', '');
  infosFrs:Fournisseur = new Fournisseur('', '', '', '', '', '', '');

  constructor(private formBulder: FormBuilder, private frsService:FournisseurService) {

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

    this.addFrsFormsGroup = this.formBulder.group({
      addCodeFrs:['', Validators.required],
      addIdentiteFrs:['', Validators.required],
      addAdresseFrs:'',
      addRaisonSociale:'',
      addNumIfuFrs:'',
      addTelFRS:'',
      addDescription:''
    });

    this.editFrsFormsGroup = this.formBulder.group({
      editCodeFrs:['', Validators.required],
      editIdentiteFrs:['', Validators.required],
      editAdresseFrs:'',
      editRaisonSociale:'',
      editNumIfuFrs:'',
      editTelFRS:'',
      editDescription:''
    });



  }

  ngOnInit(): void {
    this.frsService.getAllFrs().subscribe(
      (data) => {
        this.fournisseurs = data;
        this.dtTrigger1.next();
      },
      (erreur) => {
        console.log('Erreur lors de la récupération des Frs', erreur);
      }
    );
  }

  getAllFrs(){
    this.frsService.getAllFrs().subscribe(
      (data) => {
        this.fournisseurs = data;
        $('#dataTable1').dataTable().api().destroy();
        this.dtTrigger1.next();
        /*this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
          this.dtTrigger1.next();
        });*/
      },
      (erreur) => {
        console.log('Erreur lors de la récupération des Frs', erreur);
      }
    );
  }

  initInfosFrs(inde:number){
    this.infosFrs = this.fournisseurs[inde];
    this.infoModal.show();
  }

  initEditFrs(inde:number){
    this.editFrs = this.fournisseurs[inde];
    this.warningModal.show();
  }

  initDeleteFrs(inde:number){
    this.suprFrs = this.fournisseurs[inde];
    this.dangerModal.show();
  }

  onSubmitAddFrsFormsGroup(){
    const newFrs = new Fournisseur(this.addFrsFormsGroup.value['addCodeFrs'], this.addFrsFormsGroup.value['addIdentiteFrs'], this.addFrsFormsGroup.value['addAdresseFrs'],
    this.addFrsFormsGroup.value['addRaisonSociale'], this.addFrsFormsGroup.value['addNumIfuFrs'], this.addFrsFormsGroup.value['addTelFRS'], this.addFrsFormsGroup.value['addDescription']);
    this.frsService.addAFrs(newFrs).subscribe(
      (data) => {
        this.primaryModal.hide();
        this.getAllFrs();
      },
      (erreur) => {
        console.log('Erreur lors de l\'enrégistrement', erreur);
      }
    );

  }

  onSubmitEditFrsFormsGroup(){
    const newFrs = new Fournisseur(this.editFrsFormsGroup.value['editCodeFrs'], this.editFrsFormsGroup.value['editIdentiteFrs'], this.editFrsFormsGroup.value['editAdresseFrs'],
    this.editFrsFormsGroup.value['editRaisonSociale'], this.editFrsFormsGroup.value['editNumIfuFrs'], this.editFrsFormsGroup.value['editTelFRS'], this.editFrsFormsGroup.value['editDescription']);
    this.frsService.editAFrs(this.editFrs.codeFrs, newFrs).subscribe(
      (data) => {

        this.warningModal.hide();
        this.getAllFrs();
      },
      (erreur) => {
        console.log('Erreur lors de la modification : ', erreur);
      }
    );

  }

  onConfirmDeleteFrs(){
    this.frsService.deleteAFrs(this.suprFrs.codeFrs).subscribe(
      (data) => {
        this.dangerModal.hide();
        this.getAllFrs();
      },
      (erreur) => {
        console.log('Erreur lors de la suppression : ', erreur);
      }
    );

  }



}
