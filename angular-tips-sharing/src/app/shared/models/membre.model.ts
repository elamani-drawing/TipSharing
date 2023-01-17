export interface Membre {
  id: number,
  email: string,
  pseudo: string,
  isAdmin: boolean,
  firstName: string,
  picture: string,
  lastName: string,
  isActif: boolean,
  createdAt: Date,
  updatedAt: Date,
}