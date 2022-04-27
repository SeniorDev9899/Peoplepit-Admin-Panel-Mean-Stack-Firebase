import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { Objects } from '../../../classes/objects';
import { ModalService } from './../../_modal';
import { FormGroup, FormControl } from '@angular/forms';
import { ObjectService } from 'src/app/services/object.service';

@Component({
  selector: 'app-object-admin',
  templateUrl: './object-admin.component.html',
  styleUrls: ['./object-admin.component.css']
})
export class ObjectAdminComponent implements OnInit {

  addNewObject:Boolean = false;
  updateObjectID:any;
  objectLabel:string;
  objectUniqueName:string;
  objectKeyName:string;
  formdata:FormGroup;

  constructor(
    private modalService: ModalService,
    private objectService: ObjectService
  ) { }

  @Input() Object: Objects[];
  @Output() objectChanged: EventEmitter<any> = new EventEmitter<any>();
  @Output() objectAdded: EventEmitter<any> = new EventEmitter<any>();

  ngOnInit(): void {
    this.formdata = new FormGroup({
      objectLabel: new FormControl(""),
      objectUniqueName: new FormControl(""),
      objectKeyName: new FormControl("")
   });
  }

  openModal(id:any, number:any) {
    this.modalService.open(id);
    if(number >= 0) {
      console.log("Number => ", number);
      console.log("Objects => ", this.Object[number]);
      this.updateObjectID = number;
      this.formdata = new FormGroup({
        objectLabel: new FormControl(this.Object[number].label),
        objectUniqueName: new FormControl(this.Object[number].name),
        objectKeyName: new FormControl(this.Object[number].key)
      });
    } else {
      this.formdata = new FormGroup({
        objectLabel: new FormControl(""),
        objectUniqueName: new FormControl(""),
        objectKeyName: new FormControl("")
      });
      this.addNewObject = true;
    }
  }

  closeModal(id:any) {
    this.modalService.close(id);
  }

  onClickSubmit(data:any) {
    this.objectLabel = data.objectLabel;
    this.objectUniqueName = data.objectUniqueName;
    this.objectKeyName = data.objectKeyName;
    console.log("Object Label => ", this.objectLabel);    
    console.log("Object Unique Name => ", this.objectUniqueName);
    console.log("Object Key Name => ", this.objectKeyName);
    if(this.addNewObject)
    {
      this.objectService
      .createObjectData("objects", {
        label: this.objectLabel,
        uniqueName: this.objectUniqueName,
        key: this.objectKeyName
      })
      .subscribe(obj => {
        console.log("Added Object => ", obj);
        let objectInfo:any = obj;
        this.objectAdded.emit({addedObject:objectInfo});
        this.closeModal("custom-modal-1");
      });
    } else {
      this.objectService
      .updateObjectData("objects", this.Object[this.updateObjectID].name, {label: this.objectLabel, uniqueName: this.objectUniqueName, key: this.objectKeyName})
      .subscribe(obj => {
        console.log("Returned Object => ", obj);
        let objectInfo:any = obj;
        this.objectChanged.emit({updatedObject: objectInfo, index: this.updateObjectID});
        this.closeModal("custom-modal-1");
      });
    }
  }
}
