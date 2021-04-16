import React, {Component} from "react";
import classes from './Quiz.css'
import ActiveQuiz from "../../components/ActiveQuiz/ActiveQuiz";
import FinishedQuiz from '../../components/FinishedQuiz/FinishedQuiz'

class Quiz extends Component {
	state = {
		results: {}, // { [id]: 'success' or 'error'
		isFinished: false,
		activeQuestion: 0,
		answerState: null, // { [id]: 'success' or 'error'
		quiz: [
			{
				question: 'Сколько оскаров у Николсона?',
				rightAnswerId: 2,
				id: 1,
				answers: [
					{text: '1', id: 0},
					{text: '2', id: 1},
					{text: '3', id: 2},
					{text: '4', id: 3}
				]
			},
			{
				question: 'Сколько сидел Мандела?',
				rightAnswerId: 1,
				id: 2,
				answers: [
					{text: '15 лет', id: 0},
					{text: '27 лет', id: 1},
					{text: '37 лет', id: 2},
					{text: '42 года', id: 3}
				]
			},
		]
	}

	onAnswerClickHandler = answerId => {

		if (this.state.answerState) {
			const key = Object.keys(this.state.answerState)[0]
			if (this.state.answerState[key] === 'success') {
				return
			}
		}

		const question = this.state.quiz[this.state.activeQuestion]
		const results = this.state.results

		if (question.rightAnswerId === answerId) {

			if (!results[question.id]) {
				results[question.id] = 'success'
			}

			this.setState({
				answerState: {[answerId]: 'success'},
				results
			})

			const timeout = window.setTimeout(() => {
				if (this.isQuizFinished()) {
					this.setState({
						isFinished: true
					})
				} else {
					this.setState({
						activeQuestion: this.state.activeQuestion + 1,
						answerState: null
					})
				}
				window.clearTimeout(timeout)
			}, 1000)
		} else {
			results[question.id] = 'error'
			this.setState({
				answerState: {[answerId]: 'error'},
				results
			})
		}
	}

	isQuizFinished() {
		return this.state.activeQuestion + 1 === this.state.quiz.length
	}

	retryHandler = () => {
		this.setState({
			activeQuestion: 0,
			answerState: null,
			isFinished: false,
			results: {}
		})
	}

	componentDidMount() {
		console.log('Quiz id:', this.props.match.params.id)
	}

	render() {
		return (
			<div className={classes.Quiz}>

				<div className={classes.QuizWrapper}>
					<h1>Ответьте на вопросы</h1>

					{
						this.state.isFinished
							? <FinishedQuiz
									results={this.state.results}
									quiz={this.state.quiz}
									onRetry={this.retryHandler}
								/>
							: <ActiveQuiz
									answers={this.state.quiz[this.state.activeQuestion].answers}
									question={this.state.quiz[this.state.activeQuestion].question}
									onAnswerClick={this.onAnswerClickHandler}
									quizLenght={this.state.quiz.length}
									answerNumber={this.state.activeQuestion + 1}
									state={this.state.answerState}
								/>
					}
				</div>
			</div>
		)
	}
}

export default Quiz