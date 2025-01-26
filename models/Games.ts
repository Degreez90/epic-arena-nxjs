import mongoose, { Schema, Model, Types, HydratedDocument } from 'mongoose'

export interface IGame {
  Name: string
  description?: string
  genre?: string
  images?: string[]
  rules?: Record<string, any>[]
  createdBy: Types.ObjectId
  createdAt?: Date
}

const gameSchema = new Schema<IGame, Model<IGame>>(
  {
    Name: {
      type: String,
      required: [true, 'Please provide a name for the game'],
    },
    description: {
      type: String,
    },
    genre: {
      type: String,
    },
    images: {
      type: [String],
    },
    rules: {
      type: [Schema.Types.Mixed],
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      required: [true, 'Please provide the creator of the game'],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  { timestamps: true }
)

export type GameType = HydratedDocument<IGame>

export const Game = mongoose.model<IGame>('Game', gameSchema)
