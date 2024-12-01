import dbConnect from "./dbConnect";
import logger from "./logger";
import { makeTransaction } from "./makeTransaction";
import { FullScrambleGame, IScrambleGame, JScrambleGame } from "./types";
import ScrambleGame from "@/models/Scramble";

  export async function createScrambleGameBackend(
    ScrambleGameData: IScrambleGame,
  ): Promise<string | null> {
    try {
      await dbConnect();
      logger.info(`Creating a new Scramble game in the database:`);
      console.log(ScrambleGameData);
  
      const newGame = new ScrambleGame({
        name: ScrambleGameData.name,
        wager: ScrambleGameData.wager,
        player1Account: ScrambleGameData.player1Account,
      });
  
      const savedGame = await newGame.save();
  
      logger.info(`QScramble game created successfully with ID: ${savedGame._id}`);
  
      return savedGame._id;
    } catch (error) {
      logger.error(`Error creating roulette game in MongoDB: ${error}`);
      return null;
    }
}

export async function getScrambleGameById(gameID: string): Promise<FullScrambleGame | null> {
	try {
	  await dbConnect();
	  logger.info(`Fetching Scramble game with ID: ${gameID}`);
	  
	  const game = await ScrambleGame.findById(gameID).exec();
	  
	  if (!game) {
		logger.error(`Game with ID ${gameID} not found`);
		return null;
	  }
  
	  const fullGame: FullScrambleGame = {
		id: game._id.toString(),
		name: game.name,
		wager: game.wager,
		player1Account: game.player1Account,
		player2Account: game.player2Account,
		player1Score: game.player1Score,
		player2Score: game.player2Score,
		player1Joined: game.player1Joined,
		player2Joined: game.player2Joined,
		winner: game.winner,
	  };
  
	  logger.info(`Game found: ${JSON.stringify(fullGame)}`);
	  return fullGame;
	} catch (error) {
	  logger.error(`Error fetching Scramble game: ${error}`);
	  return null;
	}
}

export async function completeScrambleGameBackend(
	ScrambleGameData: JScrambleGame
  ): Promise<boolean> {
	try {
	  await dbConnect();
	  logger.info(`Completing the game: ${ScrambleGameData.id}`);
  
	  const result = await ScrambleGame.findByIdAndUpdate(
		ScrambleGameData.id,
		{ player2Account: ScrambleGameData.player2Account },
		{ new: true } // returns the updated document
	  );
  
	  if (!result) {
		throw new Error("Game not found or update failed");
	  }
  
	  logger.info(`Game updated successfully with player2Account: ${ScrambleGameData.player2Account}`);
	  return true;
	} catch (error) {
	  logger.error(`Error completing the game in MongoDB: ${error}`);
	  return false;
	}
  }

  export async function updatePlayerScore(gameID: string, playerNumber: number, score: number) {
	const gameData = await ScrambleGame.findById(gameID);
  
	if (!gameData) {
	  throw new Error('Game not found');
	}
  
	if (playerNumber === 1) {
	  if (gameData.player1Joined && gameData.player1Score !== 0) {
		throw new Error('Player 1 has already set Score');
	  }
	  gameData.player1Score = score;
	  gameData.player1Joined = true;
	} else if (playerNumber === 2) {
	  if (gameData.player2Joined && gameData.player2Score !== 0) {
		throw new Error('Player 2 has already set Score');
	  }
	  gameData.player2Score = score;
	  gameData.player2Joined = true;
	} else {
	  throw new Error('Invalid player number');
	}

	if(playerNumber===2) {
		if(gameData.player1Score>gameData.player2Score) {
			gameData.winner="1";
			makeTransaction(gameData.wager*1.8, gameData.player1Account);
		} else {
			gameData.winner="2";
			makeTransaction(gameData.wager*1.8, gameData.player2Account);
		}
	}
  
	await gameData.save();
	return gameData;
  }