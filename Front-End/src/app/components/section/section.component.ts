import { Component, OnInit, Input } from '@angular/core';
import { Sections } from '../../classes/sections';

export interface Tile {
  color: string;
  cols: number;
  rows: number;
  text: string;
}

@Component({
  selector: 'app-section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.css']
})
export class SectionComponent implements OnInit {

  @Input() Section: Sections;
  display: string;
  justifyContent: string; //start; center; space-between; space-around; space-evenly;
  marginleft: string;
  marginright: string; 
  sectionWidth: number;

  constructor() { }

  ngOnInit(): void {
    console.log("Sections => ", this.Section);
    if (this.Section.align == "center"){this.marginleft = "auto"; this.marginright = "auto"; }
    if (this.Section.align == "left"){this.marginleft = "0"; this.marginright = "auto";}
    if (this.Section.align == "right"){this.marginleft = "auto"; this.marginright = "0"; }
    this.display = (window.innerWidth <= 400) ? "block" : "flex";
    this.sectionWidth = (this.Section.type == 'container') ? this.Section.width : 100;
    if (this.Section.type == 'row') {
      if (this.Section.align == 'left') {this.justifyContent = "start"} //reserved for container
      else if (this.Section.align == 'center') {this.justifyContent = "center"} //reserved for container and rows
      else if (this.Section.align == 'right') {this.justifyContent = "space-between"} //reserved for container
      else if (this.Section.align == 'start') {this.justifyContent = "start"} //reserved for row
      else if (this.Section.align == 'space-between') {this.justifyContent = "space-between"} //reserved for row
      else if (this.Section.align == 'space-around') {this.justifyContent = "space-around"} //reserved for row
      else if (this.Section.align == 'space-evenly') {this.justifyContent = "space-evenly"} //reserved for row
      else {this.justifyContent = "center"}
    }

    if (this.Section.section_fields){this.Section.section_fields.sort((a, b) => (a.order > b.order) ? 1 : -1)}
    if (this.Section.sections){this.Section.sections.sort((a, b) => (a.order > b.order) ? 1 : -1)}
  }

  onResize(event: any) {
    this.display = (event.target.innerWidth <= 400) ? "block" : "flex";
  }


}
