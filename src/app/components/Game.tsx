"use client"

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Space_Mono } from "next/font/google";
import { MdTimer } from 'react-icons/md';
import { updatePlayerScoreRequest } from '../utils/dbCalls';

const spaceMono = Space_Mono({
    subsets: ['latin'],
    display: 'swap',
    weight: "400"
});

const wordLists = {
    3: [
        { jumbled: "tca", correct: "cat" },
        { jumbled: "dgo", correct: "god" },
        { jumbled: "atr", correct: "rat" },
        { jumbled: "tsi", correct: "its" },
        { jumbled: "onw", correct: "won" },
        { jumbled: "eyb", correct: "bye" },
        { jumbled: "maj", correct: "jam" },
        { jumbled: "owc", correct: "cow" },
        { jumbled: "lte", correct: "let" },
        { jumbled: "ora", correct: "oar" },
    ],
    5: [
        { jumbled: "tapel", correct: "plate" },
        { jumbled: "ehart", correct: "heart" },
        { jumbled: "soaln", correct: "salon" },
        { jumbled: "erats", correct: "stare" },
        { jumbled: "glean", correct: "angel" },
        { jumbled: "eildf", correct: "field" },
        { jumbled: "ecgar", correct: "grace" },
        { jumbled: "esino", correct: "noise" },
        { jumbled: "rtagn", correct: "grant" },
        { jumbled: "balet", correct: "table" }
    ],
    7: [
        { jumbled: "rrcaeir", correct: "carrier" },
        { jumbled: "dcanngi", correct: "dancing" },
        { jumbled: "lieahng", correct: "healing" },
        { jumbled: "hancene", correct: "enhance" },
        { jumbled: "mrifcon", correct: "confirm" },
        { jumbled: "ournalj", correct: "journal" },
        { jumbled: "acificp", correct: "pacific" },
        { jumbled: "erfectp", correct: "perfect" },
        { jumbled: "iousres", correct: "serious" },
        { jumbled: "sietyoc😃", correct: "society" }
    ]
};

interface WordJumbleGameProps {
    player: number;
    gameID: string;
}

export const Game: React.FC<WordJumbleGameProps> = ({ player, gameID }) => {
    const [currentWord, setCurrentWord] = useState<{jumbled: string, correct: string} | null>(null);
    const [userInput, setUserInput] = useState('');
    const [hasUpdatedScore, setHasUpdatedScore] = useState(false);
    const [score, setScore] = useState(0);
    const [startTime, setStartTime] = useState<number | null>(null);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleUpdateScore = useCallback(async () => {
        if (hasUpdatedScore) return;
    
        const currentScore = score; 
        
        try {
            setHasUpdatedScore(true);
            
            const result = await updatePlayerScoreRequest(gameID, player, currentScore);
        
            if (result.success) {
              console.log('Score updated successfully:', result.game);
            } else {
              console.error('Update failed:', result.error || 'Unknown error');
              setHasUpdatedScore(false);
            }
        } catch {
            console.error('Failed to update Score');
            setHasUpdatedScore(false);
        }
    }, [gameID, player, score, hasUpdatedScore]);

    // Randomly select a word length (3, 5, or 7)
    const selectWordLength = () => {
        const lengths = [3, 5, 7];
        return lengths[Math.floor(Math.random() * lengths.length)];
    };

    // Select a random word from the given length list
    const selectRandomWord = (length: number) => {
        const words = wordLists[length as keyof typeof wordLists];
        return words[Math.floor(Math.random() * words.length)];
    };

    const startGame = () => {
        setStartTime(Date.now());
        setScore(0);
        setGameOver(false);
        setCurrentWord(selectRandomWord(selectWordLength()));
        if (inputRef.current) inputRef.current.focus();
    };

    // Check user input
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentWord) return;

        if (userInput.toLowerCase().trim() === currentWord.correct) {
            setScore(prev => prev + 1);
        }

        // Select next word
        setCurrentWord(selectRandomWord(selectWordLength()));
        setUserInput('');
    };

    // Timer and game over logic
    useEffect(() => {
        let interval: NodeJS.Timeout | undefined;
        if (startTime) {
            interval = setInterval(() => {
                const now = Date.now();
                const elapsed = (now - startTime) / 1000;
                
                if (elapsed >= 10) {
                    clearInterval(interval);
                    setGameOver(true);
                    setElapsedTime(10);
                    
                    // Only call if not already updated
                    if (!hasUpdatedScore) {
                        handleUpdateScore();
                        setTimeout(() => {
                            location.reload();
                        }, 2000);
                    }
                } else {
                    setElapsedTime(elapsed);
                }
            }, 100);
        }
    
        return () => clearInterval(interval);
    }, [startTime, handleUpdateScore, hasUpdatedScore]);

    return (
        <div className="flex flex-col justify-center w-4/5 h-full p-0 items-center">
            <div className='flex flex-row justify-center items-center w-full h-1/5 text-white text-3xl'>
                <MdTimer />
                <p>{startTime ? elapsedTime.toFixed(2) : 0} / 10s</p>
            </div>

            {!startTime && (
                <button 
                    onClick={startGame} 
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Start Game
                </button>
            )}

            {startTime && !gameOver && currentWord && (
                <div className={`${spaceMono.className} mt-10 h-3/5 flex flex-col items-center`}>
                    <h2 className="text-5xl text-accent mb-10">Unscramble: {currentWord.jumbled}</h2>
                    <form onSubmit={handleSubmit} className="flex flex-col items-center">
                        <input 
                            ref={inputRef}
                            type="text" 
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            className="text-3xl text-center bg-transparent border-b-2 border-white text-white focus:outline-none"
                            placeholder="Type the word"
                        />
                        <button 
                            type="submit" 
                            className="mt-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Submit
                        </button>
                    </form>
                </div>
            )}

            {gameOver && (
                <div className="flex flex-col items-center">
                    <p className='text-white text-4xl mb-4'>Game Over!</p>
                    <p className='text-white text-3xl'>Score: {score}</p>
                </div>
            )}
        </div>
    );
};