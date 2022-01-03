import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LigneOpCaisse } from '../../../models/ligneopcaisse.model';
import { OpCaisse } from '../../../models/OpeCaisse.model';
import { OperationCaisseService } from '../../../services/saisie/operation-caisse.service';
import { Caisse } from '../../../models/caisse.model';
import { exit } from 'process';
import { Subject } from 'rxjs';
import { data } from 'jquery';
import { element } from 'protractor';
import * as moment from 'moment';



import { Pays } from '../../../models/pays.model';
import { Departement } from '../../../models/departement.model';
import { Commune } from '../../../models/commune.model';
import { Arrondissement } from '../../../models/arrondissement.model';
import { TypeRecette } from '../../../models/type.model';
import { ModePaiement } from '../../../models/mode.model';
import { Exercice } from '../../../models/exercice.model';
import { Utilisateur } from '../../../models/utilisateur.model';
import { Article } from '../../../models/article.model';
import { Famille } from '../../../models/famille.model';
import { Service } from '../../../models/service.model';
import { Uniter } from '../../../models/uniter.model';
import { Affecter } from '../../../models/affecter.model';
import { DataTableDirective } from 'angular-datatables';

import { Gerer } from '../../../models/gerer.model';
import { TypCorres } from '../../../models/typCorres.model';
import { Correspondant } from '../../../models/Correspondant.model';
import { Magasin } from '../../../models/magasin.model';
import { Magasinier } from '../../../models/magasinier.model';
import { Regisseur } from '../../../models/regisseur.model';
import { Stocker } from '../../../models/stocker.model';
import { ExerciceService } from '../../../services/administration/exercice.service';
import { ArticleService } from '../../../services/definition/article.service';
import { CorrespondantService } from '../../../services/definition/correspondant.service';
import { UtilisateurService } from '../../../services/administration/utilisateur.service';
import { Fonction } from '../../../models/fonction.model';
import { SearchLinesOpCaissDTO } from '../../../models/searchLinesOpCaissDTO.model';
import { LivraisonService } from '../../../services/saisie/livraison.service';

@Component({
  selector: 'app-livraison',
  templateUrl: './livraison.component.html',
  styleUrls: ['./livraison.component.css']
})
export class LivraisonComponent implements OnInit {


  dtOptions1: DataTables.Settings = {};
  dtTrigger1: Subject<any> = new Subject<any>();
  ligneopcaisse:LigneOpCaisse[] = [];
  ligneForOp:LigneOpCaisse[] = [];
  editligneOpCaisse:LigneOpCaisse = new LigneOpCaisse(0,0,'', new OpCaisse('', new Date(),'',true,'',new Date(),
  new Caisse('','',new Arrondissement('', '','','', new Commune('','','','',new Departement('','',new Pays('','',''))))),
  new TypeRecette('',''), new ModePaiement('',''),new Exercice('', '', new Date(), new Date(), '', false),
  new Utilisateur('', '', '', '', new Fonction('',''), false, new Service('', ''))),new Article('', '', false, false, false, false, 0, '', new Famille('', ''), new Uniter('', '')));

  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;

  opCaisse:OpCaisse[]=[];
  caisses : Affecter[]=[];
  correspondant : Correspondant = new Correspondant('', false, new Magasinier('', '', ''),
  new TypCorres('', ''), new Utilisateur('', '', '', '', new Fonction('',''), false, new Service('', '')));
  utilisateur : Utilisateur [];
  correspondant1 : Correspondant [];

  //FormControl
  debut = new FormControl(moment(new Date().setHours(8, 0)).format("yyyy-MM-DDTHH:mm"));
  fin = new FormControl(moment(new Date().setHours(18, 0)).format("yyyy-MM-DDTHH:mm"));
  opCaisseLivre = new FormControl('');

   initialised:boolean = false;
   magasinMagasinierConnected: Magasin = null;
   articleLigneOpcaisseLivre:LigneOpCaisse = null;


  constructor(private servOp:OperationCaisseService, private serviceUser:UtilisateurService, private serviceCorres:
    CorrespondantService, private livraisonService: LivraisonService, private fbuilder:FormBuilder) {
    this.initDtOptions();
    moment.locale('fr');
   }

