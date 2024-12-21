import mongoose, {
  Schema,
  Model,
  Query,
  HydratedDocument,
  ObjectId,
} from 'mongoose'
import validator from 'validator'

export interface IUser {
  _id: ObjectId
  firstName: string
  lastName: string
  userName?: string
  email: string
  emailVerified?: boolean
  password?: string
  passwordConfirm?: string
  admin?: boolean
  phoneNumber?: string
  isTwoFactorEnabled: boolean
  image?: string[]
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
      required: [true, 'Please tell us your name!'],
    },
    userName: {
      type: String,
      unique: true,
      trim: true,
      minlength: 3,
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
    password: {
      type: String,
      minlength: 6,
      select: false,
    },
    admin: {
      type: Boolean,
      default: false,
    },
    phoneNumber: String,
    isTwoFactorEnabled: {
      type: Boolean,
      default: false,
    },
    image: [String],
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
  this.find({ accountStatus: { $ne: 'inactive' } })
  next()
})

// Define a type for document creation
export type CreateUserInput = Omit<IUser, '_id' | 'createdAt' | 'updatedAt'>

// Type the model export properly
export const User = (mongoose.models?.User ||
  mongoose.model<IUser, IUserModel>('User', userSchema)) as Model<
  IUser,
  {},
  IUserMethods
>

export type UserType = HydratedDocument<IUser, IUserMethods>
