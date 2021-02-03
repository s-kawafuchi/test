import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './_guards/auth.guard';
import { LoginGuard } from './_guards/login.guard';
import { BookComponent } from './book/book.component';
import { ShiftApprovalComponent } from './shift-approval/shift-approval.component';
import { BookcusComponent } from './bookcus/bookcus.component';
import { ReserveComponent } from './reserve/reserve.component';
import { ReserveComfirmComponent } from './reserve-comfirm/reserve-comfirm.component';
import { Test2Component } from './test2/test2.component';

const routes: Routes = [
  {
    path: 'test',
    component: Test2Component,
  },
  {
    path: 'reservecomfirm',
    component: ReserveComfirmComponent,
  },
  {
    path: 'reserve',
    component: ReserveComponent,
  },
  {
    path: 'book',
    component: BookcusComponent,
  },
  {
    path: 'approval',
    component: ShiftApprovalComponent,
  },
  {
    path: 'calender',
    component: BookComponent,
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [LoginGuard],
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
