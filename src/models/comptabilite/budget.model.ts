import { Exercice } from "../exercice.model";
import { TypeBudget } from "./typebudget.model";

export class Budget{
    constructor(public idBdg:Number, public exo:Exercice, public typBudg:TypeBudget){}
 }