import { Injector, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppointmentsComponent, ChargersComponent, LoginComponent, RegisterComponent, UnconfirmedUsersComponent, UserAddEditComponent, UsersComponent, VehicleAddEditComponent, VehiclesComponent } from './views';
import { FooterLayoutComponent, HeaderLayoutComponent, MainLayoutComponent } from './layouts';
import { AppInjector, AppInterceptor, AppointmentsService, AppValuePipe, AuthGuard, AuthsService, ChargersService, RoleGuard, TruncatePipe, UsersService, VehiclesService } from './core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { ChargerAddEditComponent } from './views/chargers/charger-add-edit/charger-add-edit.component';
import { AppointmentAddComponent } from './views/appointments/appointment-add/appointment-add.component';

@NgModule({
  declarations: [
    AppValuePipe,
    TruncatePipe,
    
    AppComponent,
    
    LoginComponent,
    RegisterComponent,
    UsersComponent,
    UserAddEditComponent,
    UnconfirmedUsersComponent,
    ChargersComponent,
    VehiclesComponent,
    VehicleAddEditComponent,
    AppointmentsComponent,

    HeaderLayoutComponent,
    MainLayoutComponent,
    FooterLayoutComponent,
    ChargerAddEditComponent,
    AppointmentAddComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatSelectModule,
    MatToolbarModule,
    MatSidenavModule,
    MatMenuModule,
    MatListModule,
    MatTableModule,
    MatSlideToggleModule,
    MatTabsModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AppInterceptor,
      multi: true
    },
    AuthGuard,
    RoleGuard,
    AuthsService,
    UsersService,
    ChargersService,
    VehiclesService,
    AppointmentsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule 
{ 
  constructor(private injector: Injector) {
    AppInjector.instance = this.injector;
  }
}
