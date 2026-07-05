package marcin.siuda.lexilearn.quiz

import jakarta.persistence.CascadeType
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.OneToMany
import jakarta.persistence.Table
import java.time.Instant
import java.util.UUID

@Entity
@Table(name = "quizzes")
class Quiz(
    @Id
    val id: UUID = UUID.randomUUID(),

    @Column(nullable = false)
    val createdAt: Instant = Instant.now(),

    @OneToMany(cascade = [CascadeType.ALL], orphanRemoval = true)
    @JoinColumn(name = "quiz_id")
    val questions: MutableList<QuizQuestion> = mutableListOf(),
)
