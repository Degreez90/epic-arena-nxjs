// import mongoose from "mongoose"
// import chalk from "chalk"

// const connectDB = async () => {
//   try {
//     const conn = await mongoose.connect(process.env.MONGODB_URI as string)
//     console.log(chalk.cyan.underline(`MongoDB Connected: ${conn.connection.host}`))
//   } catch (error: any) {
//     console.log(chalk.red.underline(`Error: ${(error as Error).message}`))
//     process.exit(1)
//   }
// }

// connectDB()

// async function setupDatabase(data, model) {

//   data.forEach(async item => {
//     console.log(item)
//     await model.insertMany(item)

//     if (item){
//       console.log(item)
//     }
//   })
// }

// setupDatabase(userArray, User)
