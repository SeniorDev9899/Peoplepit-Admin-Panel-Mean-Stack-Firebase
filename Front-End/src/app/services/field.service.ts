import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class FieldService {

  private createFieldURL = 'http://localhost:5001/peoplepit-7c4b8/us-central1/createField';
  private getFieldURL = 'http://localhost:5001/peoplepit-7c4b8/us-central1/getFields';
  private updateFieldURL = "http://localhost:5001/peoplepit-7c4b8/us-central1/updateField";
  private createOptionFieldURL = "http://localhost:5001/peoplepit-7c4b8/us-central1/createOptionField";
  private getOptionFieldURL = "http://localhost:5001/peoplepit-7c4b8/us-central1/getOptionField"

  constructor(
    private http: HttpClient
  ) { }  

  //CREATE
  createFieldData(field:string, data:any) {
    return this.http.post<any[]>(this.createFieldURL, {
      collection: field,
      data: data
    });
  }

  //READ
  getFieldData(field:string) { 
    let params = new HttpParams().set("field",field);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      }),
      withCredentials: false,
      params: params
    };  
    
    return this.http.get<any[]>(this.getFieldURL, httpOptions);   
  }

  //UPDATE
  updateFieldData(field:string, key:string, data:any) {
    console.log("Update Field Data => ", field, key, data);

    return this.http.post<any[]>(this.updateFieldURL, {
      collection: field,
      document: key,
      data: data
    });
  }

  //DELETE
  // deleteObjectData(object:string, key:string) {
  //   return this.firestore
  //      .collection(object)
  //      .doc(key)
  //      .delete();
  // }
  

  //Create Option of Field
  createOptionField(field:string, data:any) {
    return this.http.post<any[]>(this.createOptionFieldURL, {
      document: field,
      data: data
    });
  }

  //Get Option of Field
  getOptionField(field:string) {
    let params = new HttpParams().set("document",field);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      }),
      withCredentials: false,
      params: params
    }; 
    return this.http.get<any[]>(this.getOptionFieldURL, httpOptions);  
  }
}
