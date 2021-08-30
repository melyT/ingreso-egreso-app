import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Usuario } from '../models/usuario.model';

import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import * as actions from '../auth/auth.actions';
import { Subscription } from 'rxjs';

import * as ingresosEgresosActions from '../ingreso-egreso/ingreso-egreso.actions';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userSub$: Subscription;
  private _user: Usuario;

  constructor( private auth: AngularFireAuth,
                private firestore: AngularFirestore,
                private store: Store<AppState>) { }

  get user(){
    return this._user;
  }

  initAuthListener(){

    this.auth.authState.subscribe( fuser => {
      if ( fuser ){
        // existe
        this.userSub$ = this.firestore.doc(`${ fuser.uid }/usuario`).valueChanges()
            .subscribe( (fireUser: any) => {
              const user = Usuario.fromFirebase( fireUser );
              this._user = user;
              this.store.dispatch( actions.setUser({ user }) );
            });

      } else {
        // no existe
        this._user = null;
        this.userSub$?.unsubscribe();
        this.store.dispatch( actions.unSetUser() );
        this.store.dispatch( ingresosEgresosActions.unSetItems() );
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
