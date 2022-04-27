import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ModalService } from './../../_modal';
import { FormGroup, FormControl } from '@angular/forms';
import { ContainerService } from 'src/app/services/container.service';
declare var $:any;
@Component({
  selector: 'app-container-admin',
  templateUrl: './container-admin.component.html',
  styleUrls: ['./container-admin.component.css']
})
export class ContainerAdminComponent implements OnInit {

  containerLabel:string;
  containerUniqueName:string;
  containerWidth:string;
  rowLabel:string;
  rowWidth:string;
  rowUniqueName:string;
  rowOrder:string;
  rowAlignmentType:string;
  sectionLabel:string;
  sectionWidth:string;
  sectionUniqueName:string;
  sectionOrder:string;
  itemField:string;
  itemOrderNumber:string;
  label:string;
  uniqueName:string;
  width:string;
  formdataContainer:FormGroup;
  formdataRow:FormGroup;
  formdataSection:FormGroup;
  formdataItem:FormGroup;
  updateContainerID:number;
  updateContainerRowID:number;
  updateContainerRowSectionID:number;
  updateContainerRowSectionItemID:number;
  aligns:any[] = [];
  itemFields:any[] = [];
  deleteType:string;

  ContainerRows:any[] = [];
  ContainerRowSections:any[] = [];
  ContainerRowSectionItems:any[] = [];

  addNewItem:boolean = false;
  addNewSection:boolean = false;
  addNewRow:boolean = false;

  editSection:boolean = false;
  editRow:boolean = false;

  addNewContainer:boolean = false;
  editContainer:boolean = false;

  sectionLabelModel:string;
  sectionUniqueNameModel:string;

  rowLabelModel:string;
  rowWidthModel:string;
  rowUniqueNameModel:string;
  rowOrderModel:string;
  rowAlignmentTypeModel:string;

  containerLabelModel:string;
  containerUniqueNameModel:string;
  containerWidthModel:string;

  alertMessageForAddSection:boolean = false;
  alertMessageForAddRow:boolean = false;
  alertMessageForAddContainer:boolean = false;

  @Input() Container: any;
  @Output() updatedContainerInfo: EventEmitter<any> = new EventEmitter<any>();
  @Output() deletedContainerInfo: EventEmitter<any> = new EventEmitter<any>();
  @Output() createdContainerInfo:EventEmitter<any> = new EventEmitter<any>();
  @Output() updatedContainerRowInfo: EventEmitter<any> = new EventEmitter<any>();
  @Output() deletedContainerRowInfo: EventEmitter<any> = new EventEmitter<any>();
  @Output() deletedContainerRowSectionInfo: EventEmitter<any> = new EventEmitter<any>();
  @Output() updatedContainerRowSectionItemInfo: EventEmitter<any> = new EventEmitter<any>();
  @Output() updatedContainerRowSectionInfo: EventEmitter<any> = new EventEmitter<any>();  

  constructor(
    private modalService:ModalService,
    private containerService:ContainerService
  ) { }

  ngOnInit(): void {
    this.formdataContainer = new FormGroup({
      containerLabel: new FormControl(""),
      containerUniqueName: new FormControl(""),
      containerWidth: new FormControl(""),
    });
    this.formdataRow = new FormGroup({
      rowLabel: new FormControl(""),
      rowWidth: new FormControl(""),
      rowUniqueName: new FormControl(""),
      rowOrder: new FormControl(""),
      rowAlignmentType: new FormControl("")
    });
    this.formdataSection = new FormGroup({
      sectionLabel: new FormControl(""),
      sectionWidth: new FormControl(""),
      sectionUniqueName: new FormControl(""),
      sectionOrder: new FormControl("")
    });
    this.formdataItem = new FormGroup({
      itemField: new FormControl(""),
      itemOrderNumber: new FormControl("")
    });
    this.aligns = [
      {name: "space-evenly"},
      {name: "space-around"},
      {name: "space-between"},
      {name: "start"},
      {name: "center"}
    ];
    this.itemFields = [
      { name: "First Name" },
      { name: "Last Name" },
      { name: "Address" },
      { name: "Nationalities" },
      { name: "Bloodtype" },
      { name: "Dob" },
      { name: "Gender" },
    ]
  }

