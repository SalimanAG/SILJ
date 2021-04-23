import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

import { AppComponent } from './app.component';

// Import containers
import { DefaultLayoutComponent } from './containers';

import { P404Component } from './views/error/404.component';
import { P500Component } from './views/error/500.component';
import { LoginComponent } from './views/login/login.component';
import { RegisterComponent } from './views/register/register.component';

//modale
import { ModalModule } from 'ngx-bootstrap/modal';

//dataTable
import { DataTablesModule } from 'angular-datatables';

import {HttpClientModule} from '@angular/common/http';

const APP_CONTAINERS = [
  DefaultLayoutComponent
];

import {
  AppAsideModule,
  AppBreadcrumbModule,
  AppHeaderModule,
  AppFooterModule,
  AppSidebarModule,
} from '@coreui/angular';

// Import routing module
import { AppRoutingModule } from './app.routing';

// Import 3rd party components
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ChartsModule } from 'ng2-charts';
import { CommuneComponent } from './definition/commune/commune.component';
import { ArticleComponent } from './definition/article/article.component';
import { ValeursLocativesComponent } from './definition/valeurs-locatives/valeurs-locatives.component';
import { CorrespondantsComponent } from './definition/correspondants/correspondants.component';
import { RegisseurComponent } from './definition/regisseur/regisseur.component';
import { TresorierCommunalComponent } from './definition/tresorier-communal/tresorier-communal.component';
import { FournisseursComponent } from './definition/fournisseurs/fournisseurs.component';
import { LocatairesComponent } from './definition/locataires/locataires.component';
import { InstitutionReversementComponent } from './definition/institution-reversement/institution-reversement.component';
import { ContratLocationComponent } from './saisie/contrat-location/contrat-location.component';
import { OperationCaisseComponent } from './saisie/operation-caisse/operation-caisse.component';
import { LivraisonComponent } from './saisie/livraison/livraison.component';
import { CommandeComponent } from './saisie/Approvisionnement/commande/commande.component';
import { ReceptionComponent } from './saisie/Approvisionnement/reception/reception.component';
import { DemandeApprovisionnementComponent } from './saisie/Approvisionnement/demande-approvisionnement/demande-approvisionnement.component';
import { BonApprovisionnementComponent } from './saisie/Approvisionnement/bon-approvisionnement/bon-approvisionnement.component';
import { PlacementComponent } from './saisie/Approvisionnement/placement/placement.component';
import { PointVenteComponent } from './saisie/Bilan/point-vente/point-vente.component';
import { ReversementComponent } from './saisie/Bilan/reversement/reversement.component';
import { RecollementComponent } from './saisie/Bilan/recollement/recollement.component';
import { IncinerationComponent } from './saisie/Bilan/incineration/incineration.component';
import { JournalCaisseComponent } from './rapport/operation-caisse/journal-caisse/journal-caisse.component';
import { BrouillardComponent } from './rapport/operation-caisse/brouillard/brouillard.component';
import { RecapPrestationComponent } from './rapport/operation-caisse/recap-prestation/recap-prestation.component';
import { RecapLivrableComponent } from './rapport/operation-caisse/recap-livrable/recap-livrable.component';
import { PointCaisseComponent } from './rapport/operation-caisse/point-caisse/point-caisse.component';
import { ListeValeurLocativeComponent } from './rapport/location/liste-valeur-locative/liste-valeur-locative.component';
import { ListeContratLocataireComponent } from './rapport/location/liste-contrat-locataire/liste-contrat-locataire.component';
import { ListeEcheanceNonPayesComponent } from './rapport/location/liste-echeance-non-payes/liste-echeance-non-payes.component';
import { EtatStockComponent } from './rapport/stock/etat-stock/etat-stock.component';
import { JournalOperationComponent } from './rapport/stock/journal-operation/journal-operation.component';
import { ListePointCaisseComponent } from './rapport/correspondants/liste-point-caisse/liste-point-caisse.component';
import { ListeImputationComponent } from './rapport/correspondants/liste-imputation/liste-imputation.component';
import { StatistiqueComponent } from './statistique/statistique.component';
import { ComptabiliteComponent } from './comptabilite/comptabilite.component';
import { AideComponent } from './aide/aide.component';
import { ExerciceComponent } from './exercice/exercice.component';
import { SiCaveauTresorComponent } from './si-caveau-tresor/si-caveau-tresor.component';
import { CaisseComponent } from './caisse/caisse.component';
import { UtilisateursComponent } from './utilisateurs/utilisateurs.component';
import { AssocierUtilisateurComponent } from './associer-utilisateur/associer-utilisateur.component';
import { GestionDroitsGroupesComponent } from './gestion-droits-groupes/gestion-droits-groupes.component';
import { SauvegardeComponent } from './sauvegarde/sauvegarde.component';
import { ImportationExportationComponent } from './importation-exportation/importation-exportation.component';
import { AccueilComponent } from './accueil/accueil.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { AutheComponent } from './authe/authe.component';
import { InventaireStockComponent } from './saisie/Bilan/inventaire-stock/inventaire-stock.component';
import { ToastrModule } from 'ngx-toastr';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AppAsideModule,
    AppBreadcrumbModule.forRoot(),
    AppFooterModule,
    AppHeaderModule,
    AppSidebarModule,
    PerfectScrollbarModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    ChartsModule,
    FormsModule,
    ModalModule.forRoot(),
    DataTablesModule,
    HttpClientModule,
    ReactiveFormsModule,
    ToastrModule.forRoot(),
    
  ],
  declarations: [
    AppComponent,
    ...APP_CONTAINERS,
    P404Component,
    P500Component,
    LoginComponent,
    RegisterComponent,
    CommuneComponent,
    ArticleComponent,
    ValeursLocativesComponent,
    CorrespondantsComponent,
    RegisseurComponent,
    TresorierCommunalComponent,
    FournisseursComponent,
    LocatairesComponent,
    InstitutionReversementComponent,
    ContratLocationComponent,
    OperationCaisseComponent,
    LivraisonComponent,
    CommandeComponent,
    ReceptionComponent,
    DemandeApprovisionnementComponent,
    BonApprovisionnementComponent,
    PlacementComponent,
    PointVenteComponent,
    ReversementComponent,
    RecollementComponent,
    IncinerationComponent,
    JournalCaisseComponent,
    BrouillardComponent,
    RecapPrestationComponent,
    RecapLivrableComponent,
    PointCaisseComponent,
    ListeValeurLocativeComponent,
    ListeContratLocataireComponent,
    ListeEcheanceNonPayesComponent,
    EtatStockComponent,
    JournalOperationComponent,
    ListePointCaisseComponent,
    ListeImputationComponent,
    StatistiqueComponent,
    ComptabiliteComponent,
    AideComponent,
    ExerciceComponent,
    SiCaveauTresorComponent,
    CaisseComponent,
    UtilisateursComponent,
    AssocierUtilisateurComponent,
    GestionDroitsGroupesComponent,
    SauvegardeComponent,
    ImportationExportationComponent,
    AccueilComponent,
    ForgotPasswordComponent,
    AutheComponent,
    InventaireStockComponent,
  ],
  providers: [{
    provide: LocationStrategy,
    useClass: HashLocationStrategy
  }],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
