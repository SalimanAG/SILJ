import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { FormGroup, FormBuilder, FormControl, RequiredValidator, Validators } from '@angular/forms';
import { Subject } from 'rxjs/internal/Subject';
import { Personne } from '../../models/personne.model';
import { Poste } from '../../models/post.model';
import { Occuper } from '../../models/occuper.model';
import { Signer } from '../../models/signer.model';
import { Rapport } from '../../models/rapport.model';
import { SignataireService } from '../../services/administration/signataire-service.service';
import { ToastrService } from 'ngx-toastr';
import { data, post } from 'jquery';

@Component({
  selector: 'app-signataire',
  templateUrl: './signataire.component.html',
  styleUrls: ['./signataire.component.css']
})
export class SignataireComponent implements OnInit {
  //Variable globales
  rapports: Rapport[];

  // variables de Poste
  titreModPost: String = '';
  postes: Poste[];
  poste: Poste;
  pos = new Poste('', '');
  addPostGroup: FormGroup;
  modPostGroup: FormGroup;
  tabPost: DataTables.Settings = {};
  dataPost: Subject<Poste> = new Subject<Poste>();
  @ViewChild('addPost') addPost: ModalDirective;
  @ViewChild('modPost') modPost: ModalDirective;
  @ViewChild('supPost') supPost: ModalDirective;

  // variables des occupations de postes
  occupers: Occuper[];
  occuper: Occuper;
  occup = new Occuper(null,null,new Personne('',''), new Poste('',''));
  addOccuGroup: FormGroup;
  modOccuGroup: FormGroup;
  tabOccu: DataTables.Settings = {};
  dataOccu: Subject<Occuper> = new Subject<Occuper>();
  @ViewChild('addOccu') addOccu: ModalDirective;
  @ViewChild('modOccu') modOccu: ModalDirective;
  @ViewChild('supOccu') supOccu: ModalDirective;

  // variables des assignations de droit de signature aux postes
  signers: Signer[];
  signer: Signer;
  sign = new Signer(null,null, new Poste('',''), new Rapport(''));
  addSignGroup: FormGroup;
  modSignGroup: FormGroup;
  tabSign: DataTables.Settings = {};
  dataSign: Subject<Signer> = new Subject<Signer>();
  @ViewChild('addSign') addSign: ModalDirective;
  @ViewChild('modSign') modSign: ModalDirective;
  @ViewChild('supSign') supSign: ModalDirective;

  // variables de personne
  personnes: Personne[];
  personne: Personne;
  pers = new Personne('', '');
  addPersGroup: FormGroup;
  modPersGroup: FormGroup;
  tabPers: DataTables.Settings = {};
  dataPers: Subject<Personne> = new Subject<Personne>();
  @ViewChild('addPers') addPers: ModalDirective;
  @ViewChild('modPers') modPers: ModalDirective;
  @ViewChild('supPers') supPers: ModalDirective;

  constructor(public tst: ToastrService,public builder: FormBuilder, public sis: SignataireService) {

   }

  ngOnInit(): void {
    this.initLists();
    this.listPers();
    this.listOccu();
    this.listPost();
    this.listSign();
    this.initForms();
  }

