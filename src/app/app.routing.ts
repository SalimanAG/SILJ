import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Import Containers
import { DefaultLayoutComponent } from './containers';

import { P404Component } from './views/error/404.component';
import { P500Component } from './views/error/500.component';
import { LoginComponent } from './views/login/login.component';
import { RegisterComponent } from './views/register/register.component';
import { CommuneComponent } from './definition/commune/commune.component';
import { AutheComponent } from './authe/authe.component';
import { AccueilComponent } from './accueil/accueil.component';
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
import { AideComponent } from './aide/aide.component';
import { ExerciceComponent } from './exercice/exercice.component';
import { SiCaveauTresorComponent } from './si-caveau-tresor/si-caveau-tresor.component';
import { CaisseComponent } from './caisse/caisse.component';
import { UtilisateursComponent } from './utilisateurs/utilisateurs.component';
import { AssocierUtilisateurComponent } from './associer-utilisateur/associer-utilisateur.component';
import { GestionDroitsGroupesComponent } from './gestion-droits-groupes/gestion-droits-groupes.component';
import { SauvegardeComponent } from './sauvegarde/sauvegarde.component';
import { ImportationExportationComponent } from './importation-exportation/importation-exportation.component';
import { PlacementComponent } from './saisie/Approvisionnement/placement/placement.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { AuthGuardService } from '../services/administration/auth-guard.service';
import { InventaireStockComponent } from './saisie/Bilan/inventaire-stock/inventaire-stock.component';
import { TypeModeComponent } from './type-mode/type-mode.component';
import { SignataireComponent } from './signataire/signataire.component';
import { NatureBudgetComponent } from './comptabilite/definition/nature-budget/nature-budget.component';
import { LocalisationComponent } from './comptabilite/definition/localisation/localisation.component';
import { JournalComponent } from './comptabilite/definition/journal/journal.component';
import { ImmobComponent } from './comptabilite/definition/immob/immob.component';
import { CompteComponent } from './comptabilite/definition/compte/compte.component';
import { EcritureComponent } from './comptabilite/Saisie/ecriture/ecriture.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    component: AutheComponent,
  },

  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
  },

  {
    path: '404',
    component: P404Component,
    data: {
      title: 'Page 404'
    }
  },
  {
    path: '500',
    component: P500Component,
    data: {
      title: 'Page 500'
    }
  },
  {
    path: 'login',
    component: LoginComponent,
    data: {
      title: 'Login Page'
    }
  },
  {
    path: 'register',
    component: RegisterComponent,
    data: {
      title: 'Register Page'
    }
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    data: {
      title: 'Home'
    },
    canActivate:[AuthGuardService],
    children: [

      {
        path: 'accueil',
        component: AccueilComponent
      },

      {
        path: 'commune',
        component: CommuneComponent
      },

      {
        path: 'article',
        component: ArticleComponent
      },

      {
        path: 'valeurs-locatives',
        component: ValeursLocativesComponent
      },

      {
        path: 'corresp',
        component: CorrespondantsComponent
      },

      {
        path: 'reg',
        component: RegisseurComponent
      },

      {
        path: 'tres-communal',
        component: TresorierCommunalComponent
      },

      {
        path: 'four',
        component: FournisseursComponent
      },

      {
        path: 'locat',
        component: LocatairesComponent
      },

      {
        path: 'inst-revers',
        component: InstitutionReversementComponent
      },

      {
        path: 'contrat-loc',
        component: ContratLocationComponent
      },

      {
        path: 'op-caisse',
        component: OperationCaisseComponent
      },

      {
        path: 'livraison',
        component: LivraisonComponent
      },

      {
        path: 'appro-commande',
        component: CommandeComponent
      },

      {
        path: 'appro-reception',
        component: ReceptionComponent
      },

      {
        path: 'appro-demande-appro',
        component: DemandeApprovisionnementComponent
      },

      {
        path: 'appro-bon-appro',
        component: BonApprovisionnementComponent
      },

      {
        path: 'appro-placement',
        component: PlacementComponent
      },

      {
        path: 'bilan-point-vente',
        component: PointVenteComponent
      },

      {
        path: 'bilan-reverse',
        component: ReversementComponent
      },

      {
        path: 'bilan-recoll',
        component: RecollementComponent
      },

      {
        path: 'bilan-incine',
        component: IncinerationComponent
      },

      {
        path:'inventaire-stock',
        component: InventaireStockComponent
      },

      {
        path: 'rapport-opcaisse-journalCaise',
        component: JournalCaisseComponent
      },

      {
        path: 'rapport-opcaisse-brouillard',
        component: BrouillardComponent
      },

      {
        path: 'rapport-opcaisse-recapPrestation',
        component: RecapPrestationComponent
      },

      {
        path: 'rapport-opcaisse-recapLivrable',
        component: RecapLivrableComponent
      },

      {
        path: 'rapport-opcaisse-pointCaisse',
        component: PointCaisseComponent
      },

      {
        path: 'rapport-loc-listValLocative',
        component: ListeValeurLocativeComponent
      },

      {
        path: 'rapport-loc-listContPrest',
        component: ListeContratLocataireComponent
      },

      {
        path: 'rapport-loc-listechNp',
        component: ListeEcheanceNonPayesComponent
      },

      {
        path: 'rapport-stock-etaStock',
        component: EtatStockComponent
      },

      {
        path: 'rapport-stock-jourOperat',
        component: JournalOperationComponent
      },

      {
        path: 'rapport-corres-pointCaisse',
        component: ListePointCaisseComponent
      },

      {
        path: 'rapport-corres-impu',
        component: ListeImputationComponent
      },

      {
        path: 'statistique',
        component: StatistiqueComponent
      },

      /*{
        path: 'comptabilite',
        component: ComptabiliteComponent
      },*/

      {
        path: 'jCompta',
        component: JournalComponent
      },

      {
        path: 'journal',
        component: JournalCaisseComponent
      },

      {
        path: 'natBud',
        component: NatureBudgetComponent
      },

      {
        path: 'immo',
        component: ImmobComponent
      },

      {
        path: 'compte',
        component: CompteComponent
      },

      {
        path: 'localisation',
        component: LocalisationComponent
      },

      {
        path: 'aide',
        component: AideComponent
      },

      {
        path: 'ecriture',
        component: EcritureComponent
      },

      {
        path: 'exo',
        component: ExerciceComponent
      },

      {
        path: 'si-CavTres',
        component: SiCaveauTresorComponent
      },

      {
        path: 'caisse',
        component: CaisseComponent
      },

      {
        path: 'user',
        component: UtilisateursComponent
      },

      {
        path: 'associer-user',
        component: AssocierUtilisateurComponent
      },

      {
        path: 'droit-groupe',
        component: GestionDroitsGroupesComponent
      },

      {
        path: 'sauvegarde',
        component: SauvegardeComponent
      },

      {
        path: 'import-Export',
        component: ImportationExportationComponent
      },

      {
        path: 'mod-pay',
        component: TypeModeComponent
      },
      {
        path: 'signataire',
        component: SignataireComponent
      },

      {
        path: 'base',
        loadChildren: () => import('./views/base/base.module').then(m => m.BaseModule)
      },
      {
        path: 'buttons',
        loadChildren: () => import('./views/buttons/buttons.module').then(m => m.ButtonsModule)
      },
      {
        path: 'charts',
        loadChildren: () => import('./views/chartjs/chartjs.module').then(m => m.ChartJSModule)
      },
      {
        path: 'dashboard',
        loadChildren: () => import('./views/dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      {
        path: 'icons',
        loadChildren: () => import('./views/icons/icons.module').then(m => m.IconsModule)
      },
      {
        path: 'notifications',
        loadChildren: () => import('./views/notifications/notifications.module').then(m => m.NotificationsModule)
      },
      {
        path: 'theme',
        loadChildren: () => import('./views/theme/theme.module').then(m => m.ThemeModule)
      },
      {
        path: 'widgets',
        loadChildren: () => import('./views/widgets/widgets.module').then(m => m.WidgetsModule)
      }

    ]
  },
  { path: '**', component: P404Component }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
