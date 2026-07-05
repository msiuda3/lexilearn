package marcin.siuda.lexilearn.quiz

import marcin.siuda.lexilearn.user.UserRepository
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.UUID

@Service
class QuizService(
    private val questionRepository: QuestionRepository,
    private val quizRepository: QuizRepository,
    private val quizResultRepository: QuizResultRepository,
    private val userRepository: UserRepository,
) {

    @Transactional
    fun generateQuiz(request: QuizGenerateRequest): QuizResponse {
        val allQuestions = questionRepository.findAll()

        if (allQuestions.size < 3) {
            throw IllegalStateException("Not enough questions in the database")
        }

        val selected = allQuestions.shuffled().take(request.questionCount)
        val quiz = Quiz()

        for (question in selected) {
            val distractors = allQuestions
                .filter { it.id != question.id }
                .shuffled()
                .take(2)
                .map { it.polishWord }

            val correctOption = QuizOption(text = question.polishWord)
            val wrongOptions = distractors.map { QuizOption(text = it) }
            val allOptions = (wrongOptions + correctOption).shuffled()

            val quizQuestion = QuizQuestion(
                englishWord = question.englishWord,
                correctOptionId = correctOption.id,
                options = allOptions.toMutableList(),
            )
            quiz.questions.add(quizQuestion)
        }

        quizRepository.save(quiz)
        return toQuizResponse(quiz)
    }

    @Transactional(readOnly = true)
    fun getQuiz(id: UUID): QuizResponse? {
        return quizRepository.findById(id).map { toQuizResponse(it) }.orElse(null)
    }

    @Transactional
    fun submitQuiz(quizId: UUID, request: QuizSubmitRequest): QuizResultResponse {
        val quiz = quizRepository.findById(quizId)
            .orElseThrow { NoSuchElementException("Quiz not found: $quizId") }

        val username = SecurityContextHolder.getContext().authentication.name
        val user = userRepository.findByUsername(username)
            ?: throw IllegalStateException("Authenticated user not found: $username")

        val questionMap = quiz.questions.associateBy { it.id }

        if (request.answers.size != quiz.questions.size) {
            throw IllegalArgumentException(
                "Expected ${quiz.questions.size} answers, got ${request.answers.size}"
            )
        }

        val answerResults = request.answers.map { answer ->
            val question = questionMap[answer.questionId]
                ?: throw IllegalArgumentException("Question ${answer.questionId} not found in quiz $quizId")

            val isCorrect = question.correctOptionId == answer.selectedOptionId
            val correctOption = question.options.find { it.id == question.correctOptionId }
                ?: throw IllegalStateException("Correct option ${question.correctOptionId} not found in question ${question.id}")
            val selectedOption = question.options.find { it.id == answer.selectedOptionId }
                ?: throw IllegalArgumentException("Selected option ${answer.selectedOptionId} not found in question ${question.id}")

            AnswerResult(
                questionId = question.id,
                englishWord = question.englishWord,
                selectedOptionId = answer.selectedOptionId,
                correctOptionId = question.correctOptionId,
                selectedOptionText = selectedOption.text,
                correctOptionText = correctOption.text,
                isCorrect = isCorrect,
            )
        }

        val correctCount = answerResults.count { it.isCorrect }
        val quizResult = QuizResult(
            quizId = quizId,
            user = user,
            totalQuestions = quiz.questions.size,
            correctAnswers = correctCount,
            answers = answerResults.toMutableList(),
        )

        quizResultRepository.save(quizResult)

        return toQuizResultResponse(quizResult)
    }

    @Transactional(readOnly = true)
    fun getMyResults(): List<QuizResultSummaryResponse> {
        val username = SecurityContextHolder.getContext().authentication.name
        val user = userRepository.findByUsername(username)
            ?: throw IllegalStateException("Authenticated user not found: $username")

        return quizResultRepository.findByUserOrderBySubmittedAtDesc(user)
            .map { toSummary(it) }
    }

    @Transactional(readOnly = true)
    fun getResultDetail(resultId: UUID): QuizResultResponse? {
        return quizResultRepository.findById(resultId)
            .map { toQuizResultResponse(it) }
            .orElse(null)
    }

    private fun toSummary(result: QuizResult) = QuizResultSummaryResponse(
        resultId = result.id,
        quizId = result.quizId,
        totalQuestions = result.totalQuestions,
        correctAnswers = result.correctAnswers,
        score = if (result.totalQuestions > 0)
            result.correctAnswers.toDouble() / result.totalQuestions * 100
        else 0.0,
        submittedAt = result.submittedAt,
    )

    private fun toQuizResultResponse(result: QuizResult) = QuizResultResponse(
        quizId = result.quizId,
        totalQuestions = result.totalQuestions,
        correctAnswers = result.correctAnswers,
        score = if (result.totalQuestions > 0)
            result.correctAnswers.toDouble() / result.totalQuestions * 100
        else 0.0,
        submittedAt = result.submittedAt,
        questions = result.answers.map { answer ->
            QuestionResultResponse(
                questionId = answer.questionId,
                englishWord = answer.englishWord,
                selectedOptionId = answer.selectedOptionId,
                correctOptionId = answer.correctOptionId,
                selectedOptionText = answer.selectedOptionText,
                correctOptionText = answer.correctOptionText,
                isCorrect = answer.isCorrect,
            )
        },
    )

    private fun toQuizResponse(quiz: Quiz) = QuizResponse(
        id = quiz.id,
        createdAt = quiz.createdAt,
        questions = quiz.questions.map { toQuestionResponse(it) },
    )

    private fun toQuestionResponse(q: QuizQuestion) = QuizQuestionResponse(
        id = q.id,
        englishWord = q.englishWord,
        options = q.options.map { QuizOptionResponse(id = it.id, text = it.text) },
    )
}
