package marcin.siuda.lexilearn.quiz

import jakarta.validation.constraints.Max
import jakarta.validation.constraints.Min
import java.time.Instant
import java.util.UUID

data class QuizGenerateRequest(
    @field:Min(1) @field:Max(20)
    val questionCount: Int = 5,
)

data class QuizResponse(
    val id: UUID,
    val createdAt: Instant,
    val questions: List<QuizQuestionResponse>,
)

data class QuizQuestionResponse(
    val id: UUID,
    val englishWord: String,
    val options: List<QuizOptionResponse>,
)

data class QuizOptionResponse(
    val id: UUID,
    val text: String,
)

data class QuizSubmitRequest(
    val answers: List<QuizAnswerRequest>,
)

data class QuizAnswerRequest(
    val questionId: UUID,
    val selectedOptionId: UUID,
)

data class QuizResultSummaryResponse(
    val resultId: UUID,
    val quizId: UUID,
    val totalQuestions: Int,
    val correctAnswers: Int,
    val score: Double,
    val submittedAt: Instant,
)

data class QuizResultResponse(
    val quizId: UUID,
    val totalQuestions: Int,
    val correctAnswers: Int,
    val score: Double,
    val submittedAt: Instant,
    val questions: List<QuestionResultResponse>,
)

data class QuestionResultResponse(
    val questionId: UUID,
    val englishWord: String,
    val selectedOptionId: UUID,
    val correctOptionId: UUID,
    val selectedOptionText: String,
    val correctOptionText: String,
    val isCorrect: Boolean,
)
