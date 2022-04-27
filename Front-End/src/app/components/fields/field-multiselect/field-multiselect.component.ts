import { Component, OnInit, Input } from '@angular/core';
import { Fields } from "../../../classes/fields";

@Component({
  selector: 'app-field-multiselect',
  templateUrl: './field-multiselect.component.html',
  styleUrls: ['./field-multiselect.component.css']
})
export class FieldMultiselectComponent implements OnInit {

  @Input() Field: Fields;
  constructor() { }

  ngOnInit(): void {
  }

}
