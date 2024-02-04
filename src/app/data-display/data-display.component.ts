import { Component, OnInit, inject } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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

  ngOnInit(): void {
    this.fetchData();
  }

  //get all the user passwords
  async fetchData() {
    await this.httpClient
      .get('http://localhost:5014/api/Passwords')
      .subscribe((data: any) => {
        console.log('Raw data with password encryption', data);
        let decryptedPasswordItems = this.decryptPassword(data);
        console.log('After password decrypting', decryptedPasswordItems);
        this.passwordData = decryptedPasswordItems;
      });
  }

  decryptPassword(encryptedPasswordItems: IPasswordItem[]) {
    console.log(encryptedPasswordItems);
    let updatedItems: IPasswordItem[] = [...encryptedPasswordItems];
    for (let i = 0; i < encryptedPasswordItems.length; i++) {
      let base64String = encryptedPasswordItems[i].userPassword;
      let asciiString = atob(base64String);
      updatedItems[i].userPassword = asciiString;
    }
    return updatedItems;
  }

  //Create new user password
  async onSubmit(data: IPasswordItem) {
    console.log(data);
    await this.httpClient
      .post('http://localhost:5014/api/Passwords', data)
      .subscribe((result) => {
        console.log('Result', result);
      });
  }
}
