import {Component, ViewChild, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { data } from 'jquery';
import {ModalDirective} from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { Locataire } from '../../../models/locataire.model';
import { LocataireService } from '../../../services/definition/locataire.service';

@Component({
  selector: 'app-locataires',
  templateUrl: './locataires.component.html',
  styleUrls: ['./locataires.component.css']
})
export class LocatairesComponent implements OnInit {

  @ViewChild('primaryModal') public primaryModal: ModalDirective;
  @ViewChild('successModal') public successModal: ModalDirective;
  @ViewChild('warningModal') public warningModal: ModalDirective;
  @ViewChild('dangerModal') public dangerModal: ModalDirective;
  @ViewChild('infoModal') public infoModal: ModalDirective;

  dtOptions1: DataTables.Settings = {};
  dtTrigger1: Subject<any> = new Subject<any>();
  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;
  addLocataireFormsGroup: FormGroup;
  editLocataireFormsGroup: FormGroup;
  locataires:Locataire[];
  editLocatai:Locataire = new Locataire('', '', '', '', '');
  suprLocatai:Locataire = new Locataire('', '', '', '', '');
  infosLocatai:Locataire = new Locataire('', '', '', '', '');

  constructor(private formBulder: FormBuilder, private locataiService:LocataireService) {
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

    this.addLocataireFormsGroup=this.formBulder.group(
      {
        addIdentiteLocataire:['', Validators.required],
        addAdresseLocataire:'',
        addTelLocataire:'',
        addIfuLocataire:'',
        addPersonneAContacter:''
      }
    );
    this.editLocataireFormsGroup=this.formBulder.group(
      {
        editIdentiteLocataire:['', Validators.required],
        editAdresseLocataire:'',
        editTelLocataire:'',
        editIfuLocataire:'',
        editPersonneAContacter:''
      }
    );
  }

  ngOnInit(): void {
    this.locataiService.getAllLocataire().subscribe(
      (data) => {
        this.locataires = data;
        this.dtTrigger1.next();

      },
      (erreur) => {
        console.log('Erreur lors de la récupération de la liste de locataire : ', erreur);
      }
    );
  }

  getAllLocataire(){
    this.locataiService.getAllLocataire().subscribe(
      (data) => {
        this.locataires = data;
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
          this.dtTrigger1.next();
        });
      },
      (erreur) => {
        console.log('Erreur lors de la récupération de la liste de locataire : ', erreur);
      }
    );
  }

  initEditLocataire(inde:number){
    this.editLocatai = this.locataires[inde];
    this.warningModal.show();
  }

  initDeleteLocataire(inde:number){
    this.suprLocatai = this.locataires[inde];
    this.dangerModal.show();
  }

  initInfosLocataire(inde:number){
    this.infosLocatai = this.locataires[inde];
    this.infoModal.show();
  }

  onSubmitAddLocataiFormsGroup(){
    const newLocatai = new Locataire(this.addLocataireFormsGroup.value['addIdentiteLocataire'], this.addLocataireFormsGroup.value['addAdresseLocataire'],
    this.addLocataireFormsGroup.value['addTelLocataire'], this.addLocataireFormsGroup.value['addIfuLocataire'],
    this.addLocataireFormsGroup.value['addPersonneAContacter']);
    this.locataiService.addALocataire(newLocatai).subscribe(
      (data) => {
        //this.primaryModal.hide();
        this.addLocataireFormsGroup.reset();
        this.getAllLocataire();
      },
      (erreur) => {
        console.log('Erreur lors de lajout : ', erreur);
      }
    );

  }

  onSubmitEditLocataiFormsGroup(){
    const newLocatai = new Locataire(this.editLocataireFormsGroup.value['editIdentiteLocataire'], this.editLocataireFormsGroup.value['editAdresseLocataire'],
    this.editLocataireFormsGroup.value['editTelLocataire'], this.editLocataireFormsGroup.value['editIfuLocataire'],
    this.editLocataireFormsGroup.value['editPersonneAContacter']);
    this.locataiService.editALocataire(this.editLocatai.idLocataire.toString(), newLocatai).subscribe(
      (data) => {
        this.warningModal.hide();
        this.getAllLocataire();
      },
      (erreur) => {
        console.log('Erreur lors de la modification du locataire : ', erreur);
      }
    );

  }

  onConfirmDeleteLocatai(){
    this.locataiService.deleteALocataire(this.suprLocatai.idLocataire.toString()).subscribe(
      (data) => {
        this.dangerModal.hide();
        this.getAllLocataire();
      },
      (erreur) => {
        console.log('Erreur lors de la sippression : ', erreur);
      }
    )

  }

}
