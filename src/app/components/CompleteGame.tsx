import { FullScrambleGame } from "../utils/types"

interface CompleteGameProps {
    game: FullScrambleGame;
  }
  
export const CompleteGame: React.FC<CompleteGameProps> = ({game}) => {
    const winnerScore = (game.winner==="1") ? game.player1Score : ((game.winner==="2") ? game.player2Score : "0");
    return (
        <div className="w-full h-full flex justify-center items-center flex-col">
            <h1 className="text-5xl text-accent py-10">This game has been completed!</h1>
            {winnerScore=="0" ? 
                <p className="text-white py-10">The game has resulted in a draw😥, with a score of {game.player1Score}</p>: 
                <p className="text-white py-10">Player {game.winner} has won the game with a Score of {winnerScore}</p>
            }
        </div>
    )
}