# Tournament CRUD Implementation Guide

This document outlines the complete CRUD (Create, Read, Update, Delete) implementation for tournaments using Prisma and brackets-manager.

## Overview

The implementation consists of three main layers:

1. **Database Layer (MyDB.ts)** - Prisma-based storage adapter for brackets-manager
2. **Service Layer (tournaments.ts)** - Business logic for tournament operations
3. **Action Layer (create-tournament.ts, report-score.ts, update-tournament.ts)** - Server actions
4. **Helpers (bracketHelpers.ts)** - Utility functions for bracket operations

## Core Files

### 1. Database Layer - [lib/MyDB.ts](lib/MyDB.ts)

Implements the `CrudInterface` for brackets-manager using Prisma PostgreSQL.

**Key Methods:**

- `insert()` - Add participants, stages, groups, rounds, matches, and match games
- `select()` - Query bracket data by ID or filter
- `update()` - Update bracket entities
- `delete()` - Remove bracket data

**Usage:**

```typescript
const db = await MyDB.build(tournamentId)
const manager = new BracketsManager(db)
```

### 2. Service Layer - [data/Tournaments/tournaments.ts](data/Tournaments/tournaments.ts)

Comprehensive tournament management functions.

**Available Functions:**

#### Tournament Management

- `getAllTournaments()` - Get all tournaments
- `getTournamentById(id)` - Get a specific tournament
- `getTournamentsByCreator(createdBy)` - Get tournaments by creator
- `getTournamentsByStatus(status)` - Filter tournaments by status
- `createTournament(data)` - Create a new tournament
- `updateTournament(id, data)` - Update tournament details
- `deleteTournament(id)` - Delete a tournament

#### Manager Operations

- `getTournamentManager(tournamentId)` - Get BracketsManager instance

#### Participant Management

- `getTournamentParticipants(tournamentId)` - Get all participants
- `addTournamentParticipants(tournamentId, participants)` - Add participants

#### Stage and Match Management

- `getTournamentStages(tournamentId)` - Get all stages
- `getTournamentMatches(tournamentId)` - Get all matches
- `getTournamentMatch(tournamentId, matchId)` - Get specific match
- `updateTournamentMatch(tournamentId, matchId, matchData)` - Update match

#### Analytics

- `getTournamentProgress(tournamentId)` - Get progress statistics
- `getStageBracket(tournamentId, stageId)` - Get bracket data

### 3. Server Actions

#### Create Tournament - [actions/tournament/create-tournament.ts](actions/tournament/create-tournament.ts)

Creates a new tournament with initial bracket structure.

**Usage:**

```typescript
import createTournament from '@/actions/tournament/create-tournament'

const response = await createTournament({
  tournamentName: 'My Tournament',
  description: 'Tournament description',
  type: 'single_elimination', // or 'double_elimination', 'round_robin'
  seedOrdering: 'natural',
})
```

**Response:**

```typescript
{
  success?: string
  error?: string
  tournamentId?: string
}
```

#### Report Score - [actions/tournament/report-score.ts](actions/tournament/report-score.ts)

Update match scores and results.

**Usage:**

```typescript
import reportScore from '@/actions/tournament/report-score'

const response = await reportScore({
  tournamentId: 'tournament-id',
  matchId: 1,
  opponent1Score: 10,
  opponent2Score: 8,
  status: 'completed',
})
```

#### Update Tournament - [actions/tournament/update-tournament.ts](actions/tournament/update-tournament.ts)

Update tournament details and metadata.

**Usage:**

```typescript
import updateTournament from '@/actions/tournament/update-tournament'

const response = await updateTournament({
  tournamentId: 'tournament-id',
  status: 'completed',
  progress: 100,
  name: 'Updated Name',
})
```

### 4. Bracket Helpers - [lib/bracketHelpers.ts](lib/bracketHelpers.ts)

Advanced bracket and match analysis functions.

**Key Functions:**

#### Bracket Structure

- `getBracketStructure(tournamentId)` - Get complete bracket data
- `getStageWithBracket(tournamentId, stageId)` - Get stage with all matches
- `getGroupsInStage(tournamentId, stageId)` - Get groups in a stage
- `getRoundsInGroup(tournamentId, groupId)` - Get rounds in a group
- `getMatchesInRound(tournamentId, roundId)` - Get matches in a round
- `getMatchesInGroup(tournamentId, groupId)` - Get matches in a group
- `getMatchGames(tournamentId, matchId)` - Get individual match games

#### Match Details

- `getMatchDetails(tournamentId, matchId)` - Get complete match information
- `getParticipantNextMatches(tournamentId, participantId)` - Get upcoming matches
- `getParticipantMatchHistory(tournamentId, participantId)` - Get past matches

