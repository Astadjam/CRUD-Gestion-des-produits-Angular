import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ConfirmationComponent } from '../dialog/confirmation/confirmation.component';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent implements OnInit{

  userName:any

  constructor(private dialog: MatDialog,
    private router: Router
  ){}

  ngOnInit(): void {
    this.userName = localStorage.getItem('userName');
  }

  logout(){
    const dialogConfig = new MatDialogConfig()
    dialogConfig.data = {
      message: 'vous déconnecter'
    }
    const dialogRef = this.dialog.open(ConfirmationComponent, dialogConfig)
    const response = dialogRef.componentInstance.onEmitStatusChange.subscribe((Response: any) => {
      dialogRef.close()
      localStorage.removeItem('token')
      localStorage.removeItem('userName')
      this.router.navigate(['/'])
    })
  }

}
