import { Component, OnDestroy, OnInit } from '@angular/core';
import { AppState } from '../app.reducer';
import { Store } from '@ngrx/store';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { IngresoEgresoService } from '../services/ingreso-egreso.service';
import * as ingresosEgresosActions from '../ingreso-egreso/ingreso-egreso.actions';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: [
  ]
})
export class DashboardComponent implements OnInit, OnDestroy {

  userSub$: Subscription;
  ingresosSub$: Subscription;

  constructor( private store: Store<AppState>,
              private ingresoEgresoService: IngresoEgresoService) { } 

  ngOnInit(): void {
    this.userSub$ = this.store.select('user')
      .pipe(
        filter( auth => auth.user !== null)
      )
      .subscribe( ({ user }) => {
        console.log(user);

       this.ingresosSub$ =  this.ingresoEgresoService.initIngresosEgresosListener( user.uid )
            .subscribe( ingresosEgresosFb => {
              this.store.dispatch( ingresosEgresosActions.setItems({ items: ingresosEgresosFb}) )             
            });
      }
      )
  }

  ngOnDestroy(): void {
    this.ingresosSub$.unsubscribe();
    this.userSub$.unsubscribe();
  }

}
