package marcin.siuda.lexilearn.quiz

import org.springframework.data.jpa.repository.JpaRepository
import java.util.UUID

interface QuizRepository : JpaRepository<Quiz, UUID>
