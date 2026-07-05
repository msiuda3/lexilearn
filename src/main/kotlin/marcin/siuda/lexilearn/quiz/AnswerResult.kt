package marcin.siuda.lexilearn.quiz

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.util.UUID

@Entity
@Table(name = "quiz_answer_results")
class AnswerResult(
    @Id
    val id: UUID = UUID.randomUUID(),

    @Column(nullable = false)
    val questionId: UUID,

    @Column(nullable = false)
    val englishWord: String,

    @Column(nullable = false)
    val selectedOptionId: UUID,

    @Column(nullable = false)
    val correctOptionId: UUID,

    @Column(nullable = false)
    val selectedOptionText: String,

    @Column(nullable = false)
    val correctOptionText: String,

    @Column(nullable = false)
    val isCorrect: Boolean,
)
