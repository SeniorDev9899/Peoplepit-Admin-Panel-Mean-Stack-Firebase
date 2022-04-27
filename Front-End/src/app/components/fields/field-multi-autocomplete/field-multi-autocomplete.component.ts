import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';
import { ReplaySubject } from 'rxjs/ReplaySubject'; //for that to work, had to install that 'npm i rxjs-compat'
import { Fields } from '../../../classes/fields';
import { Options } from '../../../classes/options';
import { SPACE } from '@angular/cdk/keycodes';
import { ElementRef, ViewChild } from '@angular/core';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';

@Component({
  selector: 'app-field-multi-autocomplete',
  templateUrl: './field-multi-autocomplete.component.html',
  styleUrls: ['./field-multi-autocomplete.component.css']
})
export class FieldMultiAutocompleteComponent implements OnInit {

  @Input() Field: Fields;
  public inputControl: FormControl = new FormControl(); // control for the MatSelect filter keyword multi-selection
  public filteredOptionsMulti: ReplaySubject<Options[]> = new ReplaySubject<Options[]>(1); // list of options filtered by search keyword for multi-selection
  private _onDestroy = new Subject<void>(); // Subject that emits when the component has been destroyed
  public separatorKeysCodes: number[] = [SPACE];
  public selectedOptions: any[] = [];
  public removable = true;
  
  @ViewChild('autocompleteInput') autocompleteInput: ElementRef<HTMLInputElement>;
  @ViewChild('matAutocomplete') matAutocomplete: MatAutocomplete;

  constructor() { }

  ngOnInit(): void {

    // preload selected items
    for (let value of this.Field.values) {
      this.addSelectedOptions(value);
    }; 

    // load the initial options list (excluding selected items)
    this.filterOptionsMulti();

    // listen for search field value changes
    this.inputControl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterOptionsMulti();
      });

  }

  ngOnDestroy() 
  {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  /** function to filter out options in autocomplete */
  private filterOptionsMulti() 
  {
    if (!this.Field.options) {
      return;
    }
    
    // get the search keyword
    let search = this.inputControl.value;
    
    // keep only unselected values in the list
    let optionsToShow: Options[] = [];
    this.Field.options.forEach(option => optionsToShow.push(option));
    this.RemoveArrayElementsFromObjectArray(optionsToShow, this.selectedOptions);
         
    if (!search) {
      this.filteredOptionsMulti.next(optionsToShow.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the options
    this.filteredOptionsMulti.next(
      optionsToShow.filter(option => option.label.toLowerCase().indexOf(search) > -1)
    );
  }

  /** function to add selected value to the list */
  public selected(event: MatAutocompleteSelectedEvent): void 
  {
    //select visually
    let chosenOption = {} as Options;
    chosenOption.name = event.option.value;
    chosenOption.label = event.option.viewValue;
    this.addSelectedOptions(chosenOption.name);
    this.autocompleteInput.nativeElement.value = '';

    //add in object
    let temp = this.Field.values;
    temp.push(chosenOption.name);
    this.Field.values = []; //emptying then reinitializing -- otherwise the view is not refreshing
    temp.forEach(value => this.Field.values.push(value));

    //reinitialize list of options
    this.filterOptionsMulti();
  }

  /** function to remove option from the list */
  public remove(option: Options): void 
  {
    //remove visually
    let index: number;
    index = this.selectedOptions.indexOf(option, 0);
    if (index >= 0) {this.selectedOptions.splice(index, 1);}
    
    //remove from object
    index = this.Field.values.indexOf(option.name, 0);
    if (index >= 0) {
      let temp = this.Field.values;
      temp.splice(index, 1);
      this.Field.values = []; //emptying then reinitializing -- otherwise the view is not refreshing
      temp.forEach(value => this.Field.values.push(value));
    }

    //reinitialize list of options
    this.filterOptionsMulti();
  }

  /** function to add an item to the list of selected options */
  private addSelectedOptions(optionID: string) 
  {
    this.selectedOptions.push(this.Field.options?.find(option => { return option.name === optionID })); //adding '+' before 'value' to make it a number          
  }

  /** function to remove an object from an array of objects based on ID */
  private RemoveArrayElementsFromObjectArray(fromArray: any[], removeArray: any[]) 
  {
    removeArray.forEach((remValue) => {
      fromArray.forEach((value,index)=>{  
        if(value.name==remValue.name) fromArray.splice(index,1);
      });
    })
  } 

}





