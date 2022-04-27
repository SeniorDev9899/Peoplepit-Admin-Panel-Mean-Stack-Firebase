import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ContainerService {

  private createFieldURL = 'http://localhost:5001/peoplepit-7c4b8/us-central1/createField';
  private getContainerURL = 'http://localhost:5001/peoplepit-7c4b8/us-central1/getContainers';
  private updateContainerURL = "http://localhost:5001/peoplepit-7c4b8/us-central1/updateContainer";
  private createContainerURL = "http://localhost:5001/peoplepit-7c4b8/us-central1/createContainer";
  private deleteContainerURL = "http://localhost:5001/peoplepit-7c4b8/us-central1/deleteContainerItem";
  private createContainerRowURL = "http://localhost:5001/peoplepit-7c4b8/us-central1/createContainerRow"
  private updateContainerRowURL = "http://localhost:5001/peoplepit-7c4b8/us-central1/updateContainerRow";
  private deleteContainerRowURL = "http://localhost:5001/peoplepit-7c4b8/us-central1/deleteContainerRowItem";
  private updateContainerRowSectionURL = "http://localhost:5001/peoplepit-7c4b8/us-central1/updateContainerRowSection";
  private createContainerRowSectionURL = "http://localhost:5001/peoplepit-7c4b8/us-central1/createContainerRowSection"; 
  private deleteContainerRowSectionURL = "http://localhost:5001/peoplepit-7c4b8/us-central1/deleteContainerRowSection"
  private deleteContainerRowSectionItemURL = "http://localhost:5001/peoplepit-7c4b8/us-central1/deleteContainerRowSectionItem"
  private updateContainerRowSectionItemURL = "http://localhost:5001/peoplepit-7c4b8/us-central1/updateContainerRowSectionItem"
  private createContainerRowSectionItemURL = "http://localhost:5001/peoplepit-7c4b8/us-central1/createContainerRowSectionItem"

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
  getContainer(field:string) { 
    let params = new HttpParams().set("containers",field);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      }),
      withCredentials: false,
      params: params
    };  
    
    return this.http.get<any[]>(this.getContainerURL, httpOptions);   
  }

  //UPDATE
  updateContainer(container:string, key:string, data:any) {
    console.log("Update Field Data => ", container, key, data);

    return this.http.post<any[]>(this.updateContainerURL, {
      collection: container,
      document: key,
      data: data
    });
  }


  createContainer(data:any) {
    return this.http.post<any[]>(this.createContainerURL, {
      data:data
    })
  }

  //DELETE CONTAINER
  deleteContainer(name:string) {
    let params = new HttpParams().set("document",name);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      }),
      withCredentials: false,
      params: params
    };  
    
    return this.http.get<any[]>(this.deleteContainerURL, httpOptions);   
  }

  //DELETE CONTAINER ROW
  deleteContainerRow(containerDoc:string, rowDoc:string) {
    let params = new HttpParams().set("container_document",containerDoc).set("row_document",rowDoc);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      }),
      withCredentials: false,
      params: params
    };  
    
    return this.http.get<any[]>(this.deleteContainerRowURL, httpOptions);   
  }
  
  //DELETE CONTAINER ROW SECTION
  deleteContainerRowSection(containerDoc:string, rowDoc:string, sectionDoc:string) {
    let params = new HttpParams().set("container_document",containerDoc).set("row_document", rowDoc).set("section_document", sectionDoc);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      }),
      withCredentials: false,
      params: params
    };  
    
    return this.http.get<any[]>(this.deleteContainerRowSectionURL, httpOptions); 
  }

  //DELETE CONTAINER ROW SECTION ITEM
  deleteContainerRowSectionItem(containerDoc:string, rowDoc:string, sectionDoc:string, itemDoc:string) {
    let params = new HttpParams().set("container_document",containerDoc).set("row_document", rowDoc).set("section_document", sectionDoc).set("item_document", itemDoc);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      }),
      withCredentials: false,
      params: params
    };  
    
    return this.http.get<any[]>(this.deleteContainerRowSectionItemURL, httpOptions);   }


  //UPDATE CONTAINER ROW ITEM
  updateContainerRow(containerDoc:string, rowDoc:string, data:any) {
    return this.http.post<any[]>(this.updateContainerRowURL, {
      containerDocument:containerDoc,
      rowDocument:rowDoc,
      data:data
    });
  }

  //UPDATE CONTAINER ROW SECTION
  updateContainerRowSection(containerDoc:string, rowDoc:string, sectionDoc:string, data:any) {
    return this.http.post<any[]>(this.updateContainerRowSectionURL, {
      containerDocument:containerDoc,
      rowDocument:rowDoc,
      sectionDocument:sectionDoc,
      data:data
    })
  }

  //CREATE CONTAINER ROW SECTION
  createContainerRowSection(containerDoc:string, rowDoc:string, data:any) {
    return this.http.post<any[]>(this.createContainerRowSectionURL, {
      containerDocument:containerDoc,
      rowDocument:rowDoc,
      data:data
    })
  }

  //CREATE CONTAINER ROW
  createContainerRow(containerDoc:string, data:any) {
    return this.http.post<any[]>(this.createContainerRowURL, {
      containerDocument:containerDoc,
      data:data
    })
  }

  //UPDATE CONTAINER ROW SECTION ITEM
  updateContainerRowSectionItem(containerDoc:string, rowDoc:string, sectionDoc:string, itemDoc:string, data:any) {
    return this.http.post<any[]>(this.updateContainerRowSectionItemURL, {
      containerDocument: containerDoc,
      rowDocument: rowDoc,
      sectionDocument: sectionDoc,
      itemDocument: itemDoc,
      data: data
    });
  }

  //CREATE CONTAINER ROW SECTION ITEM 
  createContainerRowSectionItem(containerDoc:string, rowDoc:string, sectionDoc:string, data:any) {
    return this.http.post<any[]>(this.createContainerRowSectionItemURL, {
      containerDocument: containerDoc,
      rowDocument: rowDoc,
      sectionDocument: sectionDoc,
      data: data
    });
  }
}
