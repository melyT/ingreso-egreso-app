import { Component, OnDestroy, OnInit } from '@angular/core';
import { IngresoEgreso } from 'src/app/models/ingreso-egreso.model';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.reducer';
import { Subscription } from 'rxjs';
import { IngresoEgresoService } from '../../services/ingreso-egreso.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styles: [
  ]
})
export class DetalleComponent implements OnInit, OnDestroy {

  ingresosEgresos: IngresoEgreso[] = [];
  ingresosSub$: Subscription;

  constructor( private store: Store<AppState>,
              private ingresoEgresoService: IngresoEgresoService) { }
  

  ngOnInit(): void {

    this.ingresosSub$ = this.store.select('ingresosEgresos')
      .subscribe( ({items}) => (this.ingresosEgresos = [...items]) );
  }

  ngOnDestroy(): void {
    this.ingresosSub$.unsubscribe();
  }

  borrar( uid: string){
    console.log(uid);
    this.ingresoEgresoService.borrarItem( uid )
      .then( () => Swal.fire('Borrado', 'Item borrado' ,'success') )
      .catch( err => Swal.fire( 'Error', err.message, 'error') );
  }

}
