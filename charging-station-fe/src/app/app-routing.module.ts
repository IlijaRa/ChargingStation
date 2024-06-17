import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppointmentsComponent, ChargersComponent, ChargingHistoriesComponent, LoginComponent, RegisterComponent, UnconfirmedUsersComponent, UsersComponent, UserVehiclesComponent, VehiclesComponent } from './views';
import { HeaderLayoutComponent } from './layouts';
import { AuthGuard } from './core';
import { ScheduleChargerComponent } from './views/schedule-charger/schedule-charger.component';

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
        path: 'schedule-charger',
        component: ScheduleChargerComponent,
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
        path: 'user-vehicles',
        component: UserVehiclesComponent,
      },
      {
        path: 'unconfirmed-users',
        component: UnconfirmedUsersComponent,
      },
      {
        path: 'charging-history',
        component: ChargingHistoriesComponent,
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
