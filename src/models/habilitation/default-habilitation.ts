import { INavData } from '@coreui/angular';


export class DefaultHabilitation {
  static navIdata: INavData[] = [
      //Groupe utilisation
    {
        title: true,
        name: 'UTILISATION'
    },
    
    {
        name: 'Saisie',
        url: '/base',
        icon: 'icon-note',
        children: [
         /* {
            name: 'Contrat de location',
            url: '/contrat-loc',
            icon: 'icon-puzzle'
          },*/
          /*{
            name: 'Opération de caisse',
            url: '/op-caisse',
            icon: 'icon-puzzle'
          },*/
          /*{
            name: 'Livraisons',
            url: '/livraison',
            icon: 'icon-puzzle'
          },*/
         /* {
            name: 'Approvisionnement',
            url: '/base',
            icon: 'icon-puzzle',
            children: [
              {
                name: 'Commande',
                url: '/appro-commande',
                icon: 'icon-puzzle'
              },
              {
                name: 'Réception',
                url: '/appro-reception',
                icon: 'icon-puzzle'
              },
              {
                name: 'Demande appro ',
                url: '/appro-demande-appro',
                icon: 'icon-puzzle'
              },
              {
                name: 'Bon appro ',
                url: '/appro-bon-appro',
                icon: 'icon-puzzle'
              },
              {
                name: 'Placement',
                url: '/appro-placement',
                icon: 'icon-puzzle'
              }
            ]
          },*/
    
         /* {
              name: 'Bilan',
              url: '/base',
              icon: 'icon-puzzle',
              children: [
                {
                  name: 'Point de vente',
                  url: '/bilan-point-vente',
                  icon: 'icon-puzzle'
                },
                {
                  name: 'Reversements',
                  url: '/bilan-reverse',
                  icon: 'icon-puzzle'
                },
                {
                  name: 'Recollements ',
                  url: '/bilan-recoll',
                  icon: 'icon-puzzle'
                },
                {
                  name: 'Incinération',
                  url: '/bilan-incine',
                  icon: 'icon-puzzle'
                },
                {
                  name: 'Inventaire',
                  url: '/inventaire-stock',
                  icon: 'icon-puzzle'
                }
              ]
          },*/

           // debut rapport
  {
    name: 'Rapport',
    url: '/base',
    icon: 'icon-puzzle',
    children: [
      {
        name: 'Trésorerie',
        url: '/base',
        icon: 'icon-puzzle',
        children: [
          {
            name: 'Journal de caisse',
            url: '/rapport-opcaisse-journalCaise',
            icon: 'icon-puzzle'
          }/*,
          {
            name: 'Brouillard',
            url: '/rapport-opcaisse-brouillard',
            icon: 'icon-puzzle'
          }*/,
          {
            name: 'Récap des prestations',
            url: '/rapport-opcaisse-recapPrestation',
            icon: 'icon-puzzle'
          },
          {
            name: 'Récap des livrables ',
            url: '/rapport-opcaisse-recapLivrable',
            icon: 'icon-puzzle'
          },
          {
            name: 'Point de caisse',
            url: '/rapport-opcaisse-pointCaisse',
            icon: 'icon-puzzle'
          }
        ]
      },

       /* {
          name: 'Location',
          url: '/base',
          icon: 'icon-puzzle',
          children: [
            {
              name: 'Liste des vals locatives',
              url: '/rapport-loc-listValLocative',
              icon: 'icon-puzzle'
            },
            {
              name: 'Liste contrats / prestation',
              url: '/rapport-loc-listContPrest',
              icon: 'icon-puzzle'
            },
            {
              name: 'Liste des échéances non payés ',
              url: '/rapport-loc-listechNp',
              icon: 'icon-puzzle'
            }
          ]
        },*/

     /* {
        name: 'Stocks',
        url: '/base',
        icon: 'icon-puzzle',
        children: [
          {
            name: 'Etats des stocks',
            url: '/rapport-stock-etaStock',
            icon: 'icon-puzzle'
          },
          {
            name: 'Journal opération',
            url: '/rapport-stock-jourOperat',
            icon: 'icon-puzzle'
          },

        ]
      },*/
      /*{
        name: 'Correspondants',
        url: '/base',
        icon: 'icon-puzzle',
        children: [
          {
            name: 'Points de caisse',
            url: '/rapport-corres-pointCaisse',
            icon: 'icon-puzzle'
          },
          {
            name: 'Imputations',
            url: '/rapport-corres-impu',
            icon: 'icon-puzzle'
          }
        ]
     },*/

    ]
  },
  //fin rapport

    
    
        ]
      },
  ];
}
