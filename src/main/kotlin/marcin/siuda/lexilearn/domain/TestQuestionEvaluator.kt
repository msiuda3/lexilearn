package marcin.siuda.lexilearn.domain

import marcin.siuda.lexilearn.domain.model.TestEvaluationResult
import marcin.siuda.lexilearn.domain.model.TestQuestion

interface TestQuestionEvaluator {
   fun evaluateTestQuestion(testQuestion: TestQuestion): TestEvaluationResult
}

class DefaultQuestionEvaluator: TestQuestionEvaluator{
    override fun evaluateTestQuestion(testQuestion: TestQuestion): TestEvaluationResult {
        TODO("Not yet implemented")
    }

}