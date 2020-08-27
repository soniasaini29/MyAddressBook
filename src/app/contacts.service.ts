import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
@Injectable({ providedIn: 'root' })

export class DataStorageService {
	contactSelected: any;
	
	constructor(
		private http: HttpClient,
		private router: Router
    ) { }
    
    goToEditPage(contact){
        this.contactSelected = contact;
		this.router.navigate(['../contacts/' + this.contactSelected.id]);
    }

    getSelectedContact(id) {
        console.log("id", id);
		return this.http
			.get('https://myfirebaseproject-5195b.firebaseio.com/createcontact/'+id+ '.json');
	}
}
