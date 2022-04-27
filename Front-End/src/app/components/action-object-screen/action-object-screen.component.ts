import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { ObjectService } from '../../services/object.service';
import { FieldService } from 'src/app/services/field.service';
import { ContainerService } from 'src/app/services/container.service';
import { ActionService } from 'src/app/services/action.service';
@Component({
  selector: 'app-action-object-screen',
  templateUrl: './action-object-screen.component.html',
  styleUrls: ['./action-object-screen.component.css']
})
export class ActionObjectScreenComponent implements OnInit {

  section:any;
  object:string;
  key:string;
  action:string;
  ready:boolean = false;
  counter = 0;
  admin:Boolean = false;
  objectAdmin:Boolean = false;
  objects:any;
  fieldAdmin:Boolean = false;
  fields:any;
  containerAdmin:Boolean = false;
  containers:any;
  actionAdmin:Boolean = false;
  actions:any;
  
  constructor( 
    private route: ActivatedRoute,
    private dataService:DataService,
    private objectSerivce:ObjectService,
    private fieldService:FieldService,
    private containerService:ContainerService,
    private actionService:ActionService    
  ) { }
  
  ngOnInit(): void {

    this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        of(params.get('object'))
    )).subscribe((object)=> {
      if(object != "admin") {
        this.object = object? object.toString() : '';
        console.log("Object => ", this.object);
        this.route.paramMap.pipe(
          switchMap((params: ParamMap) =>
            of(params.get('action'))
        )).subscribe((action)=> {
          this.action = action? action.toString() : '';
          console.log("Action => ", this.action);
          this.route.paramMap.pipe(
            switchMap((params: ParamMap) =>
              of(params.get('key'))
          )).subscribe((key)=> {
            this.key = key? key.toString() : '';
            console.log("Key => ", this.key);
            this.updateView();
          }); 
        });  
      }
    });   

    this.route.paramMap.pipe(
      switchMap((params: ParamMap) => 
        of(params.get('object'))
    )).subscribe((object) => {
      console.log("Object => ", object);
      if(object == "admin") {
        this.admin = true;
        this.route.paramMap.pipe(
          switchMap((params: ParamMap) => 
          of(params.get("action"))
        )).subscribe((action) => {
          if(action == "object_admin") {
            this.objectAdmin = true;
            console.log("Object Admin => ", this.objectAdmin);
            this.getObjects();
          } else if (action == "field_admin") {
            this.fieldAdmin = true;
            this.getFields();
          } else if (action == "container_admin") {
            this.containerAdmin = true;
            this.getContainers();
          } else if (action == "action_admin") {
            this.actionAdmin = true;
            this.getActions();
          }
        })
      }
    });
   
  }

  updateView()
  {
    if (this.object && this.action) {
      this.dataService.getContainer(this.object, this.action, this.key).subscribe(container => 
        {
          console.log("Containers for people object & view action & empty key => ", container);
          this.ready = true;
          this.section = container;  
        });
      }
    
    //console.log('object = ' + this.object)
    //console.log('key = ' + this.key)
    //console.log('action = ' + this.action)
  }

  getObjects()
  {
    if(this.admin && this.objectAdmin)
    {
      this.objectSerivce.getObjectData("objects").subscribe(objects => {
        console.log("Objects => ", objects);
        this.objects = objects;
      })
    }
  }

  getFields() {
    if(this.admin && this.fieldAdmin)
    {
      this.fieldService.getFieldData("fields").subscribe(fields => {
        this.fields = fields;
        console.log("Fields => ", fields);
      })
    }
  }

  getContainers() {
    if(this.admin && this.containerAdmin) 
    {
      this.containerService.getContainer("containers").subscribe(containers => {
        this.containers = containers;
        console.log("Containers => ", containers);
      })
    }
  }
  
  getActions() {
    if(this.admin && this.actionAdmin)
    {
      this.actionService.getAction('actions').subscribe(actions => {
        this.actions = actions;
        console.log("Actions => ", this.actions);
      })
    }
  }

  handleObjectChanged(valueEmitted:any) {
    console.log("Changed Object => ", valueEmitted);
    this.objects[valueEmitted.index] = valueEmitted.updatedObject;
  }

  handleFieldChanged(valueEmitted:any) {
    this.fields[valueEmitted.index] = valueEmitted.updatedField;
  }

  handleObjectAdded(valueEmitted:any) {
    this.objects.push(valueEmitted.addedObject);
  }

  handleFieldAdded(valueEmitted:any) {
    this.fields.push(valueEmitted.addedField);
  }

  handleUpdatedContainerInfo(valueEmitted:any) {
    this.containers[valueEmitted.id].label = valueEmitted.updatedContainer.label;
    this.containers[valueEmitted.id].name = valueEmitted.updatedContainer.name;
    this.containers[valueEmitted.id].width = valueEmitted.updatedContainer.width;
    this.containers[valueEmitted.id].align = valueEmitted.updatedContainer.align;
    this.containers[valueEmitted.id].rows = valueEmitted.updatedContainer.rows;
  }

  handleDeletedContainerInfo(valueEmitted:any) {
    this.containers = valueEmitted.deletedContainers;
  }

  handleCreatedContainerInfo(valueEmitted:any) {
    this.containers = valueEmitted.allContainers;
  }

  handleUpdatedContainerRowInfo(valueEmitted:any) {
    this.containers[valueEmitted.coID].rows[valueEmitted.corID] = valueEmitted.updatedContainerRow;
  }

  // handleDeletedContainerRowInfo(valueEmitted:any) {
  //   this.containers[valueEmitted.id].rows = valueEmitted.deletedContainerRows;
  //   console.log("Containers => ", this.containers[valueEmitted.id]);
  // }

  // handleDeletedContainerRowSectionInfo(valueEmitted:any) {
  //   this.containers[valueEmitted.containerID].rows[valueEmitted.rowID].sections = valueEmitted.deletedContainerRowSections;
  // }

  handleUpdatedContainerRowSectionInfo(valueEmitted:any) {
    this.containers[valueEmitted.coID].rows[valueEmitted.corID].sections[valueEmitted.corsID] = valueEmitted.updatedContainerRowSection
  }

  handleUpdatedContainerRowSectionItemInfo(valueEmitted:any) {
    this.containers[valueEmitted.containerID].rows[valueEmitted.rowID].sections[valueEmitted.sectionID].items = 
    valueEmitted.updatedItemInfos;
  }

  // handleFieldOptionAdded(valueEmitted:any) {
  //   console.log("Value => ", valueEmitted);
  //   if(valueEmitted.newFieldOption)
  //   {
  //     this.fields.push({
  //       label: "",
  //       name: "",
  //       type: "",
  //       option: [valueEmitted.addedOptionOfField]
  //     });
  //   } else {
  //     this.fields[valueEmitted.docID].options.push(valueEmitted.addedOptionOfField);
  //   }
  // }

  handleActionAdded(valueEmitted:any) {
    this.actions.push(valueEmitted.addedAction);
  }

  handleActionChanged(valueEmitted:any) {
    this.actions[valueEmitted.index] = valueEmitted.updatedAction;
  }
}
