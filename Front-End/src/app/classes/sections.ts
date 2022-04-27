import { analyzeAndValidateNgModules } from "@angular/compiler";

import { Fields } from './fields';

export interface SectionFields {
    field: Fields;
    order: number;
  }

export interface Sections {
    id: number;
    name: string;
    order: number;
    type: string; //container; row; item;
    width: number;
    align?: string; //container(left, center, right); row(start; center; space-between; space-around; space-evenly;)
    section_fields?: SectionFields[];    
    sections?: Sections[];
  }