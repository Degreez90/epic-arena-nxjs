import mongoose, { Schema, Document, Model, HydratedDocument } from 'mongoose'

interface IVerificationToken extends Document {
  userId: mongoose.Types.ObjectId
  email: string
  token: string
  expires: Date
}

type IVerificationTokenModel = Model<IVerificationToken>

const VerificationTokenSchema = new Schema<IVerificationToken>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    email: {
      type: String,
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
    expires: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

// Check if the model already exists before defining it
const VerificationToken: IVerificationTokenModel =
  mongoose.models.VerificationToken ||
  mongoose.model<IVerificationToken>(
    'VerificationToken',
    VerificationTokenSchema
  )

export { VerificationToken }
export type VTokenType = HydratedDocument<IVerificationToken>
