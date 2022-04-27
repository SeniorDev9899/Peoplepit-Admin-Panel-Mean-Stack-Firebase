import { J } from '@angular/cdk/keycodes';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ModalService {
    private modals: any[] = [];

    add(modal: any) {
        // add modal to array of active modals
        this.modals.push(modal);
        console.log("Total Modals => ", this.modals);
    }

    remove(id: string) {
        // remove modal from array of active modals
        this.modals = this.modals.filter(x => x.id !== id);
    }

    open(id: string) {
        // open modal specified by id
        const modal = this.modals.find(x => x.id === id);
        console.log("Modal => ", id);
        // if(id == "custom-modal-4")
        // {
        //     modal.open("custom-modal-4");
        // } else if(id == "custom-modal-3")
        // {
        //     modal.open("custom-modal-3");
        // } else if(id == "custom-modal-2") {
        //     modal.open("custom-modal-2");
        // } else {else {
            modal.open("");
        // }
    }

    close(id: string) {
        // close modal specified by id
        const modal = this.modals.find(x => x.id === id);
        modal.close();
    }
}