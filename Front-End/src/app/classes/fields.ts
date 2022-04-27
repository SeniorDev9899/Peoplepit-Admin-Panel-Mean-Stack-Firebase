import { Options } from "./options";

export interface Fields {
    name: string;
    label: string;
    values: any[];
    type: string; //date, simpletext, number, singleselect, single-autocomplete, multiselect, multi-autocomplete
    options?: Options[];
  }