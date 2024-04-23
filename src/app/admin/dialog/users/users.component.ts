import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SnackbarService } from '../../../services/snackbar.service';
import { UserService } from '../../../services/user.service';
import { GlobalConstants } from '../../../shared/global-contstants';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit{
  onCreateUser = new EventEmitter()
  onEditUser = new EventEmitter()
  onDeleteUser = new EventEmitter()
  usersForm: any = FormGroup
  dialogAction: any = "Add"
  action: any = "Créer"
  responseMessage: any

  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: any,
  private formBuilder: FormBuilder,
  public dialogRef: MatDialogRef<UsersComponent>,
  private snackbarService: SnackbarService,
  private userService: UserService,
  private ngxService: NgxUiLoaderService){}

  ngOnInit(): void {
    this.usersForm = this.formBuilder.group({
      name: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.pattern(GlobalConstants.emailRegex)]],
      role: [null, [Validators.required]],
      password: [null, [Validators.required]]
    })

    if(this.dialogData.action === 'Editer'){
      this.dialogAction = 'Editer'
      this.action = 'Editer'
      this.usersForm.patchValue(this.dialogData.data)
      this.usersForm.controls['password'].setValue('password')
    }

    if(this.dialogData.action === 'Supprimer'){
      this.dialogAction = 'Supprimer'
      this.action = 'Supprimer'
    }
  }

  handleSubmit(){
      if(this.dialogAction == "Editer"){
        this.edit()
      }
      else if(this.dialogAction == "Supprimer"){
        this.delete()
      }
      else{
        this.add()
      }
  }

  add(){
    this.ngxService.start()
    var formData = this.usersForm.value
    var data = {
      name: formData.name,
      email: formData.email,
      role: formData.role,
      password: formData.password
    }

    this.userService.createUser(data).subscribe((Response: any) =>{
      this.ngxService.stop()
      this.dialogRef.close()
      this.onCreateUser.emit()
      this.responseMessage = Response.message
      this.snackbarService.openSnackBar(this.responseMessage)
    }, (error: any) => {
      this.ngxService.stop()
      console.log(error)
      if(error.erro?.message){
        this.responseMessage = error.error?.message
      }
      else{
        this.responseMessage = GlobalConstants.genericError
      }
      this.snackbarService.openSnackBar(this.responseMessage)
  })}

  edit(){
    this.ngxService.start()
    var formData = this.usersForm.value
    var data = {
      id: this.dialogData.data._id,
      name: formData.name,
      role: formData.role,
      email: formData.email,
    }

    this.userService.updateUser(data).subscribe((Response: any) =>{
      this.ngxService.stop()
      this.dialogRef.close()
      this.onEditUser.emit()
      this.responseMessage = Response.message
      this.snackbarService.openSnackBar(this.responseMessage)
    }, (error: any) => {
      this.ngxService.stop()
      console.log(error)
      if(error.erro?.message){
        this.responseMessage = error.error?.message
      }
      else{
        this.responseMessage = GlobalConstants.genericError
      }
      this.snackbarService.openSnackBar(this.responseMessage)
  })
  }

  delete(){
    this.ngxService.start()
    var data = {
      id: this.dialogData.data._id
    }

    this.userService.deleteUser(data.id).subscribe((Response: any) =>{
      this.ngxService.stop()
      this.dialogRef.close()
      this.onDeleteUser.emit()
      this.responseMessage = Response.message
      this.snackbarService.openSnackBar(this.responseMessage)
    }, (error: any) => {
      this.ngxService.stop()
      console.log(error)
      if(error.erro?.message){
        this.responseMessage = error.error?.message
      }
      else{
        this.responseMessage = GlobalConstants.genericError
      }
      this.snackbarService.openSnackBar(this.responseMessage)
  })
  }
}
