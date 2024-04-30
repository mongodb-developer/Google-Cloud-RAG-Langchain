import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { config } from '../../config';
import { NgClass, NgFor, NgIf } from '@angular/common';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import { MarkdownComponent, MarkdownPipe } from 'ngx-markdown';

interface Message {
  text: string;
  timestamp: string;
  type: "human" | "bot";
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    HttpClientModule,
    NgIf,
    NgFor,
    NgClass,
    MatInputModule,
    MatButtonModule,
    MarkdownComponent,
    MarkdownPipe,
  ],
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
    const text = this.messageForm.value.text;

    this.messages.push({
      text,
      timestamp: new Date().toISOString(),
      type: "human"
    });

    this.httpClient.post(`${config.backendUrl}/messages`, { text, rag: true })
      .subscribe({
        next: (response: any) => {
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
