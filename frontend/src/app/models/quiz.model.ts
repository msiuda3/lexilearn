export interface QuizGenerateRequest {
  questionCount: number;
}

export interface QuizResponse {
  id: string;
  createdAt: string;
  questions: QuizQuestionResponse[];
}

export interface QuizQuestionResponse {
  id: string;
  englishWord: string;
  options: QuizOptionResponse[];
}

export interface QuizOptionResponse {
  id: string;
  text: string;
}

export interface QuizSubmitRequest {
  answers: QuizAnswerRequest[];
}

export interface QuizAnswerRequest {
  questionId: string;
  selectedOptionId: string;
}

export interface QuizResultSummaryResponse {
  resultId: string;
  quizId: string;
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  submittedAt: string;
}

export interface QuizResultResponse {
  quizId: string;
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  submittedAt: string;
  questions: QuestionResultResponse[];
}

export interface QuestionResultResponse {
  questionId: string;
  englishWord: string;
  selectedOptionId: string;
  correctOptionId: string;
  selectedOptionText: string;
  correctOptionText: string;
  isCorrect: boolean;
}
