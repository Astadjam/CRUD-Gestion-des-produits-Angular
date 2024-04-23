import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from '../../services/snackbar.service';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { MatTableDataSource } from '@angular/material/table';
import { GlobalConstants } from '../../shared/global-contstants';
import { UsersComponent } from '../dialog/users/users.component';
import { ConfirmationComponent } from '../dialog/confirmation/confirmation.component';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrl: './manage-users.component.scss'
})
export class ManageUsersComponent implements OnInit{

  displayedColumns: string[] = ['name', 'email', 'role', 'edit']
  dataSource: any
  responseMessage: any

  constructor(private ngxService: NgxUiLoaderService,
    private dialog: MatDialog,
    private snackbarService: SnackbarService,
    private router: Router,
    private userService: UserService){}

  ngOnInit(): void {
    this.ngxService.start()
    this.tableData()
  }

  tableData(){
    this.userService.getAllUsers().subscribe((response: any)=>{
      this.ngxService.stop()
      this.dataSource = new MatTableDataSource(response)
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

  applyFilter(event: any){
    const filterValue = (event.target as HTMLInputElement).value
    this.dataSource.filter = filterValue.trim().toLowerCase()
  }

  handleAddAction(){
    const dialogConfig = new MatDialogConfig()
    dialogConfig.data = {
      action: 'Nouvel'
    }

    dialogConfig.width="850px"
    const dialogRef = this.dialog.open(UsersComponent, dialogConfig)
    this.router.events.subscribe(()=>{
      dialogRef.close()
    })
    const res = dialogRef.componentInstance.onCreateUser.subscribe(
      (response)=>{
        this.tableData()
      }
    )
  }

  handleEditAction(values: any){
    const dialogConfig = new MatDialogConfig()
    dialogConfig.data = {
      action: 'Editer',
      data: values
    }

    dialogConfig.width="850px"
    const dialogRef = this.dialog.open(UsersComponent, dialogConfig)
    this.router.events.subscribe(()=>{
      dialogRef.close()
    })
    const res = dialogRef.componentInstance.onEditUser.subscribe(
      (response)=>{
        this.tableData()
      }
    )
  }

  handleDeleteAction(values: any){
    const dialogConfig = new MatDialogConfig()
    dialogConfig.data = {
      action: 'Supprimer',
      data: values
    }

    dialogConfig.width="400px"
    const dialogRef = this.dialog.open(UsersComponent, dialogConfig)
    this.router.events.subscribe(()=>{
      dialogRef.close()
    })
    const res = dialogRef.componentInstance.onDeleteUser.subscribe(
      (response)=>{
        this.tableData()
      }
    )
  }

}
