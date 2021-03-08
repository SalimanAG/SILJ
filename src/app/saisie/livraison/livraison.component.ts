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
import { DataTableDirective } from 'angular-datatables';

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
  new Utilisateur('', '', '', '', '', false, new Service('', ''))),new Article('', '', false, false, false, false, 0, '', new Famille('', ''), new Uniter('', '')));
 
  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;
  
  opCaisse:OpCaisse[]=[];
  caisses : Caisse[];

  //FormControl
  debut = new FormControl((new Date()).toISOString().substring(0, 10));
  fin = new FormControl((new Date()).toISOString().substring(0, 10));
  opCaisseLivre = new FormControl('');

  initialised:boolean = false;
  

  constructor(private servOp:OperationCaisseService, private fbuilder:FormBuilder) {
    this.initDtOptions();
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

  
    this.servOp.getAllOpLines().subscribe(
      (data) => {
        data.forEach((element,index) => {
          if(element.livre===false && element.article.livrableArticle===true && element.opCaisse.typeRecette.codeTypRec==="VD"
          && element.opCaisse.caisse.codeCaisse===this.opCaisseLivre.value 
          && element.opCaisse.dateOpCaisse>=this.debut.value && element.opCaisse.dateOpCaisse<=this.fin.value)
          {
            this.ligneopcaisse.push(element);
            
            console.log('verifi',this.ligneopcaisse);
            
            
          }
          
         
            
           // $('#actualise').dataTable().api().destroy();
            
           

        }); 
        this.dtTrigger1.next();
        
      },
      (erreur) => {
        console.log('Erreur lors de la récupération de la liste des actes livrables non livré ', erreur);
      }
    );
    
    

    this.servOp.getAllCaisses()
    .subscribe(
      (data)=>{
        this.caisses=data;
      },
      (err)=>{
        console.log('Caisses:', err)
      }
    );
  }

  chargerInformations(){

    this.ligneopcaisse = [];
    $('#actualise').dataTable().api().destroy();
    this.dtTrigger1.next();
   


    console.log('Chargement 1', this.ligneopcaisse.toString());
    
    this.servOp.getAllOpLines().subscribe(
      (data) => {
        data.forEach((element,index) => {
          if(element.livre===false && element.article.livrableArticle===true && element.opCaisse.typeRecette.codeTypRec==="VD"
          && element.opCaisse.caisse.codeCaisse===this.opCaisseLivre.value 
          && element.opCaisse.dateOpCaisse>=this.debut.value && element.opCaisse.dateOpCaisse<=this.fin.value)
          {
            this.ligneopcaisse.push(element);
            
            console.log('verifi',this.ligneopcaisse);
            
            
          }
          
        }); 
        
        
      },
      (erreur) => {
        console.log('Erreur lors de la récupération de la liste des actes livrables non livré ', erreur);
      }
    );
    
  }

  verifierRecuperation()
  {
   
    this.chargerInformations();
   
  }

  validerLivraison(inde:number)
  {
      this.editligneOpCaisse =  this.ligneopcaisse[inde];
      this.editligneOpCaisse.livre=true;
      this.servOp.editOpLine(this.editligneOpCaisse.idLigneOperCaisse,this.editligneOpCaisse).subscribe(
        (data) => {
          
          this.chargerInformations();
          
        },
        (erreur) => {
          console.log('Erreur lors de la récupération ', erreur);
        }

      );
      
      
  }

  

}
