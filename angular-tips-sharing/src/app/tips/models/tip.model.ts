import { Membre } from "src/app/shared/models/membre.model";

export interface Tip {
  id: number,
  title: string,
  picture: string,
  astuce: string,
  isValidate: boolean,
  createdAt: Date,
  updatedAt: Date,
  User: Membre
}