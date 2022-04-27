import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class ObjectService {

  private createObjectURL = 'http://localhost:5001/peoplepit-7c4b8/us-central1/createObject';
  private getObjectsURL = 'http://localhost:5001/peoplepit-7c4b8/us-central1/getObjects';
  private updateObjectURL = "http://localhost:5001/peoplepit-7c4b8/us-central1/updateObject";
  
  constructor(
    private firestore: AngularFirestore,
    private http: HttpClient
  ) { }

  //CREATE
  createObjectData(object:string, data:any) {
    return this.http.post<any[]>(this.createObjectURL, {
      collection: object,
      data: data
    });
  }

  //READ
  getObjectData(object:string) { 
    // return this.firestore
    //     .collection(object)
    //     .snapshotChanges();
    let params = new HttpParams().set("object",object);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      }),
      withCredentials: false,
      params: params
    };  
    
    return this.http.get<any[]>(this.getObjectsURL, httpOptions);   
  }

  //UPDATE
  updateObjectData(object:string, key:string, data:any) {
    console.log("Update Object Data => ", object, key, data);

    return this.http.post<any[]>(this.updateObjectURL, {
      collection: object,
      document: key,
      data: data
    });
  }

  //DELETE
  deleteObjectData(object:string, key:string) {
    return this.firestore
       .collection(object)
       .doc(key)
       .delete();
  }
}
