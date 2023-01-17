import { Membre } from "src/app/shared/models/membre.model";

export interface Commentaire {
    id : number ,
    comment : string ,
    createdAt: Date,
    updatedAt: Date,
    User: Membre, 
    TipId : number
}