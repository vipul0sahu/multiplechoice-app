import { useEffect, useState } from 'react'
import './App.css'

function App() {
  
  const [question, setQuestion] = useState(null)
  // console.log(question)

  useEffect(() => {

    fetch("https://the-trivia-api.com/v2/questions")
    .then(res => res.json())
    .then(data => {

      const modifiedData = data.map(question => {
        const allAnswers = [...question.incorrectAnswers.map(answer => ({ answer, backgroundColor: 'black' })), { answer: question.correctAnswer, backgroundColor: 'black' }]
        const shuffledAnswers = shuffleArray(allAnswers)
        return {...question, shuffledAnswers}
      })

      setQuestion(modifiedData)})

  }, [])

  const handleClick = (questionId, index, correctAnswer) => {
    const selectedAnswer = question.find(q => q.id === questionId).shuffledAnswers[index]
    const isCorrect = selectedAnswer.answer === correctAnswer

    const updatedQuestion = question.map(q => {

      if (q.id === questionId) {
        return {
          ...q,
          shuffledAnswers: q.shuffledAnswers.map((answer, i) => ({
            ...answer,
            backgroundColor: index === i ? (isCorrect ? "green" : "red") : "black"
          }))
        }
      }
      return q;
    })

    setQuestion(updatedQuestion)
  }

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }



  function getQuestion() {

    const value = question.map(data => { 


    return (

      <div className='container__section'  key={data.id}> 
  
        <p className='section__question'>
          {data.question.text}
        </p>
  
        <ul className='section__answer'>
  
          {data.shuffledAnswers.map(({answer, backgroundColor}, index) => (
            <li className='section__answer-item' key={index}>
              <button 
              className="section__answer-button"
              style={{ backgroundColor }}
              onClick={() => handleClick(data.id, index, data.correctAnswer)}>
                {answer}
              </button>
            </li>
          ))}

        </ul>

      </div>
    )

})
      

    return value

} 


  function resetGame() {

  }

  function marksObtained() {
    let marks = 0
      question?.forEach(q => {
        q.shuffledAnswers.forEach(answer => {
          if(answer.backgroundColor === 'green') {
            marks +=1
          }
        })
      })

    return marks
  }




  return (
    <div className='container'>
  
        {question ? getQuestion() : <p>...Loading</p>}

      <div className="container__score">
        <p className='score__title'>You scored {marksObtained()} / 10 correct answers</p>
        <button className='score__button' onClick={resetGame}>Play again</button>
      </div>
    </div>
  )
}

export default App
