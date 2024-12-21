import mongoose, { Schema, Document, Model, Types } from 'mongoose'

interface IPasswordResetToken extends Document {
  userId: Types.ObjectId
  email: string
  token: string
  expires: Date
}

type IPasswordResetTokenModel = Model<IPasswordResetToken>

const PasswordResetTokenSchema = new Schema<IPasswordResetToken>(
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
const PasswordResetToken =
  mongoose.models.PasswordResetToken ||
  mongoose.model<IPasswordResetToken>(
    'PasswordResetToken',
    PasswordResetTokenSchema
  )

export { PasswordResetToken }