  openModal(id:string, number:any, deleteID:any = "") {
    if(number >= 0) {
      if(id == "custom-modal-2") {
        this.addNewRow = false;
        this.editRow = true;
        this.alertMessageForAddRow = false;
        this.updateContainerRowID = number;
        this.formdataRow = new FormGroup({
          rowLabel: new FormControl(this.Container[this.updateContainerID].rows[this.updateContainerRowID].label),
          rowWidth: new FormControl(this.Container[this.updateContainerID].rows[this.updateContainerRowID].width + "%"),
          rowUniqueName: new FormControl(this.Container[this.updateContainerID].rows[this.updateContainerRowID].name),
          rowOrder: new FormControl(this.Container[this.updateContainerID].rows[this.updateContainerRowID].order),
          rowAlignmentType: new FormControl(this.Container[this.updateContainerID].rows[this.updateContainerRowID].align)
        });
        this.ContainerRowSections = this.Container[this.updateContainerID].rows[this.updateContainerRowID].sections;
      } else if(id == "custom-modal-3") {
        this.addNewSection = false;
        this.editSection = true;
        this.alertMessageForAddSection = false;
        this.updateContainerRowSectionID = number;
        this.formdataSection = new FormGroup({
          sectionLabel: new FormControl(this.Container[this.updateContainerID].rows[this.updateContainerRowID].sections[this.updateContainerRowSectionID].label),
          sectionWidth: new FormControl(this.Container[this.updateContainerID].rows[this.updateContainerRowID].sections[this.updateContainerRowSectionID].width + "%"),
          sectionUniqueName: new FormControl(this.Container[this.updateContainerID].rows[this.updateContainerRowID].sections[this.updateContainerRowSectionID].name),
          sectionOrder: new FormControl(this.Container[this.updateContainerID].rows[this.updateContainerRowID].sections[this.updateContainerRowSectionID].order)
        });
        this.ContainerRowSectionItems = this.Container[this.updateContainerID].rows[this.updateContainerRowID].sections[this.updateContainerRowSectionID].items;
        console.log("Test ~~~ ", this.ContainerRowSectionItems);
        this.ContainerRowSectionItems = this.ContainerRowSectionItems.map(doc => {
          var itemLabel:string = "";
          if(doc.name == "firstname" || doc.name == "lastname")
          {
            let name = "name".charAt(0).toUpperCase() + "name".slice(1);
            if(doc.name == "firstname")
            {
              let first = "first".charAt(0).toUpperCase() + "first".slice(1);   
              itemLabel = first + " " + name;         
            } else if(doc.name == "lastname") {
              let second = "last".charAt(0).toUpperCase() + "last".slice(1);
              itemLabel = second + " " + name;
            }
          } else {
            itemLabel = doc.name.charAt(0).toUpperCase() + doc.name.slice(1);
          }
          return {
            label: itemLabel,
            name: doc.name,
            order: doc.order
          }
        });
      } else if(id == "custom-modal-4") {
        this.editContainer = true;
        this.addNewContainer = false;
        this.alertMessageForAddContainer = false;
        this.updateContainerID = number;
        this.formdataContainer = new FormGroup({
          containerLabel: new FormControl(this.Container[this.updateContainerID].label),
          containerUniqueName: new FormControl(this.Container[this.updateContainerID].name),
          containerWidth: new FormControl(this.Container[this.updateContainerID].width + "%"),
        });
        this.ContainerRows = this.Container[this.updateContainerID].rows;
      } else if(id == "custom-modal-5") {
        this.addNewItem = false;
        this.updateContainerRowSectionItemID = number;   
        let labelCreation;    
        if(this.addNewSection == true) 
        {
          labelCreation = this.ContainerRowSectionItems[this.updateContainerRowSectionItemID];
        } else if(this.editSection == true)
        {
          labelCreation = this.Container[this.updateContainerID].rows[this.updateContainerRowID].sections[this.updateContainerRowSectionID].items[this.updateContainerRowSectionItemID];
        }
        let itemLabel:any;
        if(labelCreation.name == "firstname" || labelCreation.name == "lastname")
        {
          let name = "name".charAt(0).toUpperCase() + "name".slice(1);
          if(labelCreation.name == "firstname")
          {
            let first = "first".charAt(0).toUpperCase() + "first".slice(1);   
            itemLabel = first + " " + name;         
          } else if(labelCreation.name == "lastname") {
            let second = "last".charAt(0).toUpperCase() + "last".slice(1);
            itemLabel = second + " " + name;
          }
        } else {
          itemLabel = labelCreation.name.charAt(0).toUpperCase() + labelCreation.name.slice(1);
        }
        if(this.addNewSection == true)
        {
          this.formdataItem = new FormGroup({
            itemField: new FormControl(itemLabel),
            itemOrderNumber: new FormControl(this.ContainerRowSectionItems[this.updateContainerRowSectionItemID].order)
          });
        } else if(this.editSection == true)
        {
          this.formdataItem = new FormGroup({
            itemField: new FormControl(itemLabel),
            itemOrderNumber: new FormControl(this.Container[this.updateContainerID].rows[this.updateContainerRowID].sections[this.updateContainerRowSectionID].items[this.updateContainerRowSectionItemID].order)
          });
        }        
      } else if(id == "custom-delete-modal") {
        if(deleteID == "container")
        {
          this.updateContainerID = number;
          this.deleteType = "container";
        } else if(deleteID == "row")
        {
          this.updateContainerRowID = number;
          this.deleteType = "row";
        } else if(deleteID == "section")
        {
          this.updateContainerRowSectionID = number;
          this.deleteType = "section";
        } else if(deleteID == 'item')
        {
          this.updateContainerRowSectionItemID = number;
          this.deleteType = "item";
        }
      }
    } else {
      if(id == "custom-modal-5") {
        this.addNewItem = true;
        this.formdataItem = new FormGroup({
          itemField: new FormControl(""),
          itemOrderNumber: new FormControl("")
        });
        if(this.addNewSection == true) {
          if(!this.sectionLabelModel || !this.sectionUniqueNameModel) {
            this.alertMessageForAddSection = true;
            $("#custom-modal-5").addClass("display-none");
            $("#custom-modal-5").removeClass("display-static");
          } else {
            this.alertMessageForAddSection = false;
            $("#custom-modal-5").removeClass("display-none");
            $("#custom-modal-5").addClass("display-static");
          }
        }
        if(this.editSection == true) {
          $("#custom-modal-5").removeClass("display-none");
          $("#custom-modal-5").addClass("display-static");
        }
      } else if(id == "custom-modal-3") {
        this.addNewSection = true;
        this.editSection = false;
        this.formdataSection = new FormGroup({
          sectionLabel: new FormControl(""),
          sectionWidth: new FormControl(""),
          sectionUniqueName: new FormControl(""),
          sectionOrder: new FormControl("")
        });
        this.ContainerRowSectionItems = [];
        if(this.addNewRow == true)
        {
          if(!this.rowLabelModel || !this.rowUniqueNameModel) {
            this.alertMessageForAddRow = true;
            $("#custom-modal-3").addClass("display-none");
            $("#custom-modal-3").removeClass("display-static");
          } else {
            this.alertMessageForAddRow = false;
            $("#custom-modal-3").removeClass("display-none");
            $("#custom-modal-3").addClass("display-static");
          }
        } else if(this.editRow == true)
        {
          $("#custom-modal-3").removeClass("display-none");
          $("#custom-modal-3").addClass("display-static");
        }
      } else if(id == "custom-modal-2")
      {
        this.addNewRow = true;
        this.editRow = false;
        this.formdataRow = new FormGroup({
          rowLabel: new FormControl(""),
          rowWidth: new FormControl(""),
          rowUniqueName: new FormControl(""),
          rowOrder: new FormControl(""),
          rowAlignmentType: new FormControl("")
        });
        this.ContainerRowSections = []; 
        if(this.addNewContainer == true)
        {
          if(!this.containerLabelModel || !this.containerUniqueNameModel) {
            this.alertMessageForAddContainer = true;
            $("#custom-modal-2").addClass("display-none");
            $("#custom-modal-2").removeClass("display-static");
          } else {
            this.alertMessageForAddContainer = false;
            $("#custom-modal-2").removeClass("display-none");
            $("#custom-modal-2").addClass("display-static");
          }
        } else if(this.editContainer == true)
        {
          $("#custom-modal-2").removeClass("display-none");
          $("#custom-modal-2").addClass("display-static");
        }
      } else if(id == "custom-modal-4")
      {
        this.addNewContainer = true;
        this.editContainer = false;
        this.formdataContainer = new FormGroup({
          containerLabel: new FormControl(""),
          containerUniqueName: new FormControl(""),
          containerWidth: new FormControl(""),
        });
        this.ContainerRows = [];
      }
    }   
    this.modalService.open(id);
  }

