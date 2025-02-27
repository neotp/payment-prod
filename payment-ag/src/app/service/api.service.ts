import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Login } from '../interface/loginpage-interface';
import { FindCusCode, GetInv, SearchInv } from '../interface/payment-interface';
import { Register } from '../interface/register-interface';
import { switchMap } from 'rxjs/operators';
import md5 from 'blueimp-md5'; // Importing md5 from blueimp-md5

@Injectable({
  providedIn: 'root', // No `imports` here
})
export class ApiService {
  private apiUrl = 'http://172.31.144.1:7000/';

  constructor(private http: HttpClient) { }

  public getRequestHeader() {
    return {
      'Content-Type': 'application/json',
    };
  }


  public getDataInvoice(data: GetInv): Observable<any> {
    return this.http.post(
      `${this.apiUrl}getDataInvoice`
      , data
      , { headers: this.getRequestHeader(), withCredentials: true }
    );
  }

  public findCusCode(data: FindCusCode): Observable<any> {
    return this.http.post(
      `${this.apiUrl}findCusCode/`
      , data
      , { headers: this.getRequestHeader(), withCredentials: true }
    );
  }

  public login(data: Login): Observable<any> {
    return this.http.post(`${this.apiUrl}login/`, data, {
      headers: this.getRequestHeader(),
      withCredentials: true
    }).pipe(
      catchError(error => {
        console.error('Login failed:', error);
        return throwError(error);
      })
    );
  }

  public register(data: Register): Observable<any> {
    return this.http.post(`${this.apiUrl}register/`
      , data
      , { headers: this.getRequestHeader(), withCredentials: true }
    ); // Example for POST login
  }

  public findDataPending(): Observable<any> {
    return this.http.post(`${this.apiUrl}findDataPending/`
      , { headers: this.getRequestHeader(), withCredentials: true }
    );
  }

  public updateDataToWork(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}updateDataToWork/`
      , data
      , { headers: this.getRequestHeader(), withCredentials: true }
    );
  }

  public saveData(): Observable<any> {
    return this.http.post(`${this.apiUrl}saveData/`
      , { headers: this.getRequestHeader(), withCredentials: true }
    );
  }

  public testConnect(data: SearchInv): Observable<any> {
    return this.http.post(
      `${this.apiUrl}test/`
      , data
      , { headers: this.getRequestHeader(), withCredentials: true }
    );
  }

}
