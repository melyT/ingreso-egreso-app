import { Component, OnInit } from '@angular/core';
import { AppState } from 'src/app/app.reducer';
import { Store } from '@ngrx/store';
import { IngresoEgreso } from 'src/app/models/ingreso-egreso.model';

import { ChartType } from 'chart.js';
import { MultiDataSet, Label } from 'ng2-charts';

@Component({
  selector: 'app-estadistica',
  templateUrl: './estadistica.component.html',
  styles: [
  ]
})
export class EstadisticaComponent implements OnInit {


   // Doughnut
   public doughnutChartLabels: Label[] = ['Ingresos', 'Egresos'];
   public doughnutChartData: MultiDataSet = [ [] ];
   

  constructor( private store: Store<AppState>) { }

  ingresos = 0;
  egresos = 0;

  totalIngresos = 0;
  totalEgresos = 0;

  ngOnInit(): void {
    this.store.select('ingresosEgresos')
      .subscribe(({items}) => this.generarEstadistica( items ));
  }

  generarEstadistica( items: IngresoEgreso[] ){
    this.totalEgresos = 0;
    this.egresos = 0;

    this.ingresos = 0;
    this.totalIngresos = 0;

    for ( const item of items ) {
      if ( item.tipo === 'ingreso' ) {
          this.totalIngresos += item.monto;
          this.ingresos ++;
      } else {
        this.totalEgresos += item.monto;
        this.egresos ++;
      }
    }

    this.doughnutChartData = [ [ this.totalIngresos, this.totalEgresos] ];
  
  }

}
