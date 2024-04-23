import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  url = environment.apiUrl

  constructor(private httpClient: HttpClient) { }

  createCategory(data: FormData){
    return this.httpClient.post(this.url + "/category/create", data)
  }

  updateCategory(data: FormData){
    return this.httpClient.put(this.url + "/category/edit", data)
  }

  getAllCategory(){
    return this.httpClient.get(this.url + "/category/list")
  }

  deleteCategory(CategoryId: string){
    return this.httpClient.delete(`${this.url}/category/delete/${CategoryId}`); 
  }

}
