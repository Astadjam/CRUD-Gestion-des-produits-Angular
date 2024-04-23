import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss'
})
export class ProductDetailsComponent {

  productDetails: any

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: any
  ){
    this.productDetails = this.dialogData.data
  }

}