  closeModal(id:any) {
    this.modalService.close(id);
  }

  onClickSubmit(data:any) {
    if(this.addNewContainer == true)
    {
      this.containerService.createContainer(
        {
          label:data.containerLabel, 
          name:data.containerUniqueName, 
          width:data.containerWidth.split("%")[0],
          align:"center",
        }     
      ).subscribe(con => {
        console.log("Updated Container Info => ", con);
        this.createdContainerInfo.emit({allContainers: con});
      });
    } else if(this.editContainer == true)
    {
      this.containerService.updateContainer(
        "containers", 
        this.Container[this.updateContainerID].name, 
        {
          label:data.containerLabel, 
          name:data.containerUniqueName, 
          width:data.containerWidth.split("%")[0],
          align:"center",
          rows:this.ContainerRows
        }     
      ).subscribe(con => {
        console.log("Updated Container Info => ", con);
        this.updatedContainerInfo.emit({updatedContainer: con, id:this.updateContainerID});
      });
    }
    this.closeModal("custom-modal-4");
  }

  onClickSubmitRow(data:any) {
    console.log("Rows => ", data);
    if(this.addNewRow == true)
    {
      if(this.addNewContainer == true)
      {
        this.containerService.createContainerRow(
          this.containerUniqueNameModel,
          {
            label: data.rowLabel,
            align: data.rowAlignmentType,
            order: data.rowOrder,
            width: data.rowWidth.split("%")[0],
            name: data.rowUniqueName
          }
        ).subscribe(crow => {
          console.log("Added Container Row => ", crow);
          // this.Container[this.updateContainerID].rows = crow;
          // this.ContainerRows = this.Container[this.updateContainerID].rows;
          this.ContainerRows = crow;
        });
      } else if(this.editContainer == true)
      {
        this.containerService.createContainerRow(
          this.Container[this.updateContainerID].name,
          {
            label: data.rowLabel,
            align: data.rowAlignmentType,
            order: data.rowOrder,
            width: data.rowWidth.split("%")[0],
            name: data.rowUniqueName
          }
        ).subscribe(crow => {
          console.log("Added Container Row => ", crow);
          this.Container[this.updateContainerID].rows = crow;
          this.ContainerRows = this.Container[this.updateContainerID].rows;
        }); 
      }
    } else if(this.editRow == true)
    {
      this.containerService.updateContainerRow(
        this.Container[this.updateContainerID].name,
        this.Container[this.updateContainerID].rows[this.updateContainerRowID].name,
        {
          label: data.rowLabel,
          align: data.rowAlignmentType,
          order: data.rowOrder,
          width: data.rowWidth.split("%")[0],
          name: data.rowUniqueName
        }
      ).subscribe(crow => {
        console.log("Updated Container Row => ", crow);
        this.updatedContainerRowInfo.emit({updatedContainerRow: crow, coID:this.updateContainerID, corID:this.updateContainerRowID});
      });
    }
    this.closeModal('custom-modal-2');
  }

