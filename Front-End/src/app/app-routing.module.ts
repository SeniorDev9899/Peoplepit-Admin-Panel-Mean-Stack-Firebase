import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActionObjectScreenComponent } from './components/action-object-screen/action-object-screen.component';

const routes: Routes = [
  { path: ':object', component: ActionObjectScreenComponent },
  { path: ':object/:action', component: ActionObjectScreenComponent },
  { path: ':object/:action/:key', component: ActionObjectScreenComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
