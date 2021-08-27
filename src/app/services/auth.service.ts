import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Usuario } from '../models/usuario.model';

import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import * as actions from '../auth/auth.actions';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userSub$: Subscription;

  constructor( private auth: AngularFireAuth,
                private firestore: AngularFirestore,
                private store: Store<AppState>) { }

  initAuthListener(){

    this.auth.authState.subscribe( fuser => {
      console.log(fuser);
      if ( fuser ){
        // existe
        this.userSub$ = this.firestore.doc(`${ fuser.uid }/usuario`).valueChanges()
            .subscribe( (fireUser: any) => {
              const user = Usuario.fromFirebase( fireUser );
              this.store.dispatch( actions.setUser({ user }) );
            });

      } else {
        // no existe
        this.userSub$.unsubscribe();
        this.store.dispatch( actions.unSetUser() );
      }
      
    });
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
