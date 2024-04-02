import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChargersComponent, LoginComponent, RegisterComponent, UsersComponent, VehiclesComponent } from './views';
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
        path: 'vehicles',
        component: VehiclesComponent,
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
