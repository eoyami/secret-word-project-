import './EndScreen.css'

const EndScreen = ({resetGame, score}) => {
  return (
    <div>
      <h1>Fim do Jogo!</h1>
      <h2>Sua pontuação foi <span>{score}</span></h2>
      <button onClick={resetGame}>Voltar ao início</button>
    </div>
  )
}

export default EndScreen