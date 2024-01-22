import './App.css'
import StartScreen from './components/StartScreen'
import GameScreen from './components/GameScreen'
import EndScreen from './components/EndScreen'

//React Hooks
import { useCallback, useEffect, useState } from 'react'
// data
import { wordsList } from './data/words'
//components
const stages = [
  {id: 1, name: "start"},
  {id: 2, name: "game"},
  {id: 3, name: "end"}
]
function App() {
  const [gameStage, setGameStage] = useState(stages[0].name);

  const [words] = useState(wordsList);

  const [pickedCategory, setPickedCategory] = useState("")
  const [pickedWord, setPickedWord] = useState("")

  const [guesses, setGuesses] = useState(3)
  const [letters, setLetters] = useState([])
  const [wrongLetters, setWrongLetters] = useState([])
  const [guessedLetters, setGuessedLetters] = useState([])
  const [score, setScore] = useState(0)

  const pickWordAndCategory = useCallback(() => {

    //pick a random category
    const categories = Object.keys(words)
    const category = categories[Math.floor(Math.random() * Object.keys(categories).length)]


    //pick a random word
    const word = words[category][Math.floor(Math.random() * words[category].length)]

    return {word, category}
  }, [words])

  // começa o jogo
  const startGame = useCallback(() => {
    //clear all letters
    clearLetterStates();
    setGuesses(3)
    // pick a category
    const {word, category} = pickWordAndCategory();

    //create a array of letters
    let wordLetters = word.split("")

    wordLetters = wordLetters.map((l) => l.toLowerCase());
    //set
    setPickedCategory(category);
    setPickedWord(word);
    setLetters(wordLetters);


    setGameStage(stages[1].name)
  }, [pickWordAndCategory])

  // verifica a letra do input

  const verifyLetter = (letter) => {
    const normalizedLetter = letter.toLowerCase();

    // check if letter has already been utilized
    if(guessedLetters.includes(normalizedLetter) || wrongLetters.includes(normalizedLetter)) {
      return;
    } 

    //push guessed letter or remove a guess

    if(letters.includes(normalizedLetter)) {
      setGuessedLetters((actualGuessedLetters) => [
        ...actualGuessedLetters, normalizedLetter,
      ])

    } else {
      setWrongLetters((actualWrongLetters) => [
        ...actualWrongLetters, normalizedLetter,
      ])
          //decrease guesses
      setGuesses((actualGuesses) => actualGuesses - 1)   
    }
  }

  const clearLetterStates = () => {
    setGuessedLetters([])
    setWrongLetters([])
  }
  // limpa e vai pro fim
  useEffect(() => {
    if(guesses <= 0) {
      clearLetterStates();
      setGameStage(stages[2].name)
    }
  }, [guesses])

  // check win condition

  useEffect(() => {
    const uniqueLetters = [... new Set(letters)]

    //win condition 
    if(guessedLetters.length === uniqueLetters.length && gameStage === stages[1].name){
      // add score
      setScore((actualScore) => actualScore =+ 100)

      //start game with new word
      startGame();
    }

  }, [guessedLetters, letters, startGame])

  // reniciar jogo
  const resetGame = () => {
    setScore(0)
    setGuesses(3)
    setGameStage(stages[0].name)
  }

  return (
    <>
      {gameStage === "start" && <StartScreen startGame={startGame}/>}
      {gameStage === "game" && <GameScreen
       verifyLetter={verifyLetter} 
       pickedWord={pickedWord} 
       pickedCategory={pickedCategory} 
       letters={letters}
       wrongLetters={wrongLetters}
       guesses={guesses}
       guessedLetters={guessedLetters}
       score={score}
       />}
      {gameStage === "end" && <EndScreen resetGame={resetGame} score={score}/>}
    </>
  )
}

export default App