  onClickSubmitSection(data:any) {
    console.log("Sections => ", data);
    if(this.addNewSection == true)
    {
      if(this.addNewRow == true)
      {
        if(this.addNewContainer == true)
        {
          this.containerService.createContainerRowSection(
            this.containerUniqueNameModel,
            this.rowUniqueNameModel,
            {
              label:data.sectionLabel,
              width:data.sectionWidth.split("%")[0],
              name:data.sectionUniqueName,
              order:data.sectionOrder
            }
          ).subscribe((secs) => {
            console.log("All Sections => ", secs);
            // this.Container[this.updateContainerID].rows[this.updateContainerRowID].sections = secs;
            // this.ContainerRowSections = this.Container[this.updateContainerID].rows[this.updateContainerRowID].sections;
            this.ContainerRowSections = secs;
          });
        } else if(this.editContainer == true)
        {
          this.containerService.createContainerRowSection(
            this.Container[this.updateContainerID].name,
            this.rowUniqueNameModel,
            {
              label:data.sectionLabel,
              width:data.sectionWidth.split("%")[0],
              name:data.sectionUniqueName,
              order:data.sectionOrder
            }
          ).subscribe((secs) => {
            console.log("All Sections => ", secs);
            // this.Container[this.updateContainerID].rows[this.updateContainerRowID].sections = secs;
            // this.ContainerRowSections = this.Container[this.updateContainerID].rows[this.updateContainerRowID].sections;
            this.ContainerRowSections = secs;
          });
        }
      } else if(this.editRow == true)
      {
        this.containerService.createContainerRowSection(
          this.Container[this.updateContainerID].name,
          this.Container[this.updateContainerID].rows[this.updateContainerRowID].name,
          {
            label:data.sectionLabel,
            width:data.sectionWidth.split("%")[0],
            name:data.sectionUniqueName,
            order:data.sectionOrder
          }
        ).subscribe((secs) => {
          console.log("All Sections => ", secs);
          this.Container[this.updateContainerID].rows[this.updateContainerRowID].sections = secs;
          this.ContainerRowSections = this.Container[this.updateContainerID].rows[this.updateContainerRowID].sections;
        });
      }      
    } else if(this.editSection == true) {
      this.containerService.updateContainerRowSection(
        this.Container[this.updateContainerID].name,
        this.Container[this.updateContainerID].rows[this.updateContainerRowID].name,
        this.Container[this.updateContainerID].rows[this.updateContainerRowID].sections[this.updateContainerRowSectionID].name,
        {
          label:data.sectionLabel,
          width:data.sectionWidth.split("%")[0],
          name:data.sectionUniqueName,
          order:data.sectionOrder
        }
      ).subscribe((sec) => {
        console.log("Updated Section info => ", sec);
        this.updatedContainerRowSectionInfo.emit({updatedContainerRowSection:sec, coID:this.updateContainerID, corID:this.updateContainerRowID, corsID:this.updateContainerRowSectionID});
      });
    }
    this.closeModal('custom-modal-3');
  }