  initLists() {
    this.tabPost = {
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

    this.tabPers = {
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

    this.tabSign = {
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

    this.tabOccu = {
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

  listRapp() {
    this.sis.getRapports().subscribe(
   ( data) => {
      this.rapports = data;
      console.log(this.rapports);

      });
  }

  initForms() {
    this.addPostGroup = this.builder.group({
      cod: new FormControl('',Validators.required),
      lib: new FormControl('',Validators.required)
    });
    this.modPostGroup= this.builder.group({
      modCod: new FormControl('',Validators.required),
      modLib: new FormControl('',Validators.required)
    });

    this.addPersGroup = this.builder.group({
      nomPers: new FormControl('',Validators.required),
      prenomPers: new FormControl('',Validators.required)
    });
    this.modPersGroup= this.builder.group({
      modNomPers: new FormControl('',Validators.required),
      modPrenompers: new FormControl('',Validators.required)
    });

    this.addSignGroup = this.builder.group({
      addPo: new FormControl('',Validators.required),
      addRa: new FormControl('',Validators.required),
      addDeb: new FormControl('',Validators.required),
      addFin: new FormControl('',Validators.required)
    });
    this.modSignGroup= this.builder.group({
      modSignPo: new FormControl('',Validators.required),
      modSignRa: new FormControl('',Validators.required),
      modSignDeb: new FormControl('',Validators.required),
      modSignFin: new FormControl('',Validators.required)
    });

    this.addOccuGroup = this.builder.group({
      po: new FormControl('',Validators.required),
      pe: new FormControl('',Validators.required),
      deb: new FormControl('',Validators.required),
      fin: new FormControl('',Validators.required)
    });
    this.modOccuGroup= this.builder.group({
      pa: new FormControl('',Validators.required),
      pe: new FormControl('',Validators.required),
      deb: new FormControl('',Validators.required),
      fin: new FormControl('',Validators.required)
    });
  }

  ////Gestion des poste
  listPost() {
    this.sis.getPostes().subscribe(
      data => {
        this.postes = data;
        $('#dtPost').dataTable().api().destroy();
        this.dataPost.next();
      }
    );
  }

  initAddPost() {
    this.addPost.show();
  }


  //Valider add postes
  valAddPost() {
    let obj = new Poste(this.addPostGroup.value['cod'], this.addPostGroup.value['lib']);
      this.sis.addPoste(obj).subscribe(
        (data) => {
          this.tst.success('Ajout de poste réussi');
          
           this.annulAddPost();
          
        },
        (err) => {
          this.tst.warning('Ajour de poste échoué');
      });
      
  }
  annulAddPost() {
    this.addPost.hide();
    this.listPost();
  }

  initModPost(i: number) {
    this.pos = this.postes[i];
    this.modPost.show();
  }


  // Valider la modification de post
  valModPost() {
      let obj = new Poste(this.modPostGroup.value['modCod'], this.modPostGroup.value['modLib']);
      this.sis.editPoste(this.pos.idPost, obj).subscribe(
        (data) => {
          this.tst.success('Modification de poste réussie')
          //this.listPost();
          this.annulModPost();
        },
        (err) => {
          this.tst.warning('Modification de poste échoué')
        }
      )
    
  }

  annulModPost() {
    this.modPost.hide();
    this.listPost();
  }

  initSupPost(i: number) {
    this.pos = this.postes[i];
    this.supPost.show()
  }

  valSupPost() {
    this.sis.delPoste(this.pos.idPost).subscribe(
      (data) => {
        this.tst.success('Suppression effectuée avec succès');
        this.listPost();
        this.supPost.hide();
      },
      (err) => {
        this.tst.warning('Suppression échouée');
        console.log(err);
      }
    );
    
  }

  ////Gestion des personnes
  listPers() {
    this.sis.getPersonnes().subscribe(
      data => {
        this.personnes = data;
        $('#dtPers').dataTable().api().destroy();
        this.dataPers.next();
      }
    );
  }

  initAddPers() {
    this.addPers.show();
  }
  valAddPers() {
    let obj = new Personne(this.addPersGroup.value['nomPers'], this.addPersGroup.value['prenomPers']);
    console.log('Personne', obj);
    
      this.sis.addPersonne(obj).subscribe(
       (data) => {
         console.log('Personne data', data);
         
          this.tst.success('Ajout de personne réussi');
          this.annulAddPers();
        },
        (err) => {
          this.tst.warning('Ajour de personne échoué')
      });
  }

  // List des personnes et fermeture du modal personne
  annulAddPers() {
    this.listPers();
    this.addPers.hide();
  }

  initModPers(i: number) {
    this.pers = this.personnes[i];
    console.log('A modifier', this.pers);
    console.log('id: '+this.pers.idPers);
    this.modPers.show()
  }

  //Valider midification de personne
  valModPers() {
      let objPersonUpdated = new Personne(this.modPersGroup.value['modNomPers'], this.modPersGroup.value['modPrenompers']);
      objPersonUpdated.idPers = this.pers.idPers;
      console.log('Personne en mode', objPersonUpdated);
      
      this.sis.editPersonne(this.pers.idPers, objPersonUpdated).subscribe(
       (data) => {
          this.tst.success('Modification de personne réussie')
          console.log('Modif personne success ',data);

          this.listPers();
        },
       ( err) => {
          this.tst.warning('Modification de personne échoué')
        }
      );
    this.modPers.hide();
    }
  annulmodPers() {
    this.modPers.hide();
  }

  initSupPers(i: number) {
    this.pers = this.personnes[i];
    this.supPers.show();
  }

  //Validation pour suppressiin cde personne
  valSupPers() {
    this.sis.delPersonne(this.pers.idPers).subscribe(
      (data) => {
        this.tst.success('Suppression effectuée avec succès');
        this.listPers();
      },
      (err )=> {
        this.tst.warning('La suppression a échoué');
      }
    );
    this.listPers();
    this.supPers.hide();
  }

  ////Gestion des occupation de poste
  listOccu() {
    this.sis.getOccupAct().subscribe(
      data => {
        this.occupers = data;
        $('#dtOccu').dataTable().api().destroy();
        this.dataOccu.next();
      }
    );
  }

  initAddOccu() {
    this.listPers();
    this.listPost();
    this.addOccu.show()
  }
  valAddOccu() {
    let obj = new Occuper(this.addOccuGroup.value['cod'],this.addOccuGroup.value['cod'],this.addOccuGroup.value['cod'], this.addOccuGroup.value['lib']);
      this.sis.addOccuper(obj).subscribe(
        data => {
          this.tst.success('Ajout d\'occupation réussi')
        },
        err => {
          this.tst.warning('Ajour d\'occupation échoué')
      });
  }
  annulAddOccu() {
    this.addOccu.hide();
    this.listOccu();
  }

  initModOccu(i: number) {
    this.occup = this.occupers[i];
    this.listPers();
    this.listPost();
    this.modOccu.show()
  }
  valModOccu() {
      let obj = new Occuper(this.modPostGroup.value['code'], this.modPostGroup.value['code'], this.modPostGroup.value['code'], this.modPostGroup.value['lib']);
      this.sis.editOccuper(this.occup.idOccu, obj).subscribe(
        data => {
          this.tst.success('Modification d\'occupation de poste réussie')
        },
        err => {
          this.tst.warning('Modification d\'occupation de poste échoué')
        }
      )
    }
  annulmodOccu() {
    this.modOccu.hide();
    this.listOccu();
  }

  initSupOccu(i: number) {
    this.occup = this.occupers[i];
    this.supOccu.show()
  }
  valSupOccu() {
    this.sis.delOccuper(this.occup.idOccu);
  }

  ////Gestion des affectation  de de droit de signature
  listSign() {
    this.sis.getSignerActuel().subscribe(
      (data) => {
        this.signers = data;
        console.log('signataire list ', data);
        
        $('#dtSign').dataTable().api().destroy();
        this.dataSign.next();
      }
    );
  }

  initAddSign() {
    this.addSign.show()
    this.listRapp();
    this.listPost();
    this.addSignGroup.patchValue({
      addDeb: "",
      addFin: "",
      addPo: "",
      addRa: ""
    })
  }

  //Valider ajout de signataire
  valAddSign() {
    let obj = new Signer(this.addSignGroup.value['addDeb'], this.addSignGroup.value['addFin'], this.postes[this.addSignGroup.value['addPo']], this.rapports[this.addSignGroup.value['addRa']]);
    console.log('value ', obj);
    
      this.sis.addSigner(obj).subscribe(
        (data) => {
          console.log('donnéé', data);

          this.addSignGroup.patchValue({
            addDeb: '',
            addFin: '',
            addPo: '',
            addRa: ''
          })
          
          this.tst.success('Ajout d\'assignation de droit de signature');
          this.listSign();
          this.addSign.hide();


        },
        (err) => {
          this.tst.warning('Ajour d\'Signpation échoué')
      });
  }
  annulAddSign() {
    this.addSign.hide();
    this.listSign();
  }


  // initialisation de la boite de dialogue de modification 
  initModSign(i: number) {
    this.sign = this.signers[i];
    console.log('id', this.sign);
    
    this.listRapp();
    this.listPost();
    this.modSign.show()
  }
  valModSign() {
      let obj = new Signer(this.modPostGroup.value['deb'], this.modPostGroup.value['fin'], this.modPostGroup.value['po'], this.modPostGroup.value['ra']);
      this.sis.editSigner(this.sign.idSign, obj).subscribe(
        data => {
          this.tst.success('Modification d\'Signpation de poste réussie')
        },
        err => {
          this.tst.warning('Modification d\'Signpation de poste échoué')
        }
      )
    }
  annulmodSign() {
    this.modSign.hide();
    this.listSign();
  }


  //initialisation de la boite de dialogue de suppression
  initSupSign(i: number) {
    this.sign = this.signers[i];
    console.log('val', this.sign);
    
    this.supSign.show();
  }


  valSupSign() {
    this.sis.delSigner(this.sign.idSign).subscribe(
      (data) =>{
        this.tst.success('Suppression effectuée avec succès');
        console.log('data', data);
        this.listSign();
        this.supSign.hide();
        

      },
      (err) =>{

      });
    
  }

}
