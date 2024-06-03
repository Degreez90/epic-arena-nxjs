import mongoose, {
  Schema,
  Document,
  Types,
  Model,
  Query,
  HydratedDocument,
} from 'mongoose'

interface IPasswordResetToken extends Document {
  userId: Types.ObjectId
  email: String
  token: String
  expires: Date
}

type IPasswordResetTokenModel = Model<IPasswordResetToken>

const passwordResetokenSchema = new Schema<IPasswordResetToken>({
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
})

export const PasswordResetToken = mongoose.model<
  IPasswordResetToken,
  IPasswordResetTokenModel
>('PasswordResetToken', passwordResetokenSchema)