#### Analytics

- `getTournamentStandings(tournamentId)` - Get tournament standings/rankings
- `getTournamentStats(tournamentId)` - Get tournament statistics

**Example - Get Tournament Standings:**

```typescript
import { getTournamentStandings } from '@/lib/bracketHelpers'

const standings = await getTournamentStandings('tournament-id')
// Returns: [
//   {
//     id: 1,
//     name: 'Player 1',
//     played: 8,
//     wins: 7,
//     losses: 1,
//     draws: 0,
//     pointsFor: 45,
//     pointsAgainst: 28,
//     pointDifference: 17
//   },
//   ...
// ]
```

## Tournament Workflow

### 1. Create Tournament

```typescript
const response = await createTournament({
  tournamentName: 'Spring Championship',
  description: 'Annual spring tournament',
  type: 'single_elimination',
  seedOrdering: 'natural',
})

const tournamentId = response.tournamentId
```

### 2. Add/Manage Participants

```typescript
import { addTournamentParticipants } from '@/data/Tournaments/tournaments'

await addTournamentParticipants(tournamentId, [
  { name: 'Player 1' },
  { name: 'Player 2' },
  // ...
])
```

### 3. Get Match Information

```typescript
import { getTournamentMatches } from '@/data/Tournaments/tournaments'

const matches = await getTournamentMatches(tournamentId)
```

### 4. Report Scores

```typescript
const result = await reportScore({
  tournamentId,
  matchId: 1,
  opponent1Score: 10,
  opponent2Score: 8,
  status: 'completed',
})
```

### 5. View Tournament Progress

```typescript
import { getTournamentProgress } from '@/data/Tournaments/tournaments'

const progress = await getTournamentProgress(tournamentId)
// Returns: {
//   totalParticipants: 8,
//   totalMatches: 7,
//   completedMatches: 3,
//   pendingMatches: 4,
//   stages: 1,
//   progress: 43
// }
```

### 6. Get Final Standings

```typescript
import { getTournamentStandings } from '@/lib/bracketHelpers'

const standings = await getTournamentStandings(tournamentId)
```

## Database Schema

The tournament data is stored in the `Tournament` model:

```prisma
model Tournament {
  id                    String   @id @default(cuid())
  name                  String
  description           String?  @db.Text
  status                String   @default("pending")
  createdBy             String
  user                  User     @relation(fields: [createdBy], references: [id])
  progress              Int      @default(0)
  participant           Json?    // Bracket participant data
  stage                 Json?    // Stage data
  group                 Json?    // Group data
  round                 Json?    // Round data
  match                 Json?    // Match data
  match_game            Json?    // Match game data
  game                  Json?    // Game selection data
  participantGameMatrix Json?    // Participant game matrix
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt
}
```

## Authorization

All actions check user permissions:

- Users can only manage tournaments they created or are admins
- Admin role can manage all tournaments

## Error Handling

All functions return structured responses:

```typescript
{
  success?: string  // Success message
  error?: string    // Error message if failed
}
```

## Best Practices

1. **Use Service Layer** - Always use functions from `tournaments.ts` for database operations
2. **Validate User** - Check user authorization before operations
3. **Error Handling** - Catch and log errors appropriately
4. **Type Safety** - Use TypeScript types from brackets-model
5. **Performance** - Cache bracket structure when possible

## Advanced Features

### Seeding Options

- `natural` - Seed by rank/ID
- `reverse` - Reverse order
- `half_shift` - Half-shift seeding
- `reverse_half_shift` - Reverse half-shift
- `no_seeding` - Random seeding

### Tournament Types

- `single_elimination` - Single elimination bracket
- `double_elimination` - Double elimination bracket
- `round_robin` - Round robin format

## Testing

Example test flow:

```typescript
// 1. Create tournament
const tourney = await createTournament({...})

// 2. Verify creation
const retrieved = await getTournamentById(tourney.id)
assert(retrieved.name === 'Test Tournament')

// 3. Report scores
await reportScore({
  tournamentId: tourney.id,
  matchId: 1,
  opponent1Score: 5,
  opponent2Score: 3
})

// 4. Check progress
const progress = await getTournamentProgress(tourney.id)
assert(progress.completedMatches > 0)
```

## API Integration

The tournament system integrates with:

- **brackets-manager** - Tournament bracket management
- **brackets-model** - Data models for brackets
- **Prisma** - Database ORM
- **NextAuth** - User authentication

## Dependencies

```json
{
  "brackets-manager": "^1.6.4",
  "brackets-model": "^1.5.0",
  "brackets-prisma-db": "^2.1.0",
  "@prisma/client": "^5.15.0"
}
```
