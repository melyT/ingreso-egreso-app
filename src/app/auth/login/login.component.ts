import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';

import { AppState } from '../../app.reducer';
import { Store } from '@ngrx/store';
import { isLoading, stopLoading } from '../../shared/ui.actions';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
  ]
})
export class LoginComponent implements OnInit, OnDestroy {

  loginForm: FormGroup;

  cargando = false;

  uiSub$: Subscription;

  constructor( private fb: FormBuilder,
                private authService: AuthService,
                private router: Router,
                private store: Store<AppState> ) { }


  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [ Validators.required, Validators.email ]],
      pass: ['', Validators.required]
    });

    this.uiSub$ = this.store.select('ui')
      .subscribe( ui => this.cargando = ui.isLoading );
  }

  ngOnDestroy(): void {
    this.uiSub$.unsubscribe();
  }

  login(){
    if( this.loginForm.invalid ) { return; }

    this.store.dispatch( isLoading() );

    // Swal.fire({
    //   title: 'Cargando...',
    //   didOpen: () => {
    //     Swal.showLoading()
    //   }
    // });

    const { email, pass } = this.loginForm.value;
    this.authService.logInUsuario( email, pass )
      .then( data => {
        console.log(data);
        // Swal.close();
        this.store.dispatch( stopLoading() );
        this.router.navigate(['/']);
      })
      .catch( err => {        
        this.store.dispatch( stopLoading() );

        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: err.message,
        })
      });
  }

}
