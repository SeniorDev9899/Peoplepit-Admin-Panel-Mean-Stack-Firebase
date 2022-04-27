// had to install the following dependencies
// npm i moment
// npm i @angular/material-moment-adapter

import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { Fields } from '../../../classes/fields';
import * as _moment from 'moment';
import { default as _rollupMoment } from 'moment';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

const moment = _rollupMoment || _moment;

// https://momentjs.com/docs/#/displaying/format/

export const INPUT_FORMAT = 'YYYYMMDD';
export const DISPLAY_FORMATS = { //check for quick helper https://www.concretepage.com/angular-material/angular-material-datepicker-format 
  parse: {
    dateInput: 'DD/MMM/YYYY', //ex: September 4, 1986 --- this is the format of the date field when in View mode
  },
  display: {
    dateInput: 'LL', //ex: September 4, 1986 --- this is the format of the date input field when in Edit mode
    monthYearLabel: 'MMM YYYY', //ex: Sep 2020 --- this is the format displayed when opening the calendar view, Month/Date switcher on top
    dateA11yLabel: 'LL', //ex: September 4, 1986 --- used for people with disabilities
    monthYearA11yLabel: 'MMMM YYYY', //ex: September 2020 --- used for people with disabilities
  },
};
@Component({
  selector: 'app-field-date',
  templateUrl: './field-date.component.html',
  styleUrls: ['./field-date.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: DISPLAY_FORMATS },
  ],
})
export class FieldDateComponent implements OnInit {
  @Input() Field: Fields;

  constructor() { }

  ngOnInit(): void {

  }

  dateChangeEvent(event: MatDatepickerInputEvent<Date>) {
    this.Field.values = []
    this.Field.values.push(moment(event.value).format(INPUT_FORMAT));
  }

}
