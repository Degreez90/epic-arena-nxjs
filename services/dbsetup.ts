import {
  Stage,
  Group,
  Round,
  Match,
  MatchGame,
  Participant,
} from 'brackets-model'

interface UserInfo {
  phoneNumber: string
  dateOfBirth: string
}

interface User {
  userName: string
  email: string
  password: string
  isAdmin: boolean // Consider using boolean instead of string if it's a boolean value
  userInfo: UserInfo
}

interface Tournaments {
  _id: number
  name: string
  description: string
  match_game: MatchGame
  game: string
  status: string
  createdBy: string
  participant: Participant
  Stage: Stage
  group: Group
  round: Round
  match: Match
}

const userArray: User[] = [
  {
    userName: 'test4',
    email: 'test4@test.com',
    password: 'Test123!@#',
    isAdmin: false,
    userInfo: {
      phoneNumber: '+13175555555',
      dateOfBirth: '13January2004',
    },
  },
  {
    userName: 'test5',
    email: 'test5@test.com',
    password: 'Test123!@#',
    isAdmin: false,
    userInfo: {
      phoneNumber: '+13175555555',
      dateOfBirth: '13January2004',
    },
  },
  {
    userName: 'test6',
    email: 'test6@test.com',
    password: 'Test123!@#',
    isAdmin: false,
    userInfo: {
      phoneNumber: '+13175555555',
      dateOfBirth: '13January2004',
    },
  },
  {
    userName: 'test7',
    email: 'test7@test.com',
    password: 'Test123!@#',
    isAdmin: false,
    userInfo: {
      phoneNumber: '+13175555555',
      dateOfBirth: '13January2004',
    },
  },
]

// const tournaments : Tournaments = [
//   {
//     _id: 1,
//     name: 'tournamnet',
//     description: 'Mw3',
//     match_game: [],
//     game: 'MW3',
//     status: 'in-progress',
//     createdBy: '1user1',
//     participant: [{
//       id: 1,
//       tournament_id: 1,
//       name:'user1',
//     },
//     {
//       id: 2,
//       tournament_id: 1,
//       name:'user2',
//     },
//     {
//       id: 3,
//       tournament_id: 1,
//       name:'user3',
//     },
//     {
//       id: 4,
//       tournament_id: 1,
//       name:'user4',
//     },
//     {
//       id: 5,
//       tournament_id: 1,
//       name:'user5',
//     },
//     {
//       id: 6,
//       tournament_id: 1,
//       name:'user6',
//     },
//     {
//       id: 7,
//       tournament_id: 1,
//       name:'user7',
//     },
//     {
//       id: 8,
//       tournament_id: 1,
//       name:'user8',
//     },
//   ],
//   stage:[{
//     id: 0,
//     tournamnet_id: 1,
//     name: 'MW3',
//     type: 'double elimination',
//     number: 1,
//     settings: {

//     }
//   }]
//   ,
//   }
// ]
