import { Component, OnInit } from '@angular/core';
import { PanierService } from '../services/panier.service';

@Component({
  selector: 'app-panier',
  templateUrl: './panier.component.html',
  styleUrl: './panier.component.scss'
})
export class PanierComponent implements OnInit {

  panierProducts = []
  panierTotalValue:any
  panierCount:any

  constructor(private panierService: PanierService) { 
    this.panierProducts = this.panierService.getProductsFromPanier()
    this.panierCount = this.panierService.getPanierCount()
    this.panierTotalValue = this.panierService.getTotalAmount()
  }

  ngOnInit(): void {
    setInterval(() => {
      this.panierCount = this.panierService.getPanierCount()
    }, 200);
  }

  handelRemoveProduct(product: any) {
    this.panierService.removeFromPanier(product)
    this.panierProducts = this.panierService.getProductsFromPanier()
    this.panierTotalValue =  this.panierService.getTotalAmount()
  }

  handleIncrement(product: any) {
    this.panierService.addProductToPanier(product);
    this.panierProducts = this.panierService.getProductsFromPanier()
    this.panierTotalValue =  this.panierService.getTotalAmount()
  }

  handleDecriment(product: any) {
    this.panierService.decrementFromPanier(product);
    this.panierProducts = this.panierService.getProductsFromPanier()
    this.panierTotalValue =  this.panierService.getTotalAmount()
  }

}
