import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Auth } from "src/app/core";

@Component({
    selector: 'header-layout',
    templateUrl: './header-layout.component.html',
    styleUrls: ['./header-layout.component.css']
})
export class HeaderLayoutComponent implements OnInit{
    auth = Auth;

    constructor(private router: Router) { }
  
    ngOnInit(): void {
      if (this.router.url == '/') {
        if (Auth.authorized['admin']) {
          this.router.navigate(['/users']);
        } else if (Auth.authorized['driver']) {
          this.router.navigate(['/driver-map']); //TODO:
        }
      }
    }
  
    signOut() {
      Auth.signOut();
      this.router.navigate(['/login']);
    }
}