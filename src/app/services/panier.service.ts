import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PanierService {

  url = environment.apiUrl

  panierProducts: any = []
  totalAmount: any

  constructor(private router: Router, private http: HttpClient) { }

  addProductToPanier(product:any){
    let productExists = false
    for (let i in this.panierProducts) {
      if (this.panierProducts[i].id === product._id || this.panierProducts[i].id === product.id ) {
        this.panierProducts[i].quantity++
        productExists = true
        this.getTotalAmount()
        break
      }
    }
    if (!productExists) {
      this.panierProducts.push({
        id: product._id,
        name: product.name,
        price: product.price,
        category: product.categoryName,
        imageProduct: product.imageProduct,
        quantity: 1
      });
    }
    this.getTotalAmount();
  }

  getTotalAmount() {
    if (this.panierProducts) {
      this.totalAmount = 0;
      this.panierProducts.forEach((product) => {
        this.totalAmount += (product.quantity * product.price );
      });
      return this.totalAmount;
    }
  }

  getProductsFromPanier() {
    return this.panierProducts;
  }

  getPanierCount(){
    if (this.panierProducts) {
      let panierCount = 0;
      this.panierProducts.forEach((product) => {
        panierCount += product.quantity;
      });
      return panierCount;
    }
    return 0
  }

  removeFromPanier(product: any) {
    this.panierProducts = this.panierProducts.filter((item) => item.id !== product.id);
    this.getTotalAmount();
  }

  decrementFromPanier(product: any) {
    for (let i in this.panierProducts) {
      if (this.panierProducts[i].id === product.id) {
        if (this.panierProducts[i].quantity === 0) {
          this.removeFromPanier(product);
        } else {
          this.panierProducts[i].quantity--;
        }
        this.getTotalAmount();
        break;
      }
    }
    this.getTotalAmount();
  }
}