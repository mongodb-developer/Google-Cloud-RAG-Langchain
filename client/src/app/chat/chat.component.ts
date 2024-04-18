import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { config } from '../../config';
import { NgClass, NgFor } from '@angular/common';

interface Message {
  text: string;
  timestamp: string;
  type: "human" | "bot";
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule, NgFor, NgClass],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent implements OnInit {
  messageForm: FormGroup;
  messages: Message[] = [];

  constructor(private fb: FormBuilder, private httpClient: HttpClient) {
  }

  ngOnInit(): void {
    this.messageForm = this.fb.group({
      text: [''],
    });
  }

  submitForm(): void {
    console.log(this.messageForm.value.text);
    const text = this.messageForm.value.text;

    this.messages.push({
      text,
      timestamp: new Date().toISOString(),
      type: "human"
    });

    this.httpClient.post(`${config.backendUrl}/messages`, { text })
      .subscribe({
        next: (response: any) => {
          console.log(response);
          this.messages.push({
            text: response.text,
            timestamp: new Date().toISOString(),
            type: "bot"
          });
        },
        error: (error: any) => {
          console.error(error);
        }
      });

      this.messageForm.reset();
  }
}
