import mongoose, { Schema } from 'mongoose';

const ScrambleGameSchema: Schema = new Schema({
  name: { type: String, required: true },
  wager: { type: Number, required: true },
  player1Score: { type: Number, default: -1 },
  player2Score: { type: Number, default: -1 },
  player1Account: { type: String, required: true},
  player2Account: { type: String, default: "" },
  player1Joined: { type: Boolean, default: false },
  player2Joined: { type: Boolean, default: false },
  winner: { type: String, default: ""},
}, {
  timestamps: true,
});

const ScrambleGame = mongoose.models.ScrambleGame || mongoose.model('ScrambleGame', ScrambleGameSchema);

export default ScrambleGame;
