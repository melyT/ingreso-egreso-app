import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [
  ]
})
export class SidebarComponent implements OnInit {

  constructor( private authService: AuthService,
      private router: Router) { }

  ngOnInit(): void {
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
