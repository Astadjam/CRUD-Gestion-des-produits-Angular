import { Component, Inject, Input, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { SnackbarService } from '../services/snackbar.service';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { GlobalConstants } from '../shared/global-contstants';
import { MatDialogConfig } from '@angular/material/dialog';
import { ProductDetailsComponent } from '../product-details/product-details.component';
import { CategoryService } from '../services/category.service';
import { SignupComponent } from '../signup/signup.component';
import { UserService } from '../services/user.service';
import { ConfirmationComponent } from '../admin/dialog/confirmation/confirmation.component';
import { PanierComponent } from '../panier/panier.component';
import { PanierService } from '../services/panier.service';
import { HomeComponent } from '../home/home.component';

@Component({
  selector: 'app-list-product',
  templateUrl: './list-product.component.html',
  styleUrl: './list-product.component.scss'
})
export class ListProductComponent implements OnInit {
  userName: any
  responseMessage: any
  products: any
  searchText: string = ''
  isLoggedIn: any
  panier = 0
  categoryId: string

  constructor(
    private productService: ProductService,
    private snackbarService: SnackbarService,
    private dialog: MatDialog,
    private router: Router,
    private ngxService: NgxUiLoaderService,
    private categoryService: CategoryService,
    private userService: UserService,
    private panierService: PanierService,
    private route: ActivatedRoute
  ){
    this.ngxService.start()
    this.tableData()
    this.panier = this.panierService.getPanierCount();
  }


  ngOnInit(): void {
    this.route.paramMap.subscribe((params:any) => {
      this.categoryId = params.get("categoryId")
    })

    this.isLoggedIn = this.userService.isLoggedIn()
    if(this.isLoggedIn){
      this.userName = localStorage.getItem('userName')
    }
    setInterval(() => {
      this.panier = this.panierService.getPanierCount();
      //this.panier = this.panierService.panierProducts.length
    }, 200);
    
  }

  tableData(){
    this.categoryService.getAllCategory().subscribe((categoryResponse:any) => {
      this.productService.getProductByCategory(this.categoryId).subscribe((response: any) => {
        this.products = response.map((line: any)=>{
          line.categoryName = categoryResponse.filter((category:any)=>category._id == line.categoryId)[0].name
          return line
        })
        this.ngxService.stop()
      }, (error: any) => {
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

  filteredItems():any{
    return this.products?.filter(item =>
      item.name.toLowerCase().includes(this.searchText.toLowerCase()) ||
      item.categoryName.toLowerCase().includes(this.searchText.toLowerCase())
    )
  }

  handleViewAction(values: any){
    const dialogConfig = new MatDialogConfig()
    dialogConfig.data = {
      action: 'Editer',
      data: values
    }
    dialogConfig.width = "850px"
    const dialogRef = this.dialog.open(ProductDetailsComponent, dialogConfig)
    this.router.events.subscribe(()=>{
      dialogRef.close()
    })
  }

  signupAction(){
    const dialogConfig = new MatDialogConfig()
    dialogConfig.width = "550px"
    this.dialog.open(SignupComponent, dialogConfig)
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
      this.router.navigate(['/login'])
    })
  }

  viewPanier(){
    const dialogConfig = new MatDialogConfig()
    dialogConfig.data = {
      action: 'Editer',
      //data: values
    }
    dialogConfig.width = "850px"
    const dialogRef = this.dialog.open(PanierComponent, dialogConfig)
    this.router.events.subscribe(()=>{
      dialogRef.close()
    })
  }

  handleAddToPanier(values: any){
    this.panierService.addProductToPanier(values);
  }

}
