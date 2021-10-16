import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { Localisation } from '../../../../models/comptabilite/localisation.model';
import { SiteMarcher } from '../../../../models/siteMarcher.model';
import { LocalisationService } from '../../../../services/comptabilite/localisation.service';
import { CommuneService } from '../../../../services/definition/commune.service';

@Component({
  selector: 'app-localisation',
  templateUrl: './localisation.component.html',
  styleUrls: ['./localisation.component.css']
})
export class LocalisationComponent implements OnInit {

  @ViewChild('add') public add: ModalDirective;
  @ViewChild('edit') public edit: ModalDirective;
  @ViewChild('del') public del: ModalDirective;
  @ViewChild('dangerModal') public dangerModal: ModalDirective;
  @ViewChild('infoModal') public infoModal: ModalDirective;

  dtOptions1: DataTables.Settings = {};
  dtTrigger1: Subject<Localisation> = new Subject<any>();
  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;
  addGroup: FormGroup;
  editGroup: FormGroup;
  localisations:Localisation[];
  addingLoc:Localisation = new Localisation(0, '', '', null);
  editingLoc:Localisation = new Localisation(0, '', '', null );
  infoLoc:Localisation = new Localisation(0, '', '',null);

  supLoc:Localisation = new Localisation(0, '', '',null);
  sites: SiteMarcher[];

  constructor(private builder: FormBuilder,public comSer: CommuneService, private locService:LocalisationService) {

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

    this.addGroup = this.builder.group({
      addCod:['', Validators.required],
      addLib:['', Validators.required],
      addSit:[0]
    });

    this.editGroup = this.builder.group({
      editCod:['', Validators.required],
      editLib:['', Validators.required],
      editSit:''
    });



  }

  ngOnInit(): void {
    this.locService.getAllLocalisation().subscribe(
      (data) => {
        this.localisations = data;
        this.dtTrigger1.next();
      },
      (erreur) => {
        console.log('Erreur lors de la récupération des Frs', erreur);
      }
    );
  }

  initAdd(){
    this.comSer.getAllSiteMarcher().subscribe(
      data=>{
        this.sites=data
        this.add.show();
      }
    )
  }

  getAllLoc(){
    this.locService.getAllLocalisation().subscribe(
      (data) => {
        this.localisations = data;
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
    this.infoLoc = this.localisations[inde];
    this.infoModal.show();
  }

  initEditFrs(inde:number){
    this.editingLoc = this.localisations[inde];
    this.edit.show();
  }

  initDeleteFrs(inde:number){
    this.supLoc = this.localisations[inde];
    this.dangerModal.show();
  }

  onSubmitAddFrsFormsGroup(){
    const newLoc = new Localisation(0, this.addGroup.value['addCod'], this.addGroup.value['addLib'],
    this.sites[this.addGroup.value['addSit']]);
    this.locService.addALocalisation(newLoc).subscribe(
      (data) => {
        //this.primaryModal.hide();
        this.addGroup.reset();
        this.getAllLoc();
      },
      (erreur) => {
        console.log('Erreur lors de l\'enrégistrement', erreur);
      }
    );

  }

  onSubmitEditFrsFormsGroup(){
    const local = new Localisation(0,this.editGroup.value['editCod'], this.editGroup.value['editLib'],
    this.sites[this.editGroup.value['editTelFRS']]);
    this.locService.editALocalisation(this.editingLoc.idLoc.toString(), local).subscribe(
      (data) => {

        this.edit.hide();
        this.getAllLoc();
      },
      (erreur) => {
        console.log('Erreur lors de la modification : ', erreur);
      }
    );

  }

  onConfirmDeleteFrs(){
    this.locService.deleteALocalisation(this.supLoc.idLoc.toString()).subscribe(
      (data) => {
        this.dangerModal.hide();
        this.getAllLoc();
      },
      (erreur) => {
        console.log('Erreur lors de la suppression : ', erreur);
      }
    );

  }



}
