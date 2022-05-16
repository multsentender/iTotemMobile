import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  constructor(
    private http: HttpClient,
    private router: Router) { }

  ngOnInit(): void {
  }

  logOut(): void {
    this.http.post<any>(environment.rootUrl.concat('logout'), {}).subscribe()
    this.router.navigateByUrl('/login')
  }
}
