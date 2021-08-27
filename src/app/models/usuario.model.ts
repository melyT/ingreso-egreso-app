export class Usuario {


    static fromFirebase( {nombre, uid, email}) {
        return new Usuario(uid, nombre, email);
    }

    constructor(
        public uid: string,
        public nombre: string,
        public email: string
    ){}
}