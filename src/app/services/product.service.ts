import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  url = environment.apiUrl

  constructor(private httpClient: HttpClient) { }

  createProduct(data: FormData){
    return this.httpClient.post(this.url + '/product/create', data)
  }

  updateProduct(data: FormData){
    return this.httpClient.put(this.url + '/product/edit', data)
  }

  deleteProduct(productId: any){
    return this.httpClient.delete(`${this.url}/product/delete/${productId}`)
  }

  getProductByCategory(categoryId: any){
    return this.httpClient.get(`${this.url}/product/list/${categoryId}`)
  }

  getAllProduct(){
     return this.httpClient.get(this.url + '/product/list')
  }
}
