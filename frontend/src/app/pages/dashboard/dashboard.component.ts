import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { QuizService } from '../../services/quiz.service';
import { AuthService } from '../../services/auth.service';
import { QuizResponse } from '../../models/quiz.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [FormsModule, RouterLink, NgFor, NgIf, DatePipe],
  template: `
    <div class="dashboard">
      <header>
        <h1>LexiLearn</h1>
        <div class="user-info">
          <span>{{ username }}</span>
          <a routerLink="/results" class="btn-link">Results</a>
          <button class="btn-link" (click)="logout()">Log out</button>
        </div>
      </header>

      <section class="generate-section">
        <h2>Generate Quiz</h2>
        <div class="generate-form">
          <label for="count">Number of questions:</label>
          <input
            id="count"
            type="number"
            min="1"
            max="20"
            [(ngModel)]="questionCount"
          />
          <button (click)="generate()" [disabled]="generating">
            {{ generating ? 'Generating...' : 'Generate' }}
          </button>
        </div>
        <p *ngIf="generateError" class="error">{{ generateError }}</p>
      </section>

      <section class="quizzes-section">
        <h2>Your Quizzes</h2>
        <div *ngIf="quizzes.length === 0" class="empty">
          No quizzes yet. Generate one above!
        </div>
        <div class="quiz-list">
          <div *ngFor="let quiz of quizzes" class="quiz-card">
            <a [routerLink]="['/quiz', quiz.id]">
              <strong>Quiz</strong>
              <span class="meta">{{ quiz.questions.length }} questions</span>
              <span class="date">{{ quiz.createdAt | date:'short' }}</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  `,
})
export class DashboardComponent implements OnInit {
  username: string | null = '';
  questionCount = 5;
  generating = false;
  generateError = '';
  quizzes: QuizResponse[] = [];

  constructor(
    private quizService: QuizService,
    private auth: AuthService,
  ) {}

  ngOnInit(): void {
    this.username = this.auth.getUsername();
  }

  generate(): void {
    this.generateError = '';
    this.generating = true;
    this.quizService
      .generateQuiz({ questionCount: this.questionCount })
      .subscribe({
        next: (quiz) => {
          this.quizzes.unshift(quiz);
          this.generating = false;
        },
        error: () => {
          this.generateError = 'Failed to generate quiz';
          this.generating = false;
        },
      });
  }

  logout(): void {
    this.auth.logout();
    window.location.href = '/login';
  }
}
