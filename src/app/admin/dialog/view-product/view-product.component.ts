import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-view-product',
  templateUrl: './view-product.component.html',
  styleUrl: './view-product.component.scss'
})
export class ViewProductComponent implements OnInit{

  product: any

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: any){}

  ngOnInit(): void {
    this.product = this.dialogData.data
  }
}
