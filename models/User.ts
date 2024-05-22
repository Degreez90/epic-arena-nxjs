import mongoose, { Schema, Model, Query, HydratedDocument } from 'mongoose'
import validator from 'validator'
import crypto from 'crypto'

interface IUser {
  firstName: string
  lastName: string
  email: string
  password?: string
  passwordConfirm?: string
  phone?: string
  images?: string[]
  role?: 'admin' | 'user'
  accountStatus?: 'active' | 'inactive'
  tournaments?: string[]
  createdAt?: Date
  updatedAt?: Date
  // passwordChangedAt?: Date
  // passwordResetToken?: string
  // passwordResetExpires?: Date
}

interface IUserMethods {
  correctPassword: (
    candidatePassword: string,
    userPassword: string
  ) => Promise<boolean>
  changedPasswordAfter: (JWTTimestamp: number) => boolean
  createPasswordResetToken: () => string
}

type IUserModel = Model<IUser, any, IUserMethods>

const userSchema = new Schema<IUser, IUserModel, IUserMethods>(
  {
    firstName: {
      type: String,
      required: [true, 'Please tell us your name!'],
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      required: [true, 'Please provide your email'],
      trim: true,
      lowercase: true,
      minlength: 3,
      unique: true,
      validate: [validator.isEmail, 'Please provide a valid email'],
    },
    phone: String,
    images: [String],
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
    },
    accountStatus: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'inactive',
    },
    tournaments: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Tournament',
      },
    ],
  },
  { timestamps: true }
)

userSchema.pre<Query<IUserModel, IUserModel>>(/^find/, function (next) {
  // this points to the current query
  this.find({ accountStatus: { $ne: false } })
  next()
})

export const User = mongoose.model<IUser, IUserModel>('User', userSchema)
export type UserType = HydratedDocument<IUser, IUserMethods>
