import mongoose, { Schema, Document } from 'mongoose'

export interface ITwoFactorToken extends Document {
  email: string
  token: string
  expires: Date
}

const TwoFactorTokenSchema: Schema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    token: { type: String, required: true },
    expires: { type: Date, required: true },
  },
  {
    timestamps: true,
  }
)

// Check if the model already exists before defining it
const TwoFactorToken =
  mongoose.models.TwoFactorToken ||
  mongoose.model<ITwoFactorToken>('TwoFactorToken', TwoFactorTokenSchema)

export { TwoFactorToken }
