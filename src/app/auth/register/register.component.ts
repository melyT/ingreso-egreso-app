import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

import { Store } from '@ngrx/store';
import { AppState } from '../../app.reducer';
import { Subscription } from 'rxjs';
import { isLoading, stopLoading } from '../../shared/ui.actions';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [
  ]
})
export class RegisterComponent implements OnInit, OnDestroy {

  registroForm: FormGroup;

  cargando = false;

  uiSub$: Subscription;
  
  constructor( private fb: FormBuilder,
              private authService: AuthService,
              private router: Router,
              private store: Store<AppState>) { }

  ngOnInit(): void {

    this.registroForm = this.fb.group({
      nombre: ['', Validators.required],
      correo: ['', [ Validators.required, Validators.email ] ],
      password: ['', Validators.required],
    });

    this.uiSub$ = this.store.select('ui')
      .subscribe( ui => this.cargando = ui.isLoading );
  }

  ngOnDestroy(): void {
    this.uiSub$.unsubscribe();
  }


  crearUsuario(){
    
    if ( this.registroForm.invalid ) { return; }

    this.store.dispatch( isLoading() );
    
    // Swal.fire({
    //   title: 'Cargando...',
    //   didOpen: () => {
    //     Swal.showLoading()
    //   }
    // });

    const { nombre, correo, password } = this.registroForm.value;
    this.authService.crearUsuario(nombre, correo, password)
      .then( credenciales => {
        console.log(credenciales);
        // Swal.close();
        this.store.dispatch( stopLoading() );
        this.router.navigate(['/']);
      } )
      .catch( error => {
        this.store.dispatch( stopLoading() );
        
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: error.message,
        })
      });
    
  }

}
