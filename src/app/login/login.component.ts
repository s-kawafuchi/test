import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) { }

  get email() {
    return <FormControl>this.form.get('email');
  }
  get passwd() {
    return <FormControl>this.form.get('passwd');
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      // email: new FormControl("test@test.test", [Validators.email, Validators.required]),
      // password: new FormControl("1234", [Validators.required]),
      email: new FormControl("", [Validators.email, Validators.required]),
      password: new FormControl("", [Validators.required]),
    });
  }

  login() {
    this.authService.login(this.form.value).subscribe(is_successed => {
      if (is_successed) {
        this.router.navigate(['/home']);
      } else {
        alert('ログインに失敗しました。');
      }
    });
  }
}
