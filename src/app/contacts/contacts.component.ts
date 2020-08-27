import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Contact } from '../contacts.model';
import { map, tap, take, exhaustMap } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {DataStorageService} from '../contacts.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css']
})
export class ContactsComponent implements OnInit {
  contacts: any;
  contactsData: any;

  constructor(private http: HttpClient,
    private dataStorage: DataStorageService,
    private route: ActivatedRoute,
		private router: Router) { }

  ngOnInit(): void {
    this.http.get('https://myfirebaseproject-5195b.firebaseio.com/createcontact.json')
    .pipe(map(contactsData => {
      const postArr = [];
      for (const key in contactsData) {
        postArr.push({ ...contactsData[key], id: key })
      }
     
      this.contacts = postArr;
      console.log(postArr);
      return postArr;
    }
    ))
    .subscribe(response => {
      console.log(response);
      this.contactsData = response;
    });
  }
  onEditContact(contact){
    this.dataStorage.goToEditPage(contact);
  }
  
  deleteContact(id){
    console.log(id);
    this.http.delete('https://myfirebaseproject-5195b.firebaseio.com/createcontact/' + id + '.json')
      .subscribe(response => {
        console.log(response);
       this.ngOnInit();
      });
  }
}
