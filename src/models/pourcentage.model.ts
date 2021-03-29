import { Article } from "./article.model";
import { InstituReverse } from "./institution.model";

export class Pourcentage{
  idPourcenRevers: number;
  constructor(public valPourcenRevers:number, public instituReverse: InstituReverse, public article: Article){}
}
