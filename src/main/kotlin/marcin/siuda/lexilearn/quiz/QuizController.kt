package marcin.siuda.lexilearn.quiz

import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.util.UUID

@RestController
@RequestMapping("/api/quizzes")
class QuizController(
    private val quizService: QuizService,
) {

    @PostMapping("/generate")
    fun generate(@Valid @RequestBody request: QuizGenerateRequest): ResponseEntity<QuizResponse> {
        val response = quizService.generateQuiz(request)
        return ResponseEntity.status(HttpStatus.CREATED).body(response)
    }

    @GetMapping("/{id}")
    fun getQuiz(@PathVariable id: UUID): ResponseEntity<QuizResponse> {
        return quizService.getQuiz(id)
            ?.let { ResponseEntity.ok(it) }
            ?: ResponseEntity.notFound().build()
    }

    @PostMapping("/{quizId}/submit")
    fun submitQuiz(
        @PathVariable quizId: UUID,
        @Valid @RequestBody request: QuizSubmitRequest,
    ): ResponseEntity<QuizResultResponse> {
        val response = quizService.submitQuiz(quizId, request)
        return ResponseEntity.ok(response)
    }

    @GetMapping("/results")
    fun getMyResults(): ResponseEntity<List<QuizResultSummaryResponse>> {
        return ResponseEntity.ok(quizService.getMyResults())
    }

    @GetMapping("/results/{resultId}")
    fun getResultDetail(@PathVariable resultId: UUID): ResponseEntity<QuizResultResponse> {
        return quizService.getResultDetail(resultId)
            ?.let { ResponseEntity.ok(it) }
            ?: ResponseEntity.notFound().build()
    }

    @ExceptionHandler(NoSuchElementException::class)
    fun handleNotFound(): ResponseEntity<Unit> = ResponseEntity.notFound().build()

    @ExceptionHandler(IllegalArgumentException::class)
    fun handleBadRequest(e: IllegalArgumentException): ResponseEntity<String> =
        ResponseEntity.badRequest().body(e.message)
}
