export interface Administrateur {
    id: number,
    email: string,
    pseudo: string,
    isAdmin: boolean,
    firstName: string,
    picture: string,
    lastName: string,
    createdAt: Date,
    updatedAt: Date
}