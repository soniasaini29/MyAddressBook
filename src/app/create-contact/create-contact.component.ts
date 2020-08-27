import { Component, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Contact } from '../contacts.model';
import { HttpClient } from '@angular/common/http';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from 'angularfire2/storage';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { DataStorageService } from '../contacts.service';
@Component({
  selector: 'app-create-contact',
  templateUrl: './create-contact.component.html',
  styleUrls: ['./create-contact.component.css']
})
export class CreateContactComponent implements OnInit {
  @ViewChild('f', { static: true }) contactForm: NgForm;
  fileToUpload: File = null;
  fd = new FormData();
  imgURL: any;
  ref: AngularFireStorageReference;
  task: AngularFireUploadTask;
  id: number;
  editMode = false;
  idOnReload = '';
  contactInfo: any;
  validFName: boolean = true;
  validLName: boolean = true;
  validEmail: boolean = true;
  validPhone: boolean = true;
  hasError: boolean = false;


  constructor(private http: HttpClient,
    private afStorage: AngularFireStorage,
    private route: ActivatedRoute,
    private dataStorageService: DataStorageService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.id = +params['id'];
      this.editMode = params['id'] != null;
      this.idOnReload = params.id;

      if (this.editMode == true) {
        this.contactInfo = this.dataStorageService.getSelectedContact(this.idOnReload);
        this.contactInfo.subscribe((data: any) => {
          this.contactInfo = data;
          console.log(data);
          this.proceedFurther();
        });
      }
    });
  }

  onAddEditContact(form: NgForm) {
    const value = form.value;

    value.fname = (value.fname).trim();
    value.lname = (value.lname).trim();
    value.phone = (value.phone).trim();
    value.email = (value.email).trim();

    var regexContact = /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
    var matchContact = regexContact.exec(value.phone);

    var regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    var match = regex.exec(value.email);

    if (value.fname == '') {
      this.hasError = true;
      this.validFName = false;
    }
    else {
      this.hasError = false;
      this.validFName = true;
    }

    if (value.lname == '') {
      this.hasError = true;
      this.validLName = false;
    }
    else {
      this.hasError = false;
      this.validLName = true;
    }

    if (matchContact) {
      this.validPhone = true;
      this.hasError = false;
    }
    else {
      this.validPhone = false;
      this.hasError = true;
    }

    if (match) {
      this.validEmail = true;
      this.hasError = false;
    }
    else {
      this.validEmail = false;
      this.hasError = true;
    }

    if (form.valid && this.hasError == false
      && this.validFName == true && this.validLName == true
      && this.validPhone == true && this.validEmail == true) {
      const newContact = new Contact(value.fname, value.lname, value.phone, value.email, this.fd);
      const formData: FormData = new FormData();
      formData.append('image', this.fileToUpload);
      formData.append('fname', newContact.fname);
      formData.append('lname', newContact.lname);
      formData.append('phone', newContact.phone);
      formData.append('email', newContact.email);
      if (this.editMode) {
        this.http.put('https://myfirebaseproject-5195b.firebaseio.com/createcontact/' + this.idOnReload + '.json', newContact)
          .subscribe(response => {
            console.log(response);
            this.router.navigate(['contacts']);
          })
      }
      else {
        console.log(newContact, formData, this.fileToUpload);
        this.http.post('https://myfirebaseproject-5195b.firebaseio.com/createcontact.json', newContact)
          .subscribe(response => {
            console.log(response);
            this.router.navigate(['contacts']);
          })
      }
    }


  }

  handleFileInput(event) {
    // this.fileToUpload = files.item(0);
    // this.imgURL = event.target.files[0];
    // let reader = new FileReader();
    // reader.onload = (e: any) => {
    // 	this.imgURL = e.target.result;
    // }
    // reader.readAsDataURL(event.target.files[0]);

    const id = Math.random().toString(36).substring(2);
    this.ref = this.afStorage.ref(id);
    this.task = this.ref.put(event.target.files[0]);
    console.log(id, this.ref, this.task);

  }

  proceedFurther() {

    if (this.editMode) {

      setTimeout(() => {
        this.contactForm.setValue({
          fname: this.contactInfo.fname,
          lname: this.contactInfo.lname,
          phone: this.contactInfo.phone,
          email: this.contactInfo.email
        });
      });
    }

  }
}
