import {Component, ViewChild, OnInit} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import {ModalDirective} from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { Contrat } from '../../../models/contrat.model';
import { Locataire } from '../../../models/locataire.model';
import { LocataireService } from '../../../services/definition/locataire.service';
import { ValeurLocativeService } from '../../../services/definition/valeur-locative.service';
import { ContratLocationService } from '../../../services/saisie/contrat-location.service';

@Component({
  selector: 'app-contrat-location',
  templateUrl: './contrat-location.component.html',
  styleUrls: ['./contrat-location.component.css']
})
export class ContratLocationComponent implements OnInit {

  @ViewChild('primaryModal') public primaryModal: ModalDirective;
  @ViewChild('successModal') public successModal: ModalDirective;
  @ViewChild('warningModal') public warningModal: ModalDirective;
  @ViewChild('dangerModal') public dangerModal: ModalDirective;
  @ViewChild('infoModal') public infoModal: ModalDirective;

  dtOptions1: DataTables.Settings = {};
  dtTrigger1: Subject<any> = new Subject<any>();
  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;
  addContratFormsGroup: FormGroup;
  editContratFormsGroup: FormGroup;
  contrats:Contrat[];
  editContrat:Contrat ;
  suprContrat:Contrat ;
  infosContrat:Contrat ;

  //Quelques listes
  locataires: Locataire[];
  valeurLocatives:String;
  typeValeursLocatives:String;
  valeurLocativesByType:String;

  constructor(private serviceContrat:ContratLocationService, private formBulder:FormBuilder,
    private serviceLocataire:LocataireService, private serviceImmeuble:ValeurLocativeService) {
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

    this.addContratFormsGroup = formBulder.group({
      addNumContrat:'',
      addDateSignatureContrat:new Date(),
      addDateEffetContrat:new Date(),
      addAvanceContrat:0,
      addCautionContrat:0,
      addImmeuble:0,
      addLocataire:0
    });

    this.editContratFormsGroup = formBulder.group({
      editNumContrat:'',
      editDateSignatureContrat:new Date(),
      editDateEffetContrat:new Date(),
      editAvanceContrat:0,
      editCautionContrat:0,
      editImmeuble:0,
      editLocataire:0
    });

  }

  ngOnInit(): void {
  }

  initEditContrat(inde:number){
    this.warningModal.show();
  }

  initDeleteContrat(inde:number){
    this.dangerModal.show();
  }

  initInfoContrat(inde:number){
    this.infoModal.show();
  }

  onSubmitAddContratFormsGroup(){
    this.primaryModal.hide();
  }

  onSubmitEditContratFormsGroup(){
    this.warningModal.hide();
  }

  onConfirmDeleteContrat(){
    this.dangerModal.hide();
  }

}
