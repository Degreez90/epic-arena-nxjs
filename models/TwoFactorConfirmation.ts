import mongoose, { Schema, Document, ObjectId } from 'mongoose'

export interface ITwoFactorConfirmation extends Document {
  userId: ObjectId
  user: ObjectId
}

const TwoFactorConfirmationSchema: Schema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

TwoFactorConfirmationSchema.index({ userId: 1 }, { unique: true })

// Check if the model already exists before defining it
const TwoFactorConfirmation =
  mongoose.models?.TwoFactorConfirmation ||
  mongoose.model<ITwoFactorConfirmation>(
    'TwoFactorConfirmation',
    TwoFactorConfirmationSchema
  )

export { TwoFactorConfirmation }
