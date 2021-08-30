import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { AppState } from 'src/app/app.reducer';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [
  ]
})
export class SidebarComponent implements OnInit, OnDestroy {
  nombre = '';
  userSub$: Subscription;

  constructor( private authService: AuthService,
                private router: Router,
                private store: Store<AppState>) { }

  ngOnInit(): void {
    this.userSub$ =  this.store.select('user')
      .pipe(
        filter ( ({user}) => user !== null )
      )
      .subscribe( ({user}) => this.nombre = user.nombre );
  }

  ngOnDestroy(): void {
    this.userSub$.unsubscribe();
  }

  logout(){
    Swal.fire({
      title: 'Cerrando sesión ...',
      didOpen: () => {
        Swal.showLoading()
      }
    });
    
    this.authService.logOut()
      .then( () => {
        Swal.close();
        this.router.navigate(['/login']);
      });
  }

}