  initDtOptions(){
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
  }

  ngOnInit(): void {

    console.log('date debut ==>');
    console.log(this.debut.value);
    
    let searchLinesOpCaissDTO = new SearchLinesOpCaissDTO;
    searchLinesOpCaissDTO.startDateTime = this.debut.value;
    searchLinesOpCaissDTO.endDateTime = this.fin.value;
    searchLinesOpCaissDTO.codeCaisse = this.opCaisseLivre.value;
    console.log('payload');
    console.log(searchLinesOpCaissDTO);
   
    this.servOp.getAllLinesOpCaisseByPeriodeAndCaisse(searchLinesOpCaissDTO).subscribe(
      (data) => {
        this.ligneopcaisse = data;
        console.log('data with payload search ==>');
        console.log( data);
        
        this.dtTrigger1.next();

      },
      (erreur) => {
        console.log('Erreur lors de la récupération de la liste des actes livrables non livré ', erreur);
      }
    );



    this.servOp.getAllAffectations()
    .subscribe(
      (data)=>{

        data.forEach(element =>{
          if(element.utilisateur.idUtilisateur === this.serviceUser.connectedUser.idUtilisateur)
          this.caisses.push(element);
         // console.log("+-+-",this.caisses);

        });
        //this.caisses=data;
      },
      (err)=>{
        console.log('Caisses:', err)
      }
    );

    // Recupération du magasin de l'utilisateur connecté

    this.livraisonService.magasinByUserId(this.serviceUser.connectedUser.idUtilisateur).subscribe(
      (data) =>{
        console.log("Magasin Livreur", data);
        this.magasinMagasinierConnected = data
        

      }, 
      (erreur) => {
        console.log('Erreur lors de relation gerer', erreur);
      }
      
      
    )
  }

  verifierRecuperation()
  {

    //this.chargerInformations();
    let searchLinesOpCaissDTO = new SearchLinesOpCaissDTO;
    searchLinesOpCaissDTO.startDateTime = this.debut.value;
    searchLinesOpCaissDTO.endDateTime = this.fin.value;
    searchLinesOpCaissDTO.codeCaisse = this.opCaisseLivre.value;
    console.log('payload 2 ==>');
    console.log(searchLinesOpCaissDTO);
    this.getAllLinesOpCaisseNotLivreByPeriodeAndCaisse(searchLinesOpCaissDTO);

  }

  validerLivraison(inde:number)
  {
      this.editligneOpCaisse =  this.ligneopcaisse[inde];
      this.articleLigneOpcaisseLivre = this.editligneOpCaisse;
      this.editligneOpCaisse.livre=true;
      this.livraisonService.validerLivraison(this.editligneOpCaisse.idLigneOperCaisse, this.serviceUser.connectedUser.idUtilisateur).subscribe(
        (data) => {
          console.log(data);

    let searchLinesOpCaissDTO = new SearchLinesOpCaissDTO;
    searchLinesOpCaissDTO.startDateTime = this.debut.value;
    searchLinesOpCaissDTO.endDateTime = this.fin.value;
    searchLinesOpCaissDTO.codeCaisse = this.opCaisseLivre.value;
    console.log('payload 2 ==>');
    console.log(searchLinesOpCaissDTO);
    this.getAllLinesOpCaisseNotLivreByPeriodeAndCaisse(searchLinesOpCaissDTO);
    //end

        },
        (erreur) => {
          console.log('Erreur lors de la récupération ', erreur);
        }

      );


  }

  // get all lines opcaisse by periode and caisse
  getAllLinesOpCaisseNotLivreByPeriodeAndCaisse(searchLinesOpCaissDTO: SearchLinesOpCaissDTO){

    this.servOp.getAllLinesOpCaisseByPeriodeAndCaisse(searchLinesOpCaissDTO).subscribe(
      (data) => {
        this.ligneopcaisse= data;
        console.log('data with payload search ==>');
        console.log( data);
        
        $('#actualise').dataTable().api().destroy();
        this.dtTrigger1.next();

      },
      (erreur) => {
        console.log('Erreur lors de la récupération de la liste des actes livrables non livré ', erreur);
      }
    );

  }

}
