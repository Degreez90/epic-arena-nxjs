import mongoose, { Schema, Model, HydratedDocument } from 'mongoose'

interface IverificationToken {
  email: String
  token: String
  expires: Date
}

const verificationTokenSchema = new Schema<IverificationToken>(
  {
    email: {
      type: String,
      required: true,
    },
    token: String,
    expires: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
)

export const VerificationToken = mongoose.model<IverificationToken>(
  'VerificationToken',
  verificationTokenSchema
)
export type VTokenType = HydratedDocument<IverificationToken>
