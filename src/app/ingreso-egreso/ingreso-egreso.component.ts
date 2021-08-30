import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IngresoEgreso } from '../models/ingreso-egreso.model';
import { IngresoEgresoService } from '../services/ingreso-egreso.service';
import Swal from 'sweetalert2';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import { Subscription } from 'rxjs';
import { isLoading, stopLoading } from '../shared/ui.actions';

@Component({
  selector: 'app-ingreso-egreso',
  templateUrl: './ingreso-egreso.component.html',
  styles: [
  ]
})
export class IngresoEgresoComponent implements OnInit, OnDestroy {

  ingresoForm: FormGroup;

  tipo: string = 'ingreso';

  cargando = false;

  uiSub$: Subscription;
  
  constructor( private fb: FormBuilder,
              private ingresoEgresoService: IngresoEgresoService,
              private store: Store<AppState>) { }

  ngOnInit(): void {
    this.ingresoForm = this.fb.group({
      descripcion: ['', Validators.required],
      monto: ['', Validators.required],
    });

    this.uiSub$ = this.store.select('ui')
      .subscribe( ui => this.cargando = ui.isLoading );
  }

  ngOnDestroy(): void {
    this.uiSub$.unsubscribe();
  }

  guardar(){

    this.store.dispatch( isLoading() );

    if ( this.ingresoForm.invalid ) { return;}
   
    const { descripcion, monto } = this.ingresoForm.value;

    const ingresoEgreso = new IngresoEgreso( descripcion, monto, this.tipo );

    this.ingresoEgresoService.crearIngresoEgreso( ingresoEgreso )
          .then( () => {
            this.ingresoForm.reset('');
            this.store.dispatch( stopLoading() );
            Swal.fire('Registro creado', descripcion, 'success');
          })
          .catch( err => {
            this.store.dispatch( stopLoading() );
            Swal.fire('Error', err.message, 'error')
          });
  }

}
