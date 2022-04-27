import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Fields } from 'src/app/classes/fields';
import { ModalService } from './../../_modal';
import { FormGroup, FormControl } from '@angular/forms';
import { FieldService } from 'src/app/services/field.service';

@Component({
  selector: 'app-field-admin',
  templateUrl: './field-admin.component.html',
  styleUrls: ['./field-admin.component.css']
})
export class FieldAdminComponent implements OnInit {

  addNewField:Boolean = false;
  updateFieldID:any;
  fieldLabel:string;
  fieldUniqueName:string;
  fieldTypeName:string;
  fieldAutoComplete:Boolean;
  formdata:FormGroup;
  formoptiondata: FormGroup;
  optionLabel:string;
  optionName:string;
  options:any = [];  
  FieldOptions:any = [];
  alertMessage:Boolean = false;
  displayAutoComplete:Boolean = false;
  displayOptions:Boolean = false;

  uniqueName:string;
  label:string;


  constructor(
    private modalService: ModalService,
    private fieldService: FieldService
  ) { }

  @Input() Field: Fields[];
  @Output() fieldChanged: EventEmitter<any> = new EventEmitter<any>();
  @Output() fieldAdded: EventEmitter<any> = new EventEmitter<any>();
  @Output() fieldOptionAdded: EventEmitter<any> = new EventEmitter<any>();

  ngOnInit(): void {
    this.formdata = new FormGroup({
      fieldLabel: new FormControl(""),
      fieldUniqueName: new FormControl(""),
      fieldTypeName: new FormControl(""),
      fieldAutoComplete: new FormControl(false)
    });
    this.formoptiondata = new FormGroup({
      optionLabel: new FormControl(""),
      optionName: new FormControl("")
    });
    this.options = [
      {name: "date"},
      {name: "simpletext"},
      {name: "number"},
      {name: "singleselect"},
      {name: "multiselect"}, 
    ]
  }

  ngOnChanges(): void {
    console.log("Changed Fields => ", this.Field);
  }

  openModal(id:any, number:any) {
    this.alertMessage = false;
    if((this.addNewField) && (id === "custom-modal-2" && number < 0)) {
      if(!this.uniqueName || !this.label) {
        this.alertMessage = true;
      } else {
        this.modalService.open(id);
        this.alertMessage = false;
      }
    } else {
      this.modalService.open(id);
    }
    if(number >= 0) {
      console.log("Number => ", number);
      console.log("Fields => ", this.Field[number]);
      this.updateFieldID = number;
      this.FieldOptions = this.Field[number].options;
      this.addNewField = false;
      this.alertMessage = false;
      if(this.Field[number].type.includes("autocomplete")) {
        this.formdata = new FormGroup({
          fieldLabel: new FormControl(this.Field[number].label),
          fieldUniqueName: new FormControl(this.Field[number].name),
          fieldTypeName: new FormControl(this.Field[number].type.split("-")[0]+"select"),
          fieldAutoComplete: new FormControl(true)
        });
        this.displayAutoComplete = true;
        this.displayOptions = true;
      } else {
        if(this.Field[number].type.includes('singleselect') || this.Field[number].type.includes('multiselect'))
        {
          this.displayAutoComplete = true;
          this.displayOptions = true;
        } else {
          this.displayAutoComplete = false;
          this.displayOptions = false;
          this.FieldOptions = [];
        }
        this.formdata = new FormGroup({
          fieldLabel: new FormControl(this.Field[number].label),
          fieldUniqueName: new FormControl(this.Field[number].name),
          fieldTypeName: new FormControl(this.Field[number].type),
          fieldAutoComplete: new FormControl(false)
        });
      }      
    } else {
      if(id == "custom-modal-2") {        
        this.formoptiondata = new FormGroup({
          optionLabel: new FormControl(""),
          optionName: new FormControl("")
        });
      } else {
        this.formdata = new FormGroup({
          fieldLabel: new FormControl(""),
          fieldUniqueName: new FormControl(""),
          fieldTypeName: new FormControl(""),
          fieldAutoComplete: new FormControl(false)
        });
        this.FieldOptions = [];
        this.addNewField = true;
        this.displayAutoComplete = false;
        this.displayOptions = false;
      }
    }
  }

