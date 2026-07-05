import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DecimalPipe, NgFor, NgIf } from '@angular/common';
import { QuizService } from '../../services/quiz.service';
import {
  QuizResponse,
  QuizResultResponse,
} from '../../models/quiz.model';

interface ResultQuestionView {
  englishWord: string;
  isCorrect: boolean;
  options: { id: string; text: string; state: 'neutral' | 'correct' | 'wrong' }[];
}

@Component({
  selector: 'app-review',
  standalone: true,
  imports: [NgFor, NgIf, DecimalPipe, RouterLink],
  template: `
    <div class="review-page">
      <header>
        <h1>LexiLearn</h1>
        <a routerLink="/results" class="btn-link">Back to Results</a>
      </header>

      <div *ngIf="loading" class="loading">Loading review...</div>
      <div *ngIf="error" class="error">{{ error }}</div>

      <div *ngIf="result && quiz" class="review-container">
        <h2>Quiz Review</h2>
        <div class="score-card">
          <span class="score-value">{{ result.correctAnswers }}</span>
          /
          <span class="score-total">{{ result.totalQuestions }}</span>
          <span class="score-pct">({{ result.score | number:'1.0-0' }}%)</span>
        </div>

        <div
          *ngFor="let q of resultQuestions; let i = index"
          class="question-block"
          [class.correct]="q.isCorrect"
          [class.incorrect]="!q.isCorrect"
        >
          <h3>{{ i + 1 }}. {{ q.englishWord }}</h3>
          <div class="options result-options">
            <div
              *ngFor="let opt of q.options"
              class="option"
              [class.selected-correct]="opt.state === 'correct'"
              [class.selected-wrong]="opt.state === 'wrong'"
            >
              {{ opt.text }}
              <span *ngIf="opt.state === 'correct'" class="badge-correct">correct</span>
              <span *ngIf="opt.state === 'wrong'" class="badge-wrong">your answer</span>
            </div>
          </div>
        </div>

        <a routerLink="/results" class="btn-link">Back to Results</a>
      </div>
    </div>
  `,
  styles: [
    `
      .review-page {
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
      .error {
        text-align: center;
        padding: 48px 0;
        color: #666;
      }
      .error {
        color: #d32f2f;
      }
      h2 {
        margin: 0 0 8px;
      }
      .question-block {
        margin-bottom: 24px;
        padding: 16px;
        border: 1px solid #e0e0e0;
        border-radius: 8px;
      }
      .question-block h3 {
        margin: 0 0 12px;
        font-size: 1.1rem;
      }
      .options {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .option {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 10px 12px;
        border: 1px solid #e0e0e0;
        border-radius: 6px;
      }
      .result-options .option {
        cursor: default;
      }
      .selected-correct {
        background: #c8e6c9 !important;
        border-color: #388e3c !important;
        font-weight: 600;
      }
      .selected-wrong {
        background: #ffcdd2 !important;
        border-color: #d32f2f !important;
        font-weight: 600;
      }
      .badge-correct,
      .badge-wrong {
        font-size: 0.75rem;
        padding: 2px 8px;
        border-radius: 4px;
        margin-left: auto;
      }
      .badge-correct {
        background: #388e3c;
        color: #fff;
      }
      .badge-wrong {
        background: #d32f2f;
        color: #fff;
      }
      .score-card {
        text-align: center;
        font-size: 1.5rem;
        padding: 24px;
        margin-bottom: 24px;
        background: #f5f5f5;
        border-radius: 8px;
      }
      .score-value {
        font-weight: 700;
        font-size: 2rem;
        color: #1976d2;
      }
      .score-total {
        font-size: 1.5rem;
        color: #666;
      }
      .score-pct {
        font-size: 1.2rem;
        color: #666;
        margin-left: 8px;
      }
      .correct {
        border-color: #a5d6a7;
        background: #f1f8e9;
      }
      .incorrect {
        border-color: #ef9a9a;
        background: #fff5f5;
      }
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
export class ReviewComponent implements OnInit {
  quiz: QuizResponse | null = null;
  result: QuizResultResponse | null = null;
  resultQuestions: ResultQuestionView[] = [];
  loading = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private quizService: QuizService,
  ) {}

  ngOnInit(): void {
    const resultId = this.route.snapshot.paramMap.get('resultId');
    if (!resultId) {
      this.error = 'No result ID provided';
      this.loading = false;
      return;
    }

    this.quizService.getResultDetail(resultId).subscribe({
      next: (result) => {
        this.result = result;
        this.quizService.getQuiz(result.quizId).subscribe({
          next: (quiz) => {
            this.quiz = quiz;
            this.resultQuestions = this.buildResultQuestions(result);
            this.loading = false;
          },
          error: () => {
            this.error = 'Failed to load quiz details';
            this.loading = false;
          },
        });
      },
      error: () => {
        this.error = 'Result not found';
        this.loading = false;
      },
    });
  }

  private buildResultQuestions(result: QuizResultResponse): ResultQuestionView[] {
    if (!this.quiz) return [];

    return result.questions.map((rq) => {
      const quizQuestion = this.quiz!.questions.find(
        (q) => q.id === rq.questionId,
      );
      const options = (quizQuestion?.options ?? []).map((opt) => {
        let state: 'neutral' | 'correct' | 'wrong' = 'neutral';
        if (opt.id === rq.correctOptionId) state = 'correct';
        if (opt.id === rq.selectedOptionId && !rq.isCorrect) state = 'wrong';
        return { id: opt.id, text: opt.text, state };
      });

      return { englishWord: rq.englishWord, isCorrect: rq.isCorrect, options };
    });
  }
}
