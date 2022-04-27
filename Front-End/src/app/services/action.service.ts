import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ActionService {

  private getActionURL = 'http://localhost:5001/peoplepit-7c4b8/us-central1/getActions';
  private createActionURL = 'http://localhost:5001/peoplepit-7c4b8/us-central1/createAction';
  private updateActionURL = 'http://localhost:5001/peoplepit-7c4b8/us-central1/updateAction';

  constructor(
    private http: HttpClient
  ) { }

  //READ ACTION
  getAction(action:string) { 
    let params = new HttpParams().set("actions",action);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      }),
      withCredentials: false,
      params: params
    };  
    
    return this.http.get<any[]>(this.getActionURL, httpOptions);   
  }

  //CREATE ACTION
  createAction(data:any) {
    return this.http.post<any[]>(this.createActionURL, {
      data: data
    });
  }

  //UPDATE ACTION
  updateAction(actionDocument:string, data:any) {
    return this.http.post<any[]>(this.updateActionURL, {
      actionDocument:actionDocument,
      data: data
    });
  }
}
