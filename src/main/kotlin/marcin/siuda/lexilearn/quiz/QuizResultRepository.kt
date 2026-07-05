package marcin.siuda.lexilearn.quiz

import marcin.siuda.lexilearn.user.User
import org.springframework.data.jpa.repository.JpaRepository
import java.util.UUID

interface QuizResultRepository : JpaRepository<QuizResult, UUID> {
    fun findByUserOrderBySubmittedAtDesc(user: User): List<QuizResult>
}
