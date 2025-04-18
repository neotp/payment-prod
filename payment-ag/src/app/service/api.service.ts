import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Login } from '../interface/loginpage-interface';
import { FindCusCode, GetInv, SearchInv } from '../interface/payment-interface';
import { Register } from '../interface/register-interface';
import { CreatSo } from '../interface/dummy-interface';
import { SearchPayment, SearchPaymentDetail } from '../interface/history-interface';
import { CreatUser } from '../interface/manageuser-interface';

@Injectable({
  providedIn: 'root', // No `imports` here
})
export class ApiService {
  // private apiUrl = 'http://172.31.20.11:7070/';
  
  // private apiUrl = 'http://172.31.144.1:7000/';
  private apiUrl = 'https://172.17.17.127/payment/';
  

  constructor(private http: HttpClient) { }

  public getRequestHeader() {
    return {
      'Content-Type': 'application/json',
    };
  }

  // ---------------------------- Begin loginpage ----------------------------
  public login(data: Login): Observable<any> {
    return this.http.post(`${this.apiUrl}login`, data, {
      headers: this.getRequestHeader(),
      withCredentials: true
    }).pipe(
      catchError(error => {
        console.error('Login failed:', error);
        return throwError(error);
      })
    );
  }
  // ---------------------------- Ending loginpage ----------------------------
  
  // ---------------------------- Begin regispage ----------------------------
  public register(data: Register): Observable<any> {
    return this.http.post(`${this.apiUrl}register`
      , data
      , { headers: this.getRequestHeader(), withCredentials: true }
    ); 
  }
  // ---------------------------- Ending regispage ----------------------------


  // ---------------------------- Begin mnusrpage ----------------------------
  public findDataPending(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}findDataPending`
      , data
      , { headers: this.getRequestHeader(), withCredentials: true }
    );
  }

  public updateDataToWork(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}updateDataToWork`
      , data
      , { headers: this.getRequestHeader(), withCredentials: true }
    );
  }
  
  public deleteUser(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}deleteUser`
      , data
      , { headers: this.getRequestHeader(), withCredentials: true }
    );
  }

  public updateDataNow(): Observable<any> {
    return this.http.post(`${this.apiUrl}updateDataNow`
      , { headers: this.getRequestHeader(), withCredentials: true }
    );
  }

  public saveData(): Observable<any> {
    return this.http.post(`${this.apiUrl}saveData`
      , { headers: this.getRequestHeader(), withCredentials: true }
    );
  }

  public createUser(data: CreatUser): Observable<any> {
    return this.http.post(`${this.apiUrl}createUser`
      , data
      , { headers: this.getRequestHeader(), withCredentials: true }
    );
  }
  // ---------------------------- Ending mnusrpage ----------------------------


  // ---------------------------- Begin pymntpage ----------------------------
  public getDataInvoice(data: GetInv): Observable<any> {
    return this.http.post(
      `${this.apiUrl}getDataInvoice`
      , data
      , { headers: this.getRequestHeader(), withCredentials: true }
    );
  }

  public findSumamt(data: any): Observable<any> {
    return this.http.post(
      `${this.apiUrl}findSumamt`
      , data
      , { headers: this.getRequestHeader(), withCredentials: true }
    );
  }

  public findfeeRate(data: any): Observable<any> {
    return this.http.post(
      `${this.apiUrl}findfeeRate`
      , data
      , { headers: this.getRequestHeader(), withCredentials: true }
    );
  }

  public loadData(data: any): Observable<any> {
    return this.http.post(
      `${this.apiUrl}loadData`
      , data
      , { headers: this.getRequestHeader(), withCredentials: true }
    );
  }

  public findCusCode(data: FindCusCode): Observable<any> {
    return this.http.post(
      `${this.apiUrl}findCusCode`
      , data
      , { headers: this.getRequestHeader(), withCredentials: true }
    );
  }

  public getPayment(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}getPayment`
      , data
      , { headers: this.getRequestHeader(), withCredentials: true }
    );
  }

  public updateflag(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}updateflag`
      , data
      , { headers: this.getRequestHeader(), withCredentials: true }
    );
  }

  public updatePaidAmt(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}updatePaidAmt`
      , data
      , { headers: this.getRequestHeader(), withCredentials: true }
    );
  }

  public updateAllflag(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}updateAllflag`
      , data
      , { headers: this.getRequestHeader(), withCredentials: true }
    );
  }

  public createSo(data: CreatSo): Observable<any> {
    return this.http.post(`${this.apiUrl}createSo`
      , data
      , { headers: this.getRequestHeader(), withCredentials: true }
    );
  }
  
  public missingCn(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}missingCn`
      , data
      , { headers: this.getRequestHeader(), withCredentials: true }
    );
  }
  // ---------------------------- Ending pymntpage ----------------------------
  
  // ---------------------------- Begin historypage001a ----------------------------
  
  public searchPaymentData(data: SearchPayment): Observable<any> {
    return this.http.post(`${this.apiUrl}searchPaymentData`
      , data
      , { headers: this.getRequestHeader(), withCredentials: true }
    );
  }

  public findPaymentDetail(data: SearchPaymentDetail): Observable<any> {
    return this.http.post(`${this.apiUrl}findPaymentDetail`
      , data
      , { headers: this.getRequestHeader(), withCredentials: true }
    );
  }

  // ---------------------------- Ending historypage001a ----------------------------


  public testConnect(data: SearchInv): Observable<any> {
    return this.http.post(
      `${this.apiUrl}test/`
      , data
      , { headers: this.getRequestHeader(), withCredentials: true }
    );
  }
}
