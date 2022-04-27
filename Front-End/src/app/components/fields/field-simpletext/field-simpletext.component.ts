import { Component, OnInit, Input } from '@angular/core';
import { Fields } from '../../../classes/fields';

@Component({
  selector: 'app-field-simpletext',
  templateUrl: './field-simpletext.component.html',
  styleUrls: ['./field-simpletext.component.css']
})
export class FieldSimpletextComponent implements OnInit {
  @Input() Field: Fields;
  constructor() { }

  ngOnInit(): void {
  }

}
