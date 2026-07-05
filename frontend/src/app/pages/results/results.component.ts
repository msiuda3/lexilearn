import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe, DecimalPipe, NgFor, NgIf } from '@angular/common';
import { QuizService } from '../../services/quiz.service';
import { QuizResultSummaryResponse } from '../../models/quiz.model';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [NgFor, NgIf, DatePipe, DecimalPipe, RouterLink],
  template: `
    <div class="results-page">
      <header>
        <h1>LexiLearn</h1>
        <a routerLink="/dashboard" class="btn-link">Powrót</a>
      </header>

      <h2>Twoje wyniki</h2>

      <div *ngIf="loading" class="loading">Loading results...</div>
      <div *ngIf="error" class="error">{{ error }}</div>

      <div *ngIf="results.length === 0 && !loading && !error" class="empty">
        Brak wyników
      </div>

      <div *ngIf="results.length > 0" class="result-list">
        <a
          *ngFor="let r of results"
          class="result-card"
          [class.good]="r.score >= 80"
          [class.mid]="r.score >= 50 && r.score < 80"
          [class.low]="r.score < 50"
          [routerLink]="['/review', r.resultId]"
        >
          <div class="result-score">{{ r.score | number:'1.0-0' }}%</div>
          <div class="result-meta">
            <span>{{ r.correctAnswers }}/{{ r.totalQuestions }} correct</span>
            <span class="date">{{ r.submittedAt | date:'medium' }}</span>
          </div>
        </a>
      </div>
    </div>
  `,
  styles: [
    `
      .results-page {
        max-width: 720px;
        margin: 0 auto;
        padding: 24px;
        font-family: system-ui, sans-serif;
      }
      header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;
      }
      header h1 {
        margin: 0;
        font-size: 1.5rem;
      }
      .loading,
      .error,
      .empty {
        text-align: center;
        padding: 48px 0;
        color: #666;
      }
      .error {
        color: #d32f2f;
      }
      h2 {
        margin: 0 0 16px;
      }
      .result-list {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      .result-card {
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 16px;
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        text-decoration: none;
        color: inherit;
        transition: box-shadow 0.15s;
      }
      .result-card:hover {
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      }
      .result-score {
        font-size: 1.5rem;
        font-weight: 700;
        min-width: 64px;
        text-align: center;
      }
      .result-meta {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
      .date {
        font-size: 0.85rem;
        color: #888;
      }
      .good { border-left: 4px solid #388e3c; }
      .good .result-score { color: #388e3c; }
      .mid { border-left: 4px solid #f57c00; }
      .mid .result-score { color: #f57c00; }
      .low { border-left: 4px solid #d32f2f; }
      .low .result-score { color: #d32f2f; }
      .btn-link {
        color: #1976d2;
        text-decoration: none;
        font-weight: 500;
      }
      .btn-link:hover {
        text-decoration: underline;
      }
    `,
  ],
})
export class ResultsComponent implements OnInit {
  results: QuizResultSummaryResponse[] = [];
  loading = true;
  error = '';

  constructor(private quizService: QuizService) {}

  ngOnInit(): void {
    this.quizService.getMyResults().subscribe({
      next: (results) => {
        this.results = results;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load results';
        this.loading = false;
      },
    });
  }
}
