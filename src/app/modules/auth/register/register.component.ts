import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {HttpResponse} from '@angular/common/http';
import {AuthService} from '../services/auth.service';
import {NotificationService} from '../../../shared/services/notifications/notification.service';

@Component({
  selector: 'app-login',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  loading = false;
  userData = {};
  isLogin = true;
  isRegister = false;

  constructor(
    private fg: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) {
  }

  public LoginForm = this.fg.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  ngOnInit() {

  }


  login() {
    const LoginData = {
      username: this.LoginForm.controls.username.value.toString(),
      password: this.LoginForm.controls.password.value.toString()
    };
    if (this.LoginForm.invalid) {
      this.notificationService.errorNotification('user name or password is incorrect');
      return;
    }
    if (this.LoginForm.valid) {
      this.loading = true;
      this.authService.Login(LoginData).subscribe(
        (resp: HttpResponse<any>) => {
          if (resp.status === 200) {
            this.authService.saveToken(resp.body.token);
            this.authService.saveUserId(resp.body._id);
            localStorage.setItem('user-role', resp.body.roles[0]);
            this.router.navigateByUrl('');
          }
        },
        err => {
          this.loading = false;
          this.notificationService.errorNotification(err.error.message);
        }
      );
    }
  }


}
