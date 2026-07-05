package marcin.siuda.lexilearn.quiz

import jakarta.annotation.PostConstruct
import org.springframework.stereotype.Component

@Component
class QuestionSeeder(
    private val questionRepository: QuestionRepository,
) {

    @PostConstruct
    fun seed() {
        if (questionRepository.count() > 0) return

        questionRepository.saveAll(
            listOf(
                Question(englishWord = "dog", polishWord = "pies"),
                Question(englishWord = "cat", polishWord = "kot"),
                Question(englishWord = "house", polishWord = "dom"),
                Question(englishWord = "car", polishWord = "samochód"),
                Question(englishWord = "book", polishWord = "książka"),
                Question(englishWord = "water", polishWord = "woda"),
                Question(englishWord = "sun", polishWord = "słońce"),
                Question(englishWord = "tree", polishWord = "drzewo"),
                Question(englishWord = "bird", polishWord = "ptak"),
                Question(englishWord = "fish", polishWord = "ryba"),
                Question(englishWord = "apple", polishWord = "jabłko"),
                Question(englishWord = "bread", polishWord = "chleb"),
                Question(englishWord = "milk", polishWord = "mleko"),
                Question(englishWord = "hand", polishWord = "ręka"),
                Question(englishWord = "eye", polishWord = "oko"),
            ),
        )
    }
}
