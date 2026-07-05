package marcin.siuda.lexilearn.quiz

import jakarta.persistence.CascadeType
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import jakarta.persistence.OneToMany
import jakarta.persistence.Table
import marcin.siuda.lexilearn.user.User
import java.time.Instant
import java.util.UUID

@Entity
@Table(name = "quiz_results")
class QuizResult(
    @Id
    val id: UUID = UUID.randomUUID(),

    @Column(nullable = false)
    val quizId: UUID,

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    val user: User,

    @Column(nullable = false)
    val totalQuestions: Int,

    @Column(nullable = false)
    val correctAnswers: Int,

    @Column(nullable = false)
    val submittedAt: Instant = Instant.now(),

    @OneToMany(cascade = [CascadeType.ALL], orphanRemoval = true)
    @JoinColumn(name = "quiz_result_id")
    val answers: MutableList<AnswerResult> = mutableListOf(),
)
