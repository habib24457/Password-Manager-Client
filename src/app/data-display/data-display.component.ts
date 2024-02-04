import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
interface IPasswordItem {
  id: number;
  userName: string;
  app: string;
  category: string;
  userPassword: string;
}

@Component({
  selector: 'app-data-display',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './data-display.component.html',
  styleUrl: './data-display.component.css',
})
export class DataDisplayComponent implements OnInit {
  httpClient = inject(HttpClient);
  passwordData: IPasswordItem[] = [];
  singlePassword: IPasswordItem[] = [];
  editMode: boolean = false;
  currentPasswordItemId: number;
  @ViewChild('userPasswordForm') form: NgForm;

  ngOnInit(): void {
    this.fetchData();
  }

  //get all the user passwords
  async fetchData() {
    await this.httpClient
      .get('http://localhost:5014/api/Passwords')
      .subscribe((data: any) => {
        /*If we want to show all the passwords decrypted
        console.log('Raw data with password encryption', data);
        let decryptedPasswordItems = this.decryptPassword(data);
        console.log('After password decrypting', decryptedPasswordItems);
        this.passwordData = decryptedPasswordItems;*/
        this.passwordData = data;
      });
  }

  //Create new user password or update an existing one
  async onSubmit(data: IPasswordItem) {
    if (!this.editMode) {
      /*If the editmode is false, a new pass item will be saved*/
      await this.httpClient
        .post('http://localhost:5014/api/Passwords', data)
        .subscribe((result) => {
          console.log('Result', result);
          this.fetchData();
        });
    } else {
      /*Otherwise the data will be updated */
      const id = this.currentPasswordItemId;
      await this.httpClient
        .put(`http://localhost:5014/api/Passwords/${id}/`, data)
        .subscribe((result) => {
          console.log(result);
          this.fetchData();
          this.editMode = false;
        });
    }
  }

  //get one password
  async handleEditClick(id: number) {
    this.currentPasswordItemId = id;
    await this.httpClient
      .get(`http://localhost:5014/api/Passwords/${id}/${true}`)
      .subscribe((data: any) => {
        this.singlePassword = data;
        console.log('clicked', this.singlePassword);
        this.form.setValue({
          userName: data.userName,
          app: data.app,
          category: data.category,
          userPassword: data.userPassword,
        });
      });
    this.editMode = true;
  }

  /*Decrypting the password in the frontend
  decryptPassword(encryptedPasswordItems: IPasswordItem[]) {
    console.log(encryptedPasswordItems);
    let updatedItems: IPasswordItem[] = [...encryptedPasswordItems];
    for (let i = 0; i < encryptedPasswordItems.length; i++) {
      let base64String = encryptedPasswordItems[i].userPassword;
      let asciiString = atob(base64String);
      updatedItems[i].userPassword = asciiString;
    }
    return updatedItems;
  }*/

  //delete password item
  async handleDeleteClick(id: number) {
    await this.httpClient
      .delete(`http://localhost:5014/api/Passwords/${id}`)
      .subscribe((result) => {
        console.log(result);
        this.fetchData();
      });
  }
}
