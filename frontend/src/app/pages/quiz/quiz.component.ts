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
  selector: 'app-quiz',
  standalone: true,
  imports: [NgFor, NgIf, DecimalPipe, RouterLink],
  template: `
    <div class="quiz-page">
      <header>
        <h1>LexiLearn</h1>
        <a routerLink="/dashboard" class="btn-link">Back to Dashboard</a>
      </header>

      <div *ngIf="loading" class="loading">Loading quiz...</div>
      <div *ngIf="error" class="error">{{ error }}</div>

      <div *ngIf="quiz && !result" class="quiz-container">
        <h2>Quiz</h2>
        <p class="quiz-meta">{{ quiz.questions.length }} questions</p>

        <div
          *ngFor="let question of quiz.questions; let i = index"
          class="question-block"
        >
          <h3>{{ i + 1 }}. {{ question.englishWord }}</h3>
          <div class="options">
            <label
              *ngFor="let option of question.options"
              class="option"
              [class.selected]="selectedAnswers[question.id] === option.id"
            >
              <input
                type="radio"
                [name]="question.id"
                [value]="option.id"
                [checked]="selectedAnswers[question.id] === option.id"
                [disabled]="submitting"
                (change)="selectedAnswers[question.id] = option.id"
              />
              {{ option.text }}
            </label>
          </div>
        </div>

        <button
          class="btn-submit"
          (click)="onSubmit()"
          [disabled]="!allAnswered || submitting"
        >
          {{ submitting ? 'Submitting...' : 'Submit Answers' }}
        </button>
      </div>

      <div *ngIf="result" class="result-container">
        <h2>Results</h2>
        <div class="score-card">
          <span class="score-value">{{ result.correctAnswers }}</span>
          /
          <span class="score-total">{{ result.totalQuestions }}</span>
          <span class="score-pct">({{ result.score | number: '1.0-0' }}%)</span>
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

        <a routerLink="/dashboard" class="btn-link">Back to Dashboard</a>
      </div>
    </div>
  `,
  styles: [
    `
      .quiz-page {
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
      .quiz-meta {
        color: #666;
        margin: 0 0 24px;
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
        cursor: pointer;
        transition: background 0.15s;
      }
      .option:hover {
        background: #f5f5f5;
      }
      .option.selected {
        background: #e3f2fd;
        border-color: #1976d2;
      }
      .option input[type='radio'] {
        margin: 0;
      }
      .btn-submit {
        display: block;
        width: 100%;
        padding: 12px;
        font-size: 1rem;
        font-weight: 600;
        color: #fff;
        background: #1976d2;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        margin-top: 16px;
      }
      .btn-submit:disabled {
        background: #bdbdbd;
        cursor: not-allowed;
      }
      .btn-link {
        color: #1976d2;
        text-decoration: none;
        font-weight: 500;
      }
      .btn-link:hover {
        text-decoration: underline;
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
      .result-options .option {
        cursor: default;
      }
      .result-options .option:hover {
        background: inherit;
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
    `,
  ],
})
export class QuizComponent implements OnInit {
  quiz: QuizResponse | null = null;
  result: QuizResultResponse | null = null;
  resultQuestions: ResultQuestionView[] = [];
  selectedAnswers: Record<string, string> = {};
  loading = true;
  submitting = false;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private quizService: QuizService,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error = 'No quiz ID provided';
      this.loading = false;
      return;
    }

    this.quizService.getQuiz(id).subscribe({
      next: (quiz) => {
        this.quiz = quiz;
        this.loading = false;
      },
      error: () => {
        this.error = 'Quiz not found';
        this.loading = false;
      },
    });
  }

  get allAnswered(): boolean {
    if (!this.quiz) return false;
    return this.quiz.questions.every((q) => this.selectedAnswers[q.id] != null);
  }

  onSubmit(): void {
    if (!this.quiz || !this.allAnswered || this.submitting) return;

    this.submitting = true;

    const answers = this.quiz.questions.map((q) => ({
      questionId: q.id,
      selectedOptionId: this.selectedAnswers[q.id],
    }));

    this.quizService.submitQuiz(this.quiz.id, { answers }).subscribe({
      next: (result) => {
        this.result = result;
        this.resultQuestions = this.buildResultQuestions(result);
        this.submitting = false;
      },
      error: () => {
        this.error = 'Failed to submit quiz';
        this.submitting = false;
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
