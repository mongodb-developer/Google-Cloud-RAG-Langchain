import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { config } from '../../config';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MarkdownComponent, MarkdownPipe } from 'ngx-markdown';

interface Message {
  text: string;
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
    MatCheckboxModule,
    MatButtonToggleModule,
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
      rag: [false]
    });
  }

  submitForm(): void {
    const { text, rag } = this.messageForm.value;

    this.messages.push({
      text,
      type: "human"
    });

    this.httpClient.post(`${config.backendUrl}/messages`, { text, rag })
      .subscribe({
        next: (response: any) => {
          this.messages.push({
            text: response.text,
            type: "bot"
          });
        },
        error: (error: any) => {
          console.error(error);
        }
      });

    this.messageForm.reset();
    // Persist the value of the rag toggle
    this.messageForm.patchValue({ rag });
  }
}
