package marcin.siuda.lexilearn.quiz

import jakarta.persistence.CollectionTable
import jakarta.persistence.Column
import jakarta.persistence.ElementCollection
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.Table
import java.util.UUID

@Entity
@Table(name = "quiz_questions")
class QuizQuestion(
    @Id
    val id: UUID = UUID.randomUUID(),

    @Column(nullable = false)
    val englishWord: String,

    @Column(nullable = false)
    val correctOptionId: UUID,

    @ElementCollection
    @CollectionTable(
        name = "quiz_question_options",
        joinColumns = [JoinColumn(name = "quiz_question_id")],
    )
    val options: MutableList<QuizOption> = mutableListOf(),
)
