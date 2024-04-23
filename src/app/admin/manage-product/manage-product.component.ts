import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from '../../services/snackbar.service';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { MatTableDataSource } from '@angular/material/table';
import { GlobalConstants } from '../../shared/global-contstants';
import { ConfirmationComponent } from '../dialog/confirmation/confirmation.component';
import { ProductComponent } from '../dialog/product/product.component';
import { ViewProductComponent } from '../dialog/view-product/view-product.component';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-manage-product',
  templateUrl: './manage-product.component.html',
  styleUrl: './manage-product.component.scss'
})
export class ManageProductComponent implements OnInit {
  displayedColumns: string[] = ['name', 'price', 'categoryName', 'edit']
  dataSource: any
  responseMessage: any

  constructor(
    private ngxService: NgxUiLoaderService,
    private dialog: MatDialog,
    private snackbarService: SnackbarService,
    private router: Router,
    private productService: ProductService,
    private categoryService: CategoryService
  ) { }

  ngOnInit(): void {
    this.ngxService.start()
    this.tableData()

  }

  tableData() {
    this.categoryService.getAllCategory().subscribe((categoryResponse:any) => {
      this.productService.getAllProduct().subscribe((response: any) => {
        this.ngxService.stop()
        this.dataSource = new MatTableDataSource(response.map((line: any)=>{
          line.categoryName = categoryResponse.filter((category:any)=>category._id == line.categoryId)[0].name
          return line
        }))
      }, (error: any) => {
        this.ngxService.stop()
        console.log(error)
        if (error.error?.message) {
          this.responseMessage = error.error?.message
        } else {
          this.responseMessage = GlobalConstants.genericError
        }
        this.snackbarService.openSnackBar(this.responseMessage)
      })
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
    this.dataSource.filter = filterValue.trim().toLowerCase()
  }

  handleAddAction() {
    const dialogConfig = new MatDialogConfig()
    dialogConfig.data = {
      action: 'Créer'
    }
    dialogConfig.width = "850px"
    const dialogRef = this.dialog.open(ProductComponent, dialogConfig)
    this.router.events.subscribe(()=>{
      dialogRef.close()
    })
    const res = dialogRef.componentInstance.onAddProduct.subscribe((response: any)=>{
      this.tableData()
    })
   }

  handleViewAction(values: any) {
    const dialogConfig = new MatDialogConfig()
    dialogConfig.data = {
      action: 'View',
      data: values

    }
    dialogConfig.width = "850px"
    const dialogRef = this.dialog.open(ViewProductComponent, dialogConfig)
    this.router.events.subscribe(()=>{
      dialogRef.close()
    })
   }

  handleEditAction(values: any) {
    const dialogConfig = new MatDialogConfig()
    dialogConfig.data = {
      action: 'Editer',
      data: values
    }
    
    dialogConfig.width = "850px"
    const dialogRef = this.dialog.open(ProductComponent, dialogConfig)
    this.router.events.subscribe(()=>{
      dialogRef.close()
    })
    const res = dialogRef.componentInstance.onEditProduct.subscribe((response: any)=>{
      this.tableData()
    })
   }

  onDelete(value: any) {
    const dialogConfig = new MatDialogConfig()
    dialogConfig.data = {
      message: 'supprimer ce produit'
    }
    const dialogRef = this.dialog.open(ConfirmationComponent, dialogConfig)
    const res = dialogRef.componentInstance.onEmitStatusChange.subscribe((response: any) => {
      this.ngxService.start()
      this.deleteProduct(value._id)
      dialogRef.close()
    })
  }

  deleteProduct(id: any) {
    this.productService.deleteProduct(id).subscribe((response: any) => {
      this.ngxService.stop()
      this.tableData()
      this.responseMessage = response.message
      this.snackbarService.openSnackBar(this.responseMessage)
    }, (error: any) => {
      this.ngxService.stop()
      console.log(error)
      if (error.error?.message) {
        this.responseMessage = error.error?.message
      } else {
        this.responseMessage = GlobalConstants.genericError
      }
      this.snackbarService.openSnackBar(this.responseMessage)
    })
  }
}
