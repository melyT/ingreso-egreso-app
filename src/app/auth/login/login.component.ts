import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
  ]
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  constructor( private fb: FormBuilder,
                private authService: AuthService,
                private router: Router ) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [ Validators.required, Validators.email ]],
      pass: ['', Validators.required]
    })
  }

  login(){
    console.log(this.loginForm.valid);
    console.log(this.loginForm.value);
    
    if( this.loginForm.invalid ) { return; }

    Swal.fire({
      title: 'Cargando...',
      didOpen: () => {
        Swal.showLoading()
      }
    });

    const { email, pass } = this.loginForm.value;
    this.authService.logInUsuario( email, pass )
      .then( data => {
        console.log(data);
        Swal.close();
        this.router.navigate(['/']);
      })
      .catch( err => {        
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: err.message,
        })
      });
  }

}