  closeModal(id:any) {
    this.modalService.close(id);
  }

  enableOptionInput() {
    this.alertMessage = false;
  }

  onClickSubmit(data:any) {
    this.fieldLabel = data.fieldLabel;
    this.fieldUniqueName = data.fieldUniqueName;
    this.fieldTypeName = data.fieldTypeName;
    this.fieldAutoComplete = data.fieldAutoComplete;
    if(this.fieldTypeName.includes('single') || this.fieldTypeName.includes('multi')) {
      if(this.fieldAutoComplete) {
        this.fieldTypeName = this.fieldTypeName.split("select")[0] + "-" + "autocomplete";
      }
    } 
    // if(this.fieldAutoComplete) {
      // if(!this.fieldTypeName.includes("autocomlete")) {
      //   this.fieldTypeName += "-";
      //   this.fieldTypeName += "autocomplete";
      // }
    // }
    console.log("Field Label => ", this.fieldLabel);    
    console.log("Field Unique Name => ", this.fieldUniqueName);
    console.log("Field Type Name => ", this.fieldTypeName);
    if(this.addNewField)
    {
      this.fieldService
      .createFieldData("fields", {
        label: this.fieldLabel,
        uniqueName: this.fieldUniqueName,
        type: this.fieldTypeName
      })
      .subscribe(fie => {
        console.log("Added Object => ", fie);
        let fieldInfo:any = fie;
        this.fieldAdded.emit({addedField:{...fieldInfo, options:this.FieldOptions}});
        this.closeModal("custom-modal-1");
      });
    } else {
      // , options: this.Field[this.updateFieldID].options
      this.fieldService
      .updateFieldData("fields", this.Field[this.updateFieldID].name, {label: this.fieldLabel, uniqueName: this.fieldUniqueName, type: this.fieldTypeName})
      .subscribe(fie => {
        console.log("Returned Field => ", fie);
        let fieldInfo:any = fie;
        this.fieldChanged.emit({updatedField: {...fieldInfo, options:this.FieldOptions}, index: this.updateFieldID});
        this.closeModal("custom-modal-1");
      });
    }
  }

  onClickSubmitOption(data:any) {
    this.optionLabel = data.optionLabel;
    this.optionName = data.optionName;
    if(this.addNewField) {
      console.log("uniqueName => ", this.uniqueName);
      if(this.uniqueName) {
        this.fieldService
        .createOptionField(this.uniqueName, {
          label: this.optionLabel,
          name: this.optionName
        })
        .subscribe(obj => {
          let optionInfo:any = obj;
          this.FieldOptions.push(optionInfo);
          // this.fieldOptionAdded.emit({addedOptionOfField:optionInfo, newFieldOption: true});
          this.closeModal("custom-modal-2");
        })
      }      
    } else {
      const docNameForUpdate = this.Field[this.updateFieldID].name;
      this.fieldService
      .createOptionField(docNameForUpdate, {
        label: this.optionLabel,
        name: this.optionName,
      })
      .subscribe(obj => {
        console.log("Added Option Of Field => ", obj);
        let optionInfo:any = obj;
        this.FieldOptions.push(optionInfo);
        // this.fieldOptionAdded.emit({addedOptionOfField:optionInfo, docID: this.updateFieldID});
        this.closeModal("custom-modal-2");
      });
    }
  }

  onChange(e:any) {
    if(e.target.value.includes('single') || e.target.value.includes('multi'))
    {
      if(this.addNewField == false) {
        let fieldName = this.Field[this.updateFieldID].name;
        console.log("Field Name => ", fieldName);
        this.fieldService
        .getOptionField(fieldName)
        .subscribe(opt => {
          console.log("Options => ", opt);
          this.FieldOptions = opt;
        });
      } else {
        this.FieldOptions = [];
      }
      this.displayAutoComplete = true;
      this.displayOptions = true;
    } else {
      this.displayAutoComplete = false;
      this.displayOptions = false;
    }
  }

}
