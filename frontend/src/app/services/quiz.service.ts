import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  QuizGenerateRequest,
  QuizResponse,
  QuizResultResponse,
  QuizResultSummaryResponse,
  QuizSubmitRequest,
} from '../models/quiz.model';

@Injectable({ providedIn: 'root' })
export class QuizService {
  constructor(private http: HttpClient) {}

  generateQuiz(request: QuizGenerateRequest): Observable<QuizResponse> {
    return this.http.post<QuizResponse>('/api/quizzes/generate', request);
  }

  getQuiz(id: string): Observable<QuizResponse> {
    return this.http.get<QuizResponse>(`/api/quizzes/${id}`);
  }

  submitQuiz(
    quizId: string,
    request: QuizSubmitRequest,
  ): Observable<QuizResultResponse> {
    return this.http.post<QuizResultResponse>(
      `/api/quizzes/${quizId}/submit`,
      request,
    );
  }

  getMyResults(): Observable<QuizResultSummaryResponse[]> {
    return this.http.get<QuizResultSummaryResponse[]>('/api/quizzes/results');
  }

  getResultDetail(resultId: string): Observable<QuizResultResponse> {
    return this.http.get<QuizResultResponse>(
      `/api/quizzes/results/${resultId}`,
    );
  }
}
