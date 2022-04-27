import { Objects } from './objects';
import { Sections } from './sections';

export interface Actions {
    name: string;
    label: string;
    order: number;
    object: string;
    icon?: string;
    showIcon: boolean;
    showLabel: boolean;
    screen?: Sections;
    dialog?: boolean;
    link?: string;
    relativelink: string;
    container: string;
    //flow?: Flows;
  }