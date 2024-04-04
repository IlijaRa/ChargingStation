import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppointmentsComponent, ChargersComponent, LoginComponent, RegisterComponent, UnconfirmedUsersComponent, UsersComponent, VehiclesComponent } from './views';
import { HeaderLayoutComponent } from './layouts';
import { AuthGuard } from './core';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: '',
    component: HeaderLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'users',
        component: UsersComponent,
      },
      {
        path: 'chargers',
        component: ChargersComponent,
      },
      {
        path: 'chargers/appointments/:id',
        component: AppointmentsComponent,
      },
      {
        path: 'vehicles',
        component: VehiclesComponent,
      },
      {
        path: 'unconfirmed-users',
        component: UnconfirmedUsersComponent,
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
