import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Actions } from '../../../classes/actions';
import { ModalService } from './../../_modal';
import { ActionService } from 'src/app/services/action.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
declare var $:any;

@Component({
  selector: 'app-action-admin',
  templateUrl: './action-admin.component.html',
  styleUrls: ['./action-admin.component.css']
})
export class ActionAdminComponent implements OnInit {

  updateActionID:any;
  formdata:FormGroup;
  actionLabel:string;
  actionObject:string;
  actionOrder:string;
  actionRelativeLink:string;
  actionShowIcon:boolean;
  actionShowLabel:boolean;
  actionIcon:string;
  actionContainer:string;
  objects:any[] = [];

  addNewAction:boolean = false;
  editAction:boolean = false;

  checked:boolean = false;

  constructor(
    private modalService:ModalService,
    private actionService:ActionService
  ) { }

  @Input() Action: Actions[];
  @Output() actionAdded: EventEmitter<any> = new EventEmitter<any>();
  @Output() actionChanged: EventEmitter<any> = new EventEmitter<any>();

  ngOnInit(): void {
    this.formdata = new FormGroup({
      actionLabel: new FormControl(""),
      actionObject: new FormControl(""),
      actionOrder: new FormControl(""),
      actionRelativeLink: new FormControl(""),
      actionShowIcon: new FormControl("", Validators.required),
      actionShowLabel: new FormControl("", Validators.required),
      actionIcon: new FormControl(""),
      actionContainer: new FormControl("")
    });   
    this.objects = [
      {name: "conditions"},
      {name: "people"},
    ];
    $('#Radio1').click(function(){
      var $radio = $('#Radio1');

      console.log("Radio 1 => ", $('input[name="actionShowIcon"]:checked').val());

      // if this was previously checked
      if ($radio.data('waschecked') == true)
      {
          $radio.prop('checked', false);
          $radio.data('waschecked', false);
      }
      else
          $radio.data('waschecked', true);

      // remove was checked from other radios
      $radio.siblings('#Radio1').data('waschecked', false);
    });
    $('#Radio2').click(function(){
      var $radio = $('#Radio2');

      console.log("Radio 2 => ", $('input[name="actionShowLabel"]:checked').val());

      // if this was previously checked
      if ($radio.data('waschecked') == true)
      {
          $radio.prop('checked', false);
          $radio.data('waschecked', false);
      }
      else
          $radio.data('waschecked', true);

      // remove was checked from other radios
      $radio.siblings('#Radio2').data('waschecked', false);
    });
  }

  openModal(id:any, number:any) {
    this.modalService.open(id);
    if(number >= 0) {
      console.log("Number => ", number);
      console.log("Action => ", this.Action[number]);
      this.updateActionID = number;
      this.editAction = true;
      this.addNewAction = false;
      this.actionShowIcon = true;
      this.actionShowLabel = true;
      console.log("Icon, Label => ", this.actionShowIcon, this.actionShowLabel);
      this.formdata = new FormGroup({
        actionLabel: new FormControl(this.Action[number].label),
        actionObject: new FormControl(this.Action[number].object),
        actionOrder: new FormControl(this.Action[number].order),
        actionRelativeLink: new FormControl(this.Action[number].relativelink),
        actionShowIcon: new FormControl(true),
        actionShowLabel: new FormControl(true),
        actionIcon: new FormControl(this.Action[number].icon),
        actionContainer: new FormControl(this.Action[number].container)
      });
    } else {
      this.addNewAction = true;
      this.editAction = false;
      this.formdata = new FormGroup({
        actionLabel: new FormControl(""),
        actionObject: new FormControl(""),
        actionOrder: new FormControl(""),
        actionRelativeLink: new FormControl(""),
        actionIcon: new FormControl(""),
        actionContainer: new FormControl("")
     });
    }
  }

  closeModal(id:any) {
    this.modalService.close(id);
  }

  onClickSubmit(data:any) {
    this.actionLabel = data.actionLabel;
    this.actionObject = data.actionObject;
    this.actionOrder = data.actionOrder;
    this.actionRelativeLink = data.actionRelativeLink;
    this.actionShowIcon = data.actionShowIcon;
    this.actionShowLabel = data.actionShowLabel;
    this.actionIcon = data.actionIcon;
    this.actionContainer = data.actionContainer;
    console.log("Action Label => ", this.actionLabel);
    console.log("Action Object => ", this.actionObject);
    console.log("Action Order => ", this.actionOrder);
    console.log("Action RelativeLink => ", this.actionRelativeLink);
    console.log("Action ShowIcon => ", this.actionShowIcon);
    console.log("Action ShowLabel => ", this.actionShowLabel);
    console.log("Action Icon => ", this.actionIcon);
    console.log("Action Container => ", this.actionContainer);
    if(this.addNewAction)
    {
      this.actionService
      .createAction({
        label : this.actionLabel,
        object : this.actionObject,
        order : this.actionOrder,
        relativelink : this.actionRelativeLink,
        showIcon : this.actionShowIcon,
        showLabel : this.actionShowLabel,
        icon : this.actionIcon,
        container : this.actionContainer
      })
      .subscribe( act => {
        console.log("Added Action => ", act);
        let actionInfo:any = act;
        this.actionAdded.emit({addedAction:actionInfo});
        this.closeModal("custom-modal-6");
      });
    } else if(this.editAction == true) {
      console.log("Action Item Name => ", this.Action[this.updateActionID].name);
      this.actionService
      .updateAction(
        this.Action[this.updateActionID].name, 
        {
          label: this.actionLabel, 
          object: this.actionObject, 
          order: this.actionOrder,
          relativelink: this.actionRelativeLink,
          showIcon: this.actionShowIcon,
          showLabel: this.actionShowLabel,
          icon: this.actionIcon,
          container: this.actionContainer,
        }
      ).subscribe(act => {
        console.log("Returned Action => ", act);
        let actionInfo:any = act;
        this.actionChanged.emit({updatedAction: actionInfo, index: this.updateActionID});
        this.closeModal("custom-modal-6");
      });
    }
  }

  onChange(e:any) {
    console.log("align type changed => ", e.target.value);
  }

}
