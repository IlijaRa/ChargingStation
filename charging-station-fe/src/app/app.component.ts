import { Component, HostListener } from '@angular/core';
import { Auth } from './core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'charging-station-fe';

  constructor(private router: Router) 
  {
    this.checkInactivityTimeout();
  }

  private timeoutId: any;

  @HostListener('window:keydown')
  @HostListener('window:mousemove')
  @HostListener('window:mousedown')
  checkUserActivity() {
    this.checkInactivityTimeout();
  }

  private checkInactivityTimeout() {

    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    this.timeoutId = setTimeout(() => {
      this.signOut();
    }, environment.inactivityLogoutInMinutes * 60 * 1000);
  }

  private signOut() {
    Auth.signOut();
    this.router.navigate(['/login']);
  }
}
