import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import {FormControl} from '@angular/forms';
import { MatAutocomplete } from '@angular/material/autocomplete';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { Fields } from '../../../classes/fields';
import { Options } from '../../../classes/options';

@Component({
  selector: 'app-field-single-autocomplete',
  templateUrl: './field-single-autocomplete.component.html',
  styleUrls: ['./field-single-autocomplete.component.css']
})
export class FieldSingleAutocompleteComponent implements OnInit {
  @Input() Field: Fields;
  public inputControl: FormControl = new FormControl(); // control for the MatSelect filter keyword multi-selection
  public filteredOptions: Observable<Options[]>; // list of options filtered by search keyword for multi-selection
  
  
  @ViewChild('autocompleteInput') autocompleteInput: ElementRef<HTMLInputElement>;
  @ViewChild('matAutocomplete') matAutocomplete: MatAutocomplete;

  constructor() { }

  ngOnInit(): void {
    
    // listen for search field value changes
    this.filteredOptions = this.inputControl.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.value),
        map(name => name ? this._filter(name) : this.Field.options?.slice())
      );  
  }

  displayFn(id: any): string {
    let value = "";
    this.Field.options?.forEach(option => {if (option.name == id) {value = option.label}});
    return value;
  }

  private _filter(name: string): Options[] | any {
    const filterValue = name.toLowerCase();
    return this.Field.options?.filter(option => option.label.toLowerCase().indexOf(filterValue) === 0);
  }

}
