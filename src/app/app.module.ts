import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputAlertComponent } from './input-alert/input-alert.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HomeComponent } from './home/home.component';
import { JwtInterceptor } from './_interceptors/jwt.interceptor';
import { BookComponent } from './book/book.component';
import { ShiftApprovalComponent } from './shift-approval/shift-approval.component';
import { BookcusComponent } from './bookcus/bookcus.component';
import { ReserveComponent } from './reserve/reserve.component';
import { ReserveComfirmComponent } from './reserve-comfirm/reserve-comfirm.component';
import { StaffReserchComponent } from './staff-reserch/staff-reserch.component';
import { Test2Component } from './test2/test2.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    InputAlertComponent,
    HomeComponent,
    BookComponent,
    ShiftApprovalComponent,
    BookcusComponent,
    ReserveComponent,
    ReserveComfirmComponent,
    StaffReserchComponent,
    Test2Component,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
