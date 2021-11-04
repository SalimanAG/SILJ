import { INavData } from "@coreui/angular";
import { Localisation } from "../comptabilite/localisation.model";

export class ComptaHabilitation{
    static navIdata: INavData[]=[
        {
            title: true,
            name: 'UTILISATION'
        },
        {
            name: 'Comptabilité',
            url:'/base',
            icon:'icon-speedometer',
            children:[
                {
                    name:'Définition',
                    url:'/base',
                    children:[
                        {
                            name:'Compte',
                            url:'/cpte',
                            icon: 'icon-puzzle'
                        },
                        {
                            name:'Journaux',
                            url:'/jCompta',
                            icon: 'icon-puzzle'
                        },
                        {
                            name:'Localisation',
                            url:'/localisation',
                            icon: 'icon-puzzle'
                        },
                        {
                            name:'Immobilisation',
                            url:'/immo',
                            icon: 'icon-puzzle'
                        },
                        {
                            name:'Nature budgétaire',
                            url:'/natBud',
                            icon: 'icon-puzzle'
                        }
                    ]
                },
                {
                    name:'Saisie',
                    url:'/base',
                    children:[
                        {
                            name: 'Ecriture',
                            url: 'ecriture'
                        }
                    ]
                }
            ]
        }
    ]
}