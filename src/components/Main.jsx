import React, { useState } from 'react'
import Header from './Header'
import {languages} from "./languages"
import clsx from 'clsx'
import { getFarewellText , getRandomWord} from './utils'
import Confetti from 'react-confetti'

export default function Main() {

    const[currentWord, setCurrentWord] = useState(() => getRandomWord())
    const[guessedLetters, setGuessedLetters] = useState([])

    const wrongGuessCount = guessedLetters.filter(letter => !currentWord.includes(letter)).length

    const isGameWon = currentWord.split("").every(letter => guessedLetters.includes(letter))

    const isGameLost = wrongGuessCount >= languages.length - 1

    const isGameOver = isGameWon || isGameLost

    const lastGuessedLetter = guessedLetters[guessedLetters.length - 1]
    const isLastGuessIncorrect = lastGuessedLetter && !currentWord.includes(lastGuessedLetter)

    const alphabet = "abcdefghijklmnopqrstuvwxyz"

    function addGuessedLetter(letter) {
        setGuessedLetters(prev => 
            prev.includes(letter) ? prev : [...prev, letter]
        )
    }

    function startNewGame() {
        setCurrentWord(getRandomWord())
        setGuessedLetters([])
    }

    const languageElements = languages.map((lang,index) => {
        const isLanguageLost = index < wrongGuessCount

        const styles = {
            backgroundColor: lang.backgroundColor,
            color: lang.color
        }
        
        const className = clsx("chip", isLanguageLost && "lost")
        return (
            <span 
                className={className} 
                style={styles}
                key={lang.name}
            >{lang.name}</span>
        )
    })

    const letterElements = currentWord.split("").map((letter,index)=> {
        const shouldRevealLetter = isGameLost || guessedLetters.includes(letter)
        const letterClassName = clsx(
            isGameLost && !guessedLetters.includes(letter) && "missed-letter"
        )
        return (
            <span key={index} className={letterClassName}>
            {shouldRevealLetter ? letter.toUpperCase() : ""}</span>
        )
    })

    const keyboardElements = alphabet.split("").map(letter => {
        const isGuessed = guessedLetters.includes(letter)
        const isCorrect = isGuessed && currentWord.includes(letter)
        const isWrong = isGuessed && !currentWord.includes(letter)
        const className = clsx({
            correct: isCorrect,
            wrong: isWrong
        })

        return (
            <button
                className={className} 
                key={letter}
                disabled={isGameOver} 
                aria-disabled={guessedLetters.includes(letter)}
                aria-label={`Letter ${letter}`}
                onClick={() => addGuessedLetter(letter)}
            >{letter.toUpperCase()}</button>
        )

    })

    const gameStatusClass = clsx("game-status", {
        won: isGameWon,
        lost: isGameLost,
        farewell: !isGameOver && isLastGuessIncorrect
    })

    function renderGameStatus(){
        if(!isGameOver && isLastGuessIncorrect){
            return (
                <p className='farewell-message'>
                    {getFarewellText(languages[wrongGuessCount - 1].name)}
                </p>
            )
        }

        if(isGameWon){
            return (
                <>
                    <h2>You win!</h2>
                    <p>Well done! </p>
                </>
            )
        }

        if(isGameLost){
            return (
                <>
                    <h2>Game over!</h2>
                    <p>You lose! Better start learning Assembly</p>
                </>
            )
        }

        return null
    }

  return (
    <main>
        {
            isGameWon &&
                <Confetti 
                    recycle={false}
                    numberOfPieces={1000}    
                />
        }
        <Header />
        <section className={gameStatusClass} aria-live='polite' role='status'>
            {renderGameStatus()}
        </section>
        <section className='language-chips'>
            {languageElements}
        </section>
        <section className='word'>
            {letterElements}
        </section>
        <section className='sr-only' aria-live='polite' role='status'>
            <p>Current word: {currentWord.split("").map(letter => guessedLetters.includes(letter) ? letter + ".": "blank.").join(" ")}</p>
        </section>
        <section className='keyboard'>
            {keyboardElements}
        </section>
        {isGameOver && <button onClick={startNewGame} className='new-game'>New Game</button> }
    </main>

  )
}
