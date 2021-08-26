import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor( private auth: AngularFireAuth,
                private firestore: AngularFirestore) { }

  initAuthListener(){

    this.auth.authState.subscribe( fuser => {
      console.log(fuser);
      
    })
  }

  crearUsuario( nombre: string, email: string, pass: string){
    return this.auth.createUserWithEmailAndPassword(email, pass)
              .then( ({ user }) => {
                const newUser = new Usuario( user.uid, nombre, email );

               return this.firestore.doc(`${ user.uid }/usuario`).set( {...newUser} );
              });  
  }

  logInUsuario( email: string, pass: string ) {
    return this.auth.signInWithEmailAndPassword( email, pass);
  }

  logOut(){
    return this.auth.signOut();
  }

  isAuth(){
    return this.auth.authState.pipe(
      map( fuser => fuser !== null )
    );
  }
}
