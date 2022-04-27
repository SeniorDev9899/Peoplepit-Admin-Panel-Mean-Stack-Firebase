import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, retry, tap } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private getMenuURL = 'http://localhost:5001/peoplepit-7c4b8/us-central1/getMenu'

  private getContainerURL = 'http://localhost:5001/peoplepit-7c4b8/us-central1/getContainer'

  constructor(private http: HttpClient) {  }

  //public menuSubject = new BehaviorSubject<any[]>([]);
  //public menu = this.menuSubject.asObservable();

  getMenu(/*idToken: string*/): Observable<any[]> {
    //var token = 'Bearer ' + idToken;
    let params = new HttpParams().set("testParam1",'YouMadeIt1').set("testParam2", 'YouMadeIt2'); //Create new HttpParams
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      }),
      withCredentials: false,
      params: params
    };  
    
    return this.http.get<any[]>(this.getMenuURL, httpOptions);    
  }

  getContainer(object:string, action:string, key:string): Observable<any[]> {
    let params = new HttpParams().set("object",object).set("action", action).set("key", key); 
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      }),
      withCredentials: false,
      params: params
    };  
    
    return this.http.get<any[]>(this.getContainerURL, httpOptions);    
  }

    /**
 * Handle Http operation that failed.
 * Let the app continue.
 * @param operation - name of the operation that failed
 * @param result - optional value to return as the observable result
 */

private handleError<T> (operation = 'operation', result?: T) {
  return (error: any): Observable<T> => {

    // TODO: send the error to remote logging infrastructure
    console.error(error); // log to console instead

    // TODO: better job of transforming error for user consumption
    //this.log(`${operation} failed: ${error.message}`);

    // Let the app keep running by returning an empty result.
    return of(result as T);
  };
}

}
