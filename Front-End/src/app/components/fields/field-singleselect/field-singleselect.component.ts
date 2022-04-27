import { Component, OnInit, Input } from '@angular/core';
import { Fields } from '../../../classes/fields';

@Component({
  selector: 'app-field-singleselect',
  templateUrl: './field-singleselect.component.html',
  styleUrls: ['./field-singleselect.component.css']
})
export class FieldSingleselectComponent implements OnInit {
  @Input() Field: Fields;
  constructor() { }

  ngOnInit(): void {
    
  }

  // needed to add [compareWith] to let it initialize the select value
  compareObjects(o1: any, o2: any): boolean {
    return (o1.name == o2);    
  }
}
