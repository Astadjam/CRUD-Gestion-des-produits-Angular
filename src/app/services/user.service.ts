import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  url = environment.apiUrl

  constructor(private httpClient: HttpClient) { }

  login(data: any){
    return this.httpClient.post(this.url + '/user/login', data, {headers: new HttpHeaders().set('Content-Type', "application/json")})
  }

  createUser(data: any){
    return this.httpClient.post(this.url + '/user/create', data, {headers: new HttpHeaders().set('Content-Type', "application/json")})
  }

  getAllUsers(){
    return this.httpClient.get(this.url + "/user/list")
  }

  updateUser(data: any){
    return this.httpClient.put(this.url + "/user/update", data, {headers: new HttpHeaders().set('Content-Type', "application/json")})
  }

  deleteUser(userId: string){
    return this.httpClient.delete(`${this.url}/user/delete/${userId}`);
  }

  isLoggedIn(): boolean {
    // Vérifier si l'utilisateur est connecté en fonction de certaines conditions, par exemple, la présence d'un jeton d'authentification valide dans le stockage local
    const token = localStorage.getItem('token');
    return token !== null; // Retourne true si un jeton est présent, sinon false
  }
}
