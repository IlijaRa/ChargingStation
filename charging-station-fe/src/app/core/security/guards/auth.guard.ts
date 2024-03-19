import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { Auth } from "../auth";

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(public router: Router) {}
  
  canActivate(): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
        Auth.fetchUser().then(() => {
            resolve(true);
        }).catch(() => {
            this.router.navigate(['/login']);
            resolve(false);
        })
    });
  }
}

export class RoleGuard {
  static forRoles(roles: string[]) {

    @Injectable({
      providedIn: 'root'
    })
    class RoleCheck implements CanActivate {

      constructor(private router: Router) { }

      canActivate(): boolean {
        let canActivate = false;

        if (roles) {
          roles.forEach((role: string) => {
            canActivate = canActivate || Auth.authorized[role];
          })
        }

        if (!canActivate) {
          this.router.navigate(['/forbidden']);
        }

        return canActivate;
      }
    }

    return RoleCheck;
  }
}