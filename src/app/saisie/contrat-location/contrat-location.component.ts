import {Component, ViewChild, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { data } from 'jquery';
import {ModalDirective} from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { Arrondissement } from '../../../models/arrondissement.model';
import { Commune } from '../../../models/commune.model';
import { Contrat } from '../../../models/contrat.model';
import { Departement } from '../../../models/departement.model';
import { Immeuble } from '../../../models/immeuble.model';
import { Locataire } from '../../../models/locataire.model';
import { Pays } from '../../../models/pays.model';
import { Quartier } from '../../../models/quartier.model';
import { SiteMarcher } from '../../../models/siteMarcher.model';
import { TypeImmeuble } from '../../../models/typeImmeuble.model';
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
  editContrat:Contrat = new Contrat('', new Date(), new Date(), 0, 0, new Immeuble('', '', '', false, 0, 0, '', '',
  new Arrondissement('','','','',new Commune('','','','',new Departement('','',new Pays('','','')))),
  new Quartier('','','','',new Arrondissement('','','','',new Commune('','','','',new Departement('','',new Pays('','',''))))),
  new TypeImmeuble('',''),new SiteMarcher('','','',new Arrondissement('','','','',new Commune('','','','',new Departement('','',new Pays('','','')))))),
  new Locataire('','','','',''));
  suprContrat:Contrat = new Contrat('', new Date(), new Date(), 0, 0, new Immeuble('', '', '', false, 0, 0, '', '',
  new Arrondissement('','','','',new Commune('','','','',new Departement('','',new Pays('','','')))),
  new Quartier('','','','',new Arrondissement('','','','',new Commune('','','','',new Departement('','',new Pays('','',''))))),
  new TypeImmeuble('',''),new SiteMarcher('','','',new Arrondissement('','','','',new Commune('','','','',new Departement('','',new Pays('','','')))))),
  new Locataire('','','','',''));;
  infosContrat:Contrat = new Contrat('', new Date(), new Date(), 0, 0, new Immeuble('', '', '', false, 0, 0, '', '',
  new Arrondissement('','','','',new Commune('','','','',new Departement('','',new Pays('','','')))),
  new Quartier('','','','',new Arrondissement('','','','',new Commune('','','','',new Departement('','',new Pays('','',''))))),
  new TypeImmeuble('',''),new SiteMarcher('','','',new Arrondissement('','','','',new Commune('','','','',new Departement('','',new Pays('','','')))))),
  new Locataire('','','','',''));;

  //Quelques listes
  locataires: Locataire[] = [];
  valeurLocatives:Immeuble[] = [];
  typeValeursLocatives:TypeImmeuble[] = [];
  valeurLocativesByType:Immeuble[] = [];

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
      addNumContrat:['', Validators.required],
      addDateSignatureContrat:[new Date(), Validators.required],
      addDateEffetContrat:[new Date(), Validators.required],
      addAvanceContrat:[0, Validators.required],
      addCautionContrat:[0, Validators.required],
      addImmeuble:[0, Validators.required],
      addLocataire:[0, Validators.required],
      addIndeTypeIm:[0, Validators.required]
    });

    this.editContratFormsGroup = formBulder.group({
      editNumContrat:['', Validators.required],
      editDateSignatureContrat:[new Date(), Validators.required],
      editDateEffetContrat:[new Date(), Validators.required],
      editAvanceContrat:[0, Validators.required],
      editCautionContrat:[0, Validators.required],
      editImmeuble:[0, Validators.required],
      editLocataire:[0, Validators.required],
      editIndeTypeIm:[0, Validators.required]
    });

  }

  ngOnInit(): void {
    this.serviceContrat.getAllContrat().subscribe(
      (data) => {
        this.contrats = data;
        this.dtTrigger1.next();
      },
      (erreur) => {
        console.log('Erreur lors de la récupération de la liste de contrat : ', erreur);
      }
    );

    this.getAllImmeuble();
    this.getAllLocataire();

    this.serviceImmeuble.getAllTypeImmeuble().subscribe(
      (data) => {
        this.typeValeursLocatives = data;
        if(this.typeValeursLocatives.length != 0){
          this.getImmeublesByCodeType(this.typeValeursLocatives[0].codeTypIm);
          this.addContratFormsGroup.value['addIndeTypeIm']=0;
          this.addContratFormsGroup.value['editIndeTypeIm']=0;
        }
      },
      (erreur) => {
        console.log('Erreur lors de la récupération de la liste des type de valeur locative : ', erreur);
      }
    );


  }

  getAllContrat(){
    this.serviceContrat.getAllContrat().subscribe(
      (data) => {
        this.contrats = data;
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
          this.dtTrigger1.next();
        });
      },
      (erreur) => {
        console.log('Erreur lors de la récupération de la liste de contrat : ', erreur);
      }
    );
  }

  getAllLocataire(){
    this.serviceLocataire.getAllLocataire().subscribe(
      (data) => {
        this.locataires = data;
      },
      (erreur) => {
        console.log('Erreur lors de la récupération de la liste des locataires : ', erreur);
      }
    );
  }

  getAllImmeuble(){
    this.serviceImmeuble.getAllImmeuble().subscribe(
      (data) => {
        this.valeurLocatives = data;
      },
      (erreur) => {
        console.log('Erreur lors de la récupération de la liste des immeubles : ', erreur);
      }
    );
  }

  getAllTypeImmeuble(){
    this.serviceImmeuble.getAllTypeImmeuble().subscribe(
      (data) => {
        this.typeValeursLocatives = data;
      },
      (erreur) => {
        console.log('Erreur lors de la récupération de la liste des type de valeur locative : ', erreur);
      }
    );
  }

  getImmeublesByCodeType(code:String){
    this.valeurLocativesByType = [];
    this.valeurLocatives.forEach(valeurLoca => {
      if(valeurLoca.typeImmeuble.codeTypIm === code){
        this.valeurLocativesByType.push(valeurLoca);
      }
    });
  }

  initEditContrat(inde:number){
    this.editContrat = this.contrats[inde];
    this.warningModal.show();
  }

  initDeleteContrat(inde:number){
    this.suprContrat = this.contrats[inde];
    this.dangerModal.show();
  }

  initInfoContrat(inde:number){
    this.infosContrat = this.contrats[inde];
    this.infoModal.show();
  }

  onSubmitAddContratFormsGroup(){
    const newContrat = new Contrat(this.addContratFormsGroup.value['addNumContrat'],
    this.addContratFormsGroup.value['addDateSignatureContrat'],
    this.addContratFormsGroup.value['addDateEffetContrat'],
    this.addContratFormsGroup.value['addAvanceContrat'],
    this.addContratFormsGroup.value['addCautionContrat'],
    this.valeurLocativesByType[this.addContratFormsGroup.value['addImmeuble']],
    this.locataires[this.addContratFormsGroup.value['addLocataire']]);

    console.log(newContrat, this.addContratFormsGroup.value);

    this.serviceContrat.addAContrat(newContrat).subscribe(
      (data) => {
        this.primaryModal.hide();
        this.getAllContrat();
      },
      (erreur) => {
        console.log('Erreur lors de lAjout du contrat : ', erreur);
      }
    );

  }

  onSubmitEditContratFormsGroup(){
    const newContrat = new Contrat(this.editContratFormsGroup.value['editNumContrat'],
    this.editContratFormsGroup.value['editDateSignatureContrat'],
    this.editContratFormsGroup.value['editDateEffetContrat'],
    this.editContratFormsGroup.value['editAvanceContrat'],
    this.editContratFormsGroup.value['editCautionContrat'],
    this.valeurLocativesByType[this.editContratFormsGroup.value['editImmeuble']],
    this.locataires[this.editContratFormsGroup.value['editLocataire']]);
    this.serviceContrat.editAContrat(this.editContrat.numContrat, newContrat).subscribe(
      (data) => {
        this.warningModal.hide();
        this.getAllContrat();
      },
      (erreur) => {
        console.log('Erreur lors de lEdition du Contrat : ', erreur);
      }
    );

  }

  onConfirmDeleteContrat(){
    console.log(this.suprContrat.numContrat);
    this.serviceContrat.deleteAContrat(this.suprContrat.numContrat).subscribe(
      (data) => {
        this.dangerModal.hide();
        this.getAllContrat()
      },
      (erreur) => {
        console.log('Erreur lors de la suppression du Contrat : ', erreur);
      }
    );

  }

  onTypeImmeubleClicked1(){
    if(this.typeValeursLocatives.length != 0)
    this.getImmeublesByCodeType(this.typeValeursLocatives[this.addContratFormsGroup.value['addIndeTypeIm']].codeTypIm );
  }

  onTypeImmeubleClicked2(){
    if(this.typeValeursLocatives.length != 0)
    this.getImmeublesByCodeType(this.typeValeursLocatives[this.editContratFormsGroup.value['editIndeTypeIm']].codeTypIm );
  }

}
