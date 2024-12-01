export interface IScrambleGame {
    name: string;
    wager: number;
    player1Account: string;
}

export interface FullScrambleGame {
    id: string;
    name: string;
    wager: number;
    player1Account: string;
    player2Account: string;
    player1Score: number;
    player2Score: number;
    player1Joined: boolean;
    player2Joined: boolean;
    winner: string;
}

export interface JScrambleGame {
    id: string;
    player2Account: string;
}