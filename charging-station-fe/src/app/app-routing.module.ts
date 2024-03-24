import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChargersComponent, LandingComponent, LoginComponent, RegisterComponent, UsersComponent, VehiclesComponent } from './views';

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
    path: 'users',
    component: UsersComponent,
  },
  {
    path: 'chargers',
    component: ChargersComponent,
  },
  {
    path: 'vehicles',
    component: VehiclesComponent,
  },
  {
    path: '',
    component: LandingComponent,
    children: [
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
