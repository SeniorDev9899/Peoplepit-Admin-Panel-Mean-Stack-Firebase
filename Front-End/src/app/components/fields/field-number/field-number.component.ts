import { Component, OnInit, Input } from '@angular/core';
import { Fields } from '../../../classes/fields';

@Component({
  selector: 'app-field-number',
  templateUrl: './field-number.component.html',
  styleUrls: ['./field-number.component.css']
})
export class FieldNumberComponent implements OnInit {
  @Input() Field: Fields;
  constructor() { }

  ngOnInit(): void {
  }

}
