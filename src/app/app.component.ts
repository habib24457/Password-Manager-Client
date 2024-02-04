import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DataDisplayComponent } from './data-display/data-display.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, DataDisplayComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'Password Manager'; //title is a global variable

  //method
  getSubTitle() {
    const subTitle = '**Encrypt and Decrypt your password**';
    return subTitle;
  }

  //get user password method
}