  onClickSubmitItem(data:any) {

    let itemName:any;
    if(data.itemField.split(" ").length == 2) {
      let first = data.itemField.split(" ")[0].charAt(0).toLowerCase() + data.itemField.split(" ")[0].slice(1);
      let second = data.itemField.split(" ")[1].charAt(0).toLowerCase() + data.itemField.split(" ")[1].slice(1);
      itemName = first + second;
    } else {
      itemName = data.itemField.charAt(0).toLowerCase() + data.itemField.slice(1);
    }
    console.log("Item Name => ", itemName);
    // console.log("Data => ", data);
    // console.log("container ID => ", this.updateContainerID);
    // console.log("container Row ID => ", this.updateContainerRowID);
    // console.log("container Row Section ID => ", this.updateContainerRowSectionID);
    // console.log("container Row Section Item ID => ", this.updateContainerRowSectionItemID);
    // console.log("First Container Row Section Item Data => ", this.Container[this.updateContainerID].rows[this.updateContainerRowID].sections[this.updateContainerRowSectionID].items[this.updateContainerRowSectionItemID]);
    if(this.addNewItem) {
      if(this.addNewSection == true)
      {
        if(this.addNewRow == true)
        {
          if(this.addNewContainer == true)
          {
            this.containerService.createContainerRowSectionItem(
              this.containerUniqueNameModel,
              this.rowUniqueNameModel,
              this.sectionUniqueNameModel,
              {
                name: itemName,
                order: data.itemOrderNumber
              }
            ).subscribe((crsi:any) => {
              console.log("Added Item => ", crsi);
              this.ContainerRowSectionItems = crsi.allItems;
              // this.Container[this.updateContainerID].rows[this.updateContainerRowID].sections[this.updateContainerRowSectionID].items = crsi.allItems;
              // this.ContainerRowSectionItems = this.Container[this.updateContainerID].rows[this.updateContainerRowID].sections[this.updateContainerRowSectionID].items;
              this.ContainerRowSectionItems = this.ContainerRowSectionItems.map(doc => {
                var itemLabel:string = "";
                if(doc.name == "firstname" || doc.name == "lastname")
                {
                  let name = "name".charAt(0).toUpperCase() + "name".slice(1);
                  if(doc.name == "firstname")
                  {
                    let first = "first".charAt(0).toUpperCase() + "first".slice(1);   
                    itemLabel = first + " " + name;         
                  } else if(doc.name == "lastname") {
                    let second = "last".charAt(0).toUpperCase() + "last".slice(1);
                    itemLabel = second + " " + name;
                  }
                } else {
                  itemLabel = doc.name.charAt(0).toUpperCase() + doc.name.slice(1);
                }
                return {
                  label: itemLabel,
                  name: doc.name,
                  order: doc.order
                }
              });
            });
          } else if(this.editContainer == true)
          {
            this.containerService.createContainerRowSectionItem(
              this.Container[this.updateContainerID].name,
              this.rowUniqueNameModel,
              this.sectionUniqueNameModel,
              {
                name: itemName,
                order: data.itemOrderNumber
              }
            ).subscribe((crsi:any) => {
              console.log("Added Item => ", crsi);
              this.ContainerRowSectionItems = crsi.allItems;
              // this.Container[this.updateContainerID].rows[this.updateContainerRowID].sections[this.updateContainerRowSectionID].items = crsi.allItems;
              // this.ContainerRowSectionItems = this.Container[this.updateContainerID].rows[this.updateContainerRowID].sections[this.updateContainerRowSectionID].items;
              this.ContainerRowSectionItems = this.ContainerRowSectionItems.map(doc => {
                var itemLabel:string = "";
                if(doc.name == "firstname" || doc.name == "lastname")
                {
                  let name = "name".charAt(0).toUpperCase() + "name".slice(1);
                  if(doc.name == "firstname")
                  {
                    let first = "first".charAt(0).toUpperCase() + "first".slice(1);   
                    itemLabel = first + " " + name;         
                  } else if(doc.name == "lastname") {
                    let second = "last".charAt(0).toUpperCase() + "last".slice(1);
                    itemLabel = second + " " + name;
                  }
                } else {
                  itemLabel = doc.name.charAt(0).toUpperCase() + doc.name.slice(1);
                }
                return {
                  label: itemLabel,
                  name: doc.name,
                  order: doc.order
                }
              });
            });
          }
        } else if(this.editRow == true)
        {
          this.containerService.createContainerRowSectionItem(
            this.Container[this.updateContainerID].name,
            this.Container[this.updateContainerID].rows[this.updateContainerRowID].name,
            this.sectionUniqueNameModel,
            {
              name: itemName,
              order: data.itemOrderNumber
            }
          ).subscribe((crsi:any) => {
            console.log("Added Item => ", crsi);
            this.ContainerRowSectionItems = crsi.allItems;
            // this.Container[this.updateContainerID].rows[this.updateContainerRowID].sections[this.updateContainerRowSectionID].items = crsi.allItems;
            // this.ContainerRowSectionItems = this.Container[this.updateContainerID].rows[this.updateContainerRowID].sections[this.updateContainerRowSectionID].items;
            this.ContainerRowSectionItems = this.ContainerRowSectionItems.map(doc => {
              var itemLabel:string = "";
              if(doc.name == "firstname" || doc.name == "lastname")
              {
                let name = "name".charAt(0).toUpperCase() + "name".slice(1);
                if(doc.name == "firstname")
                {
                  let first = "first".charAt(0).toUpperCase() + "first".slice(1);   
                  itemLabel = first + " " + name;         
                } else if(doc.name == "lastname") {
                  let second = "last".charAt(0).toUpperCase() + "last".slice(1);
                  itemLabel = second + " " + name;
                }
              } else {
                itemLabel = doc.name.charAt(0).toUpperCase() + doc.name.slice(1);
              }
              return {
                label: itemLabel,
                name: doc.name,
                order: doc.order
              }
            });
          });
        }
      } else if(this.editSection == true) {
        this.containerService.createContainerRowSectionItem(
          this.Container[this.updateContainerID].name,
          this.Container[this.updateContainerID].rows[this.updateContainerRowID].name,
          this.Container[this.updateContainerID].rows[this.updateContainerRowID].sections[this.updateContainerRowSectionID].name,
          {
            name: itemName,
            order: data.itemOrderNumber
          }
        ).subscribe((crsi:any) => {
          console.log("Added Item => ", crsi);
          this.Container[this.updateContainerID].rows[this.updateContainerRowID].sections[this.updateContainerRowSectionID].items = crsi.allItems;
          this.ContainerRowSectionItems = this.Container[this.updateContainerID].rows[this.updateContainerRowID].sections[this.updateContainerRowSectionID].items;
          this.ContainerRowSectionItems = this.ContainerRowSectionItems.map(doc => {
            var itemLabel:string = "";
            if(doc.name == "firstname" || doc.name == "lastname")
            {
              let name = "name".charAt(0).toUpperCase() + "name".slice(1);
              if(doc.name == "firstname")
              {
                let first = "first".charAt(0).toUpperCase() + "first".slice(1);   
                itemLabel = first + " " + name;         
              } else if(doc.name == "lastname") {
                let second = "last".charAt(0).toUpperCase() + "last".slice(1);
                itemLabel = second + " " + name;
              }
            } else {
              itemLabel = doc.name.charAt(0).toUpperCase() + doc.name.slice(1);
            }
            return {
              label: itemLabel,
              name: doc.name,
              order: doc.order
            }
          });
        });
      }
    } else {
      if(this.addNewSection)
      {
        this.containerService.updateContainerRowSectionItem(
          this.Container[this.updateContainerID].name,
          this.Container[this.updateContainerID].rows[this.updateContainerRowID].name,
          this.sectionUniqueNameModel,
          this.ContainerRowSectionItems[this.updateContainerRowSectionItemID].name,
          {
            name: itemName,
            order: data.itemOrderNumber
          }
        ).subscribe((crsi:any) => {
          console.log("Container Row Section Item => ", crsi);
          let itemLabel:any;
          if(crsi.name == "firstname" || crsi.name == "lastname")
          {
            let name = "name".charAt(0).toUpperCase() + "name".slice(1);
            if(crsi.name == "firstname")
            {
              let first = "first".charAt(0).toUpperCase() + "first".slice(1);   
              itemLabel = first + " " + name;         
            } else if(crsi.name == "lastname") {
              let second = "last".charAt(0).toUpperCase() + "last".slice(1);
              itemLabel = second + " " + name;
            }
          } else {
            itemLabel = crsi.name.charAt(0).toUpperCase() + crsi.name.slice(1);
          }
          this.formdataItem = new FormGroup({
            itemField: new FormControl(itemLabel),
            itemOrderNumber: new FormControl(crsi.order)
          });
          const items = crsi.allItems.map((doc:any) => {
            let itemLabel:any;
            if(doc.name == "firstname" || doc.name == "lastname")
            {
              let name = "name".charAt(0).toUpperCase() + "name".slice(1);
              if(doc.name == "firstname")
              {
                let first = "first".charAt(0).toUpperCase() + "first".slice(1);   
                itemLabel = first + " " + name;         
              } else if(doc.name == "lastname") {
                let second = "last".charAt(0).toUpperCase() + "last".slice(1);
                itemLabel = second + " " + name;
              }
            } else {
              itemLabel = doc.name.charAt(0).toUpperCase() + doc.name.slice(1);
            }
            return {
              label:itemLabel,
              name:doc.name,
              order:doc.order
            }
          });
          this.ContainerRowSectionItems = items;
          // this.updatedContainerRowSectionItemInfo.emit(
          //   {
          //     updatedItemInfos:items, 
          //     containerID:this.updateContainerID,
          //     rowID:this.updateContainerRowID,
          //     sectionID:this.updateContainerRowSectionID,
          //   }
          // );
        });
      } else if(this.editSection == true)
      {
        this.containerService.updateContainerRowSectionItem(
          this.Container[this.updateContainerID].name,
          this.Container[this.updateContainerID].rows[this.updateContainerRowID].name,
          this.Container[this.updateContainerID].rows[this.updateContainerRowID].sections[this.updateContainerRowSectionID].name,
          this.Container[this.updateContainerID].rows[this.updateContainerRowID].sections[this.updateContainerRowSectionID].items[this.updateContainerRowSectionItemID].name,
          {
            name: itemName,
            order: data.itemOrderNumber
          }
        ).subscribe((crsi:any) => {
          console.log("Container Row Section Item => ", crsi);
          let itemLabel:any;
          if(crsi.name == "firstname" || crsi.name == "lastname")
          {
            let name = "name".charAt(0).toUpperCase() + "name".slice(1);
            if(crsi.name == "firstname")
            {
              let first = "first".charAt(0).toUpperCase() + "first".slice(1);   
              itemLabel = first + " " + name;         
            } else if(crsi.name == "lastname") {
              let second = "last".charAt(0).toUpperCase() + "last".slice(1);
              itemLabel = second + " " + name;
            }
          } else {
            itemLabel = crsi.name.charAt(0).toUpperCase() + crsi.name.slice(1);
          }
          this.formdataItem = new FormGroup({
            itemField: new FormControl(itemLabel),
            itemOrderNumber: new FormControl(crsi.order)
          });
          const items = crsi.allItems.map((doc:any) => {
            let itemLabel:any;
            if(doc.name == "firstname" || doc.name == "lastname")
            {
              let name = "name".charAt(0).toUpperCase() + "name".slice(1);
              if(doc.name == "firstname")
              {
                let first = "first".charAt(0).toUpperCase() + "first".slice(1);   
                itemLabel = first + " " + name;         
              } else if(doc.name == "lastname") {
                let second = "last".charAt(0).toUpperCase() + "last".slice(1);
                itemLabel = second + " " + name;
              }
            } else {
              itemLabel = doc.name.charAt(0).toUpperCase() + doc.name.slice(1);
            }
            return {
              label:itemLabel,
              name:doc.name,
              order:doc.order
            }
          });
          this.ContainerRowSectionItems = items;
          this.updatedContainerRowSectionItemInfo.emit(
            {
              updatedItemInfos:items, 
              containerID:this.updateContainerID,
              rowID:this.updateContainerRowID,
              sectionID:this.updateContainerRowSectionID,
            }
          );
        }); 
      }
    }
    this.closeModal("custom-modal-5");
  }

