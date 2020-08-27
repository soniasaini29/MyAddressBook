import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContactsComponent } from './contacts/contacts.component';
import { CreateContactComponent } from './create-contact/create-contact.component';


const appRoutes: Routes = [
    { path: '', redirectTo: '/contacts', pathMatch: 'full' },
    {
        path: 'contacts',
        component: ContactsComponent
    },
    {
      path: 'create-new-contact',
      component: CreateContactComponent
  },
  { path: 'contacts/:id', component: CreateContactComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
