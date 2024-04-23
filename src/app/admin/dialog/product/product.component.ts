import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from '../../../services/category.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SnackbarService } from '../../../services/snackbar.service';
import { ProductService } from '../../../services/product.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { GlobalConstants } from '../../../shared/global-contstants';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss'
})
export class ProductComponent implements OnInit{
  onAddProduct = new EventEmitter()
  onEditProduct = new EventEmitter()
  productForm: any = FormGroup
  dialogAction: any = "Créer"
  action: any = "Créer"
  categorys: any
  responseMessage: any
  imageProduct: File | null = null

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    private formBuilder: FormBuilder,
    private categoryService: CategoryService,
    public dialogRef: MatDialogRef<ProductComponent>,
    private snackbarService: SnackbarService,
    private productService: ProductService,
    private ngxService: NgxUiLoaderService
  ){}

  ngOnInit(): void {
    this.productForm = this.formBuilder.group({
      name: [null, [Validators.required]],
      price: [null, [Validators.required]],
      categoryId: [null, [Validators.required]]
    })
    if(this.dialogData.action === "Editer"){
      this.dialogAction = "Editer"
      this.action = "Editer"
      this.productForm.patchValue(this.dialogData.data)
      this.imageProduct = this.dialogData.data.imageProduct
    }

    this.getAllCategory()
    this.ngxService.start()
  }

  getAllCategory(){
    this.categoryService.getAllCategory().subscribe((response: any)=>{
      this.categorys = response
      this.ngxService.stop()
    }, (error: any)=>{
      this.ngxService.stop()
      console.log(error)
      if(error.error?.message){
        this.responseMessage = error.error?.message
      }
      else
      this.responseMessage = GlobalConstants.genericError

      this.snackbarService.openSnackBar(this.responseMessage)
    })
  }

  handleSubmit(){
    if(this.dialogAction === "Editer"){
      this.edit()
    }
    else{
      this.add()
    }
  }

  add(){
    this.ngxService.start()
    // Créer un objet FormData
    const formData = new FormData();
  // Ajouter les champs de formulaire à l'objet FormData
  formData.append('name', this.productForm.value.name);
  formData.append('price', this.productForm.value.price);
  formData.append('categoryId', this.productForm.value.categoryId);
  formData.append('image', this.imageProduct);

    this.productService.createProduct(formData).subscribe((response: any)=>{
      this.dialogRef.close()
      this.ngxService.stop()
      this.onAddProduct.emit()
      this.responseMessage = response.message
      this.snackbarService.openSnackBar(this.responseMessage)
    }, (error: any)=>{
      this.dialogRef.close()
      this.ngxService.stop()
      console.log(error)
      if(error.error?.message){
        this.responseMessage = error.error?.message
      }
      else
      this.responseMessage = GlobalConstants.genericError

      this.snackbarService.openSnackBar(this.responseMessage)
    })
  }

  edit(){
    this.ngxService.start()
    const formData = new FormData();
  // Ajouter les champs de formulaire à l'objet FormData
  formData.append('id', this.dialogData.data._id);
  formData.append('name', this.productForm.value.name);
  formData.append('price', this.productForm.value.price);
  formData.append('categoryId', this.productForm.value.categoryId);
  formData.append('image', this.imageProduct);

    this.productService.updateProduct(formData).subscribe((response: any)=>{
      this.dialogRef.close()
      this.ngxService.stop()
      this.onEditProduct.emit()
      this.responseMessage = response.message
      this.snackbarService.openSnackBar(this.responseMessage)
    }, (error: any)=>{
      this.dialogRef.close()
      this.ngxService.stop()
      console.log(error)
      if(error.error?.message){
        this.responseMessage = error.error?.message
      }
      else
      this.responseMessage = GlobalConstants.genericError

      this.snackbarService.openSnackBar(this.responseMessage)
    })
  }

  handleImageInput(event: any) {
    const files = event.target.files;
    if (files && files.length > 0) {
      this.imageProduct = files[0];
    }
  }

}