  onChange(e:any) {
    console.log("align type changed => ", e.target.value);
  }

  deleteDocument() {
    if(this.deleteType == "container")
    {
      this.containerService.deleteContainer(this.Container[this.updateContainerID].name)
      .subscribe((cot) => {
        console.log("Deleted Containers => ", cot);
        this.deletedContainerInfo.emit({deletedContainers: cot});
      });
    } else if(this.deleteType == "row")
    {
      if(this.addNewContainer == true)
      {
        this.containerService.deleteContainerRow(this.containerUniqueNameModel, this.Container[this.updateContainerID].rows[this.updateContainerRowID].name)
        .subscribe((crow) => {
          console.log("Deleted Container Row => ", crow);
          // this.deletedContainerRowInfo.emit({deletedContainerRows: crow, id:this.updateContainerID});
          // this.Container[this.updateContainerID].rows = crow;
          // this.ContainerRows = this.Container[this.updateContainerID].rows;
          this.ContainerRows = crow;
        });
      } else if(this.editContainer == true)
      {
        this.containerService.deleteContainerRow(this.Container[this.updateContainerID].name, this.Container[this.updateContainerID].rows[this.updateContainerRowID].name)
        .subscribe((crow) => {
          console.log("Deleted Container Row => ", crow);
          // this.deletedContainerRowInfo.emit({deletedContainerRows: crow, id:this.updateContainerID});
          this.Container[this.updateContainerID].rows = crow;
          this.ContainerRows = this.Container[this.updateContainerID].rows;
        });
      }      
    } else if(this.deleteType == "section")
    {
      if(this.addNewRow == true)
      {
        if(this.addNewContainer == true)
        {
          this.containerService.deleteContainerRowSection(
            this.containerUniqueNameModel, 
            this.rowUniqueNameModel,
            this.Container[this.updateContainerID].rows[this.updateContainerRowID].sections[this.updateContainerRowSectionID].name
          ).subscribe((crsec) => {
            console.log("Deleted Container Section => ", crsec);
            // this.deletedContainerRowSectionInfo.emit({deletedContainerRowSections: crsec, containerID: this.updateContainerRowID, rowID: this.updateContainerRowSectionID});
            // this.Container[this.updateContainerID].rows[this.updateContainerRowID].sections = crsec;
            // this.ContainerRowSections = this.Container[this.updateContainerID].rows[this.updateContainerRowID].sections;
            this.ContainerRowSections = crsec;
          });
        } else if(this.editContainer == true)
        {
          this.containerService.deleteContainerRowSection(
            this.Container[this.updateContainerID].name, 
            this.rowUniqueNameModel,
            this.Container[this.updateContainerID].rows[this.updateContainerRowID].sections[this.updateContainerRowSectionID].name
          ).subscribe((crsec) => {
            console.log("Deleted Container Section => ", crsec);
            // this.deletedContainerRowSectionInfo.emit({deletedContainerRowSections: crsec, containerID: this.updateContainerRowID, rowID: this.updateContainerRowSectionID});
            // this.Container[this.updateContainerID].rows[this.updateContainerRowID].sections = crsec;
            // this.ContainerRowSections = this.Container[this.updateContainerID].rows[this.updateContainerRowID].sections;
            this.ContainerRowSections = crsec;
          });
        }
      } else if(this.editRow == true)
      {
        this.containerService.deleteContainerRowSection(
          this.Container[this.updateContainerID].name, 
          this.Container[this.updateContainerID].rows[this.updateContainerRowID].name,
          this.Container[this.updateContainerID].rows[this.updateContainerRowID].sections[this.updateContainerRowSectionID].name
        ).subscribe((crsec) => {
          console.log("Deleted Container Section => ", crsec);
          // this.deletedContainerRowSectionInfo.emit({deletedContainerRowSections: crsec, containerID: this.updateContainerRowID, rowID: this.updateContainerRowSectionID});
          this.Container[this.updateContainerID].rows[this.updateContainerRowID].sections = crsec;
          this.ContainerRowSections = this.Container[this.updateContainerID].rows[this.updateContainerRowID].sections;
        });
      }
    } else if(this.deleteType == "item")
    {
      if(this.addNewSection == true)
      {
        if(this.addNewRow == true)
        {
          if(this.addNewContainer == true)
          {
            this.containerService.deleteContainerRowSectionItem(
              this.containerUniqueNameModel,
              this.rowUniqueNameModel,
              this.sectionUniqueNameModel,
              this.ContainerRowSectionItems[this.updateContainerRowSectionItemID].name
            ).subscribe((crsitem) => {
              console.log("Deleted Container Section Item => ", crsitem);
              const items = crsitem.map((doc:any) => {
                let itemLabel:any;
                if(doc.name == "firstname" || doc.name == "lastname")
                {
                  let name = "name".charAt(0).toUpperCase() + "name".slice(1);
                  if(doc.name == "firstname")
                  {
                    let first = "first".charAt(0).toUpperCase() + "first".slice(1);   
                    itemLabel = first + " " + name;         
                  } else if(doc.name == "lastname") {
                    let second = "last".charAt(0).toUpperCase() + "last".slice(1);
                    itemLabel = second + " " + name;
                  }
                } else {
                  itemLabel = doc.name.charAt(0).toUpperCase() + doc.name.slice(1);
                }
                return {
                  label:itemLabel,
                  name:doc.name,
                  order:doc.order
                }
              });
              // this.Container[this.updateContainerID].rows[this.updateContainerRowID].sections[this.updateContainerRowSectionID].items = items;
              // this.ContainerRowSectionItems = this.Container[this.updateContainerID].rows[this.updateContainerRowID].sections[this.updateContainerRowSectionID].items;
              this.ContainerRowSectionItems = items;
            });
          } else if(this.editContainer == true)
          {
            this.containerService.deleteContainerRowSectionItem(
              this.Container[this.updateContainerID].name,
              this.rowUniqueNameModel,
              this.sectionUniqueNameModel,
              this.ContainerRowSectionItems[this.updateContainerRowSectionItemID].name
            ).subscribe((crsitem) => {
              console.log("Deleted Container Section Item => ", crsitem);
              const items = crsitem.map((doc:any) => {
                let itemLabel:any;
                if(doc.name == "firstname" || doc.name == "lastname")
                {
                  let name = "name".charAt(0).toUpperCase() + "name".slice(1);
                  if(doc.name == "firstname")
                  {
                    let first = "first".charAt(0).toUpperCase() + "first".slice(1);   
                    itemLabel = first + " " + name;         
                  } else if(doc.name == "lastname") {
                    let second = "last".charAt(0).toUpperCase() + "last".slice(1);
                    itemLabel = second + " " + name;
                  }
                } else {
                  itemLabel = doc.name.charAt(0).toUpperCase() + doc.name.slice(1);
                }
                return {
                  label:itemLabel,
                  name:doc.name,
                  order:doc.order
                }
              });
              // this.Container[this.updateContainerID].rows[this.updateContainerRowID].sections[this.updateContainerRowSectionID].items = items;
              // this.ContainerRowSectionItems = this.Container[this.updateContainerID].rows[this.updateContainerRowID].sections[this.updateContainerRowSectionID].items;
              this.ContainerRowSectionItems = items;
            });
          }
        } else if(this.editRow == true)
        {
          this.containerService.deleteContainerRowSectionItem(
            this.Container[this.updateContainerID].name,
            this.Container[this.updateContainerID].rows[this.updateContainerRowID].name,
            this.sectionUniqueNameModel,
            this.ContainerRowSectionItems[this.updateContainerRowSectionItemID].name
          ).subscribe((crsitem) => {
            console.log("Deleted Container Section Item => ", crsitem);
            const items = crsitem.map((doc:any) => {
              let itemLabel:any;
              if(doc.name == "firstname" || doc.name == "lastname")
              {
                let name = "name".charAt(0).toUpperCase() + "name".slice(1);
                if(doc.name == "firstname")
                {
                  let first = "first".charAt(0).toUpperCase() + "first".slice(1);   
                  itemLabel = first + " " + name;         
                } else if(doc.name == "lastname") {
                  let second = "last".charAt(0).toUpperCase() + "last".slice(1);
                  itemLabel = second + " " + name;
                }
              } else {
                itemLabel = doc.name.charAt(0).toUpperCase() + doc.name.slice(1);
              }
              return {
                label:itemLabel,
                name:doc.name,
                order:doc.order
              }
            });
            // this.Container[this.updateContainerID].rows[this.updateContainerRowID].sections[this.updateContainerRowSectionID].items = items;
            // this.ContainerRowSectionItems = this.Container[this.updateContainerID].rows[this.updateContainerRowID].sections[this.updateContainerRowSectionID].items;
            this.ContainerRowSectionItems = items;
          });
        }
      } else if(this.editSection == true)
      {
        this.containerService.deleteContainerRowSectionItem(
          this.Container[this.updateContainerID].name,
          this.Container[this.updateContainerID].rows[this.updateContainerRowID].name,
          this.Container[this.updateContainerID].rows[this.updateContainerRowID].sections[this.updateContainerRowSectionID].name,
          this.Container[this.updateContainerID].rows[this.updateContainerRowID].sections[this.updateContainerRowSectionID].items[this.updateContainerRowSectionItemID].name
        ).subscribe((crsitem) => {
          console.log("Deleted Container Section Item => ", crsitem);
          const items = crsitem.map((doc:any) => {
            let itemLabel:any;
            if(doc.name == "firstname" || doc.name == "lastname")
            {
              let name = "name".charAt(0).toUpperCase() + "name".slice(1);
              if(doc.name == "firstname")
              {
                let first = "first".charAt(0).toUpperCase() + "first".slice(1);   
                itemLabel = first + " " + name;         
              } else if(doc.name == "lastname") {
                let second = "last".charAt(0).toUpperCase() + "last".slice(1);
                itemLabel = second + " " + name;
              }
            } else {
              itemLabel = doc.name.charAt(0).toUpperCase() + doc.name.slice(1);
            }
            return {
              label:itemLabel,
              name:doc.name,
              order:doc.order
            }
          });
          this.Container[this.updateContainerID].rows[this.updateContainerRowID].sections[this.updateContainerRowSectionID].items = items;
          this.ContainerRowSectionItems = this.Container[this.updateContainerID].rows[this.updateContainerRowID].sections[this.updateContainerRowSectionID].items;
        });
      }
    }
    this.closeModal("custom-delete-modal");
  }

}
