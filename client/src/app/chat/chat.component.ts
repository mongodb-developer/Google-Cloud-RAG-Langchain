import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { config } from '../../config';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent implements OnInit {
  messageForm: FormGroup;

  constructor(private fb: FormBuilder, private httpClient: HttpClient) {
  }

  ngOnInit(): void {
    this.messageForm = this.fb.group({
      text: [''],
    });
  }

  submitForm(): void {
    console.log(this.messageForm.value.text);
    this.httpClient.post(`${config.backendUrl}/messages`, { text: this.messageForm.value.text }).subscribe();

  }
}
