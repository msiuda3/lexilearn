package marcin.siuda.lexilearn.quiz

import jakarta.persistence.Column
import jakarta.persistence.Embeddable
import java.util.UUID

@Embeddable
class QuizOption(
    val id: UUID = UUID.randomUUID(),

    @Column(nullable = false)
    val text: String,
)
