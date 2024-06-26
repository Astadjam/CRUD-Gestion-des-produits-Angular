import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from '../services/snackbar.service';
import { GlobalConstants } from '../shared/global-contstants';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {

  loginForm: any = FormGroup
  responseMessage: any
  isLoggedIn: any

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
    private ngxService: NgxUiLoaderService,
    private snackbarService: SnackbarService
  ){}

  ngOnInit(): void {
    this.isLoggedIn = this.userService.isLoggedIn();
    this.loginForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.pattern(GlobalConstants.emailRegex)]],
      password: [null, [Validators.required]]
    })
  }

  handleSubmit(){
    this.ngxService.start()
    var formData = this.loginForm.value
    var data = {
      email: formData.email,
      password: formData.password
    }
    this.userService.login(data).subscribe((response: any) => {
      this.ngxService.stop()
      localStorage.setItem('token', response.token)
      localStorage.setItem('userName', response.userName)
      if(response.userRole === 'client'){
        this.router.navigate(['/'])
      }
      else {
        this.router.navigate(['/shopstore/dashboard'])
      }
    }, (error) => {
      this.ngxService.stop()
      if(error.error?.message){
        this.responseMessage = error.error?.message
      } else {
        this.responseMessage = GlobalConstants.genericError
      }
      this.snackbarService.openSnackBar(this.responseMessage)
    })
  }

  onBack(){
    this.router.navigate(['/'])
  }

}
