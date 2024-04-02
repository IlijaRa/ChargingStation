import { HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { catchError, EMPTY, finalize, throwError } from "rxjs";
// import { Notifications } from "../shared";
// import { Spinner } from "./components/spinner/spinner.service";
import { Auth } from "./security";

@Injectable()
export class AppInterceptor implements HttpInterceptor {

    constructor(/* private spinner: Spinner,*/ private router: Router) { }

    intercept(req: HttpRequest<any>, next: HttpHandler) {

        // this.spinner.show();

        let token = Auth.getToken();

        if (token) {
            req = req.clone({
                setHeaders: { Authorization: `Bearer ${token}`}
            });
        }
        
        return next.handle(req).pipe(
            catchError((error: HttpErrorResponse) => {

                if (error.status == 400) {
                    return throwError(() => { return error.error });
                } else if (error.status == 401) {
                    this.router.navigate(['/login']);
                } else if (error.status == 403) {
                    this.router.navigate(['/forbidden'])
                } else if (error.status >= 500) {
                    // Notifications.showError('Ups... Something went wrong, please contact your support');
                }

                return EMPTY;
            }),
            finalize(() => {
                // this.spinner.hide();
            })
        );
    }
}