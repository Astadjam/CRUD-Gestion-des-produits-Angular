import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CategoryService } from '../../../services/category.service';
import { SnackbarService } from '../../../services/snackbar.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { GlobalConstants } from '../../../shared/global-contstants';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss'
})
export class CategoryComponent implements OnInit{
onAddCategory = new EventEmitter()
onEditCategory = new EventEmitter()
onDeleteCategory = new EventEmitter()
categoryForm: any = FormGroup
dialogAction: any = "Add"
action: any = "Créer"
responseMessage: any
imageCategory: File | null = null

constructor(
  @Inject(MAT_DIALOG_DATA) public dialogData: any,
  private formBuilder: FormBuilder,
  private categoryService: CategoryService,
  private dialogRef: MatDialogRef<CategoryComponent>,
  private snackbarService: SnackbarService,
  private ngxService: NgxUiLoaderService
){}

ngOnInit(): void {
  this.categoryForm = this.formBuilder.group({
    name: [null, [Validators.required]]
  })
  if(this.dialogData.action === 'Editer'){
    this.dialogAction = 'Editer'
    this.action = 'Editer'
    this.categoryForm.patchValue(this.dialogData.data)
    this.imageCategory = this.dialogData.data.imageCategory
  }

  if(this.dialogData.action === 'Supprimer'){
    this.dialogAction = 'Supprimer'
    this.action = 'Supprimer'
  }
}

handleSubmit(){
  if(this.dialogAction == 'Editer'){
    this.edit()
  } else if(this.dialogAction == 'Supprimer'){
    this.delete()
  } else{
    this.add()
  }
}

add(){
  this.ngxService.start()
  // Créer un objet FormData
  const formData = new FormData();
  // Ajouter les champs de formulaire à l'objet FormData
  formData.append('name', this.categoryForm.value.name)
  formData.append('image', this.imageCategory)

  this.categoryService.createCategory(formData).subscribe((response: any) =>{
    this.ngxService.stop()
    this.dialogRef.close()
    this.onAddCategory.emit()
    this.responseMessage = response.message
    this.snackbarService.openSnackBar(this.responseMessage)
  }, (error: any) =>{
    this.ngxService.stop()
    console.log(error)
    if(error.error?.message){
      this.responseMessage = error.error?.message
    }
    else{
      this.responseMessage = GlobalConstants.genericError
    }
    this.snackbarService.openSnackBar(this.responseMessage)
  })
}

edit(){
  this.ngxService.start()
  const formData = new FormData();
  // Ajouter les champs de formulaire à l'objet FormData
  formData.append('id', this.dialogData.data._id)
  formData.append('name', this.categoryForm.value.name)
  formData.append('image', this.imageCategory)

  this.categoryService.updateCategory(formData).subscribe((response: any) =>{
    this.ngxService.stop()
    this.dialogRef.close()
    this.onEditCategory.emit()
    this.responseMessage = response.message
    this.snackbarService.openSnackBar(this.responseMessage)
  }, (error: any) =>{
    this.ngxService.stop()
    console.log(error)
    if(error.error?.message){
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
  var formData = this.categoryForm.value
  var data = {
    id: this.dialogData.data._id
  }
  this.categoryService.deleteCategory(data.id).subscribe((response: any) =>{
    this.ngxService.stop()
    this.dialogRef.close()
    this.onDeleteCategory.emit()
    this.responseMessage = response.message
    this.snackbarService.openSnackBar(this.responseMessage)
  }, (error: any) =>{
    this.ngxService.stop()
    console.log(error)
    if(error.error?.message){
      this.responseMessage = error.error?.message
    }
    else{
      this.responseMessage = GlobalConstants.genericError
    }
    this.snackbarService.openSnackBar(this.responseMessage)
  })
}

handleImageInput(event: any) {
  const files = event.target.files;
  if (files && files.length > 0) {
    this.imageCategory = files[0];
  }
}
}

