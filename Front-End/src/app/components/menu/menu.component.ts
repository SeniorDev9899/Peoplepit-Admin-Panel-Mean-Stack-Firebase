import { Component, OnInit } from '@angular/core';
import { Actions } from 'src/app/classes/actions';
import { onSideNavChange, animateText } from '../../animations/animations';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
  animations: [onSideNavChange, animateText]
})

export class MenuComponent implements OnInit {
  public menuItems: Actions[] = [];//= MENU;
  public sideNavState: boolean;
  public sideNavClass: any;
  

  constructor(private menuservice:DataService) { }

  ngOnInit() {    
    
    this.menuservice.getMenu().subscribe(menus => 
      { 
        console.log("Menus => ", menus);
        menus.forEach(menu => {this.menuItems.push(menu)});
        if (this.menuItems){this.menuItems.sort((a, b) => (a.order > b.order) ? 1 : -1)} //reorder menu items

        if (localStorage.getItem("sideNavClass") == null){
          this.sideNavState = false;
          this.sideNavClass = "closed";
          localStorage.setItem("sideNavClass", this.sideNavClass);
        }
        else 
        {
          this.sideNavClass = localStorage.getItem("sideNavClass");
          if (this.sideNavClass == "open") {this.sideNavState = true;}
          if (this.sideNavClass == "closed") {this.sideNavState = false;}
        }

        this.updateMenuItems(this.menuItems, this.sideNavState);     
        console.log("menu items => ", this.menuItems);     
        
      });      
  }


  onSidenavToggle() {
    this.sideNavState = !this.sideNavState;
    this.sideNavClass = this.sideNavState ? "open" : "closed";
    localStorage.setItem("sideNavClass", this.sideNavClass); 
    this.updateMenuItems(this.menuItems, this.sideNavState);  
  }

  updateMenuItems(items:Actions[], state:boolean) {
    items.forEach(item => {item.showLabel = state?true:false;});    
  }
    
}