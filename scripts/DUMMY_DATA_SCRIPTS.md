# Dummy Data Scripts

These scripts allow you to quickly populate your database with test data for development and testing purposes.

## Available Scripts

### 1. Seed All Dummy Data (Recommended)

**Comprehensive script that seeds everything at once: users, games, tournaments, and participant relationships.**

```bash
npx ts-node scripts/seed-all-dummy-data.ts
```

**Creates:**

- **30 dummy users** (2 admins + 28 regular users)
- 4 dummy games (SF6, Tekken 8, LoL, Dota 2)
- 8 dummy tournaments with various types, statuses, and game associations
- Tournament participants (40+ diverse user-tournament relationships)

**Output Example:**

```
🌱 Starting comprehensive dummy data seeding...

👤 Step 1: Creating dummy users...
  ✓ Created user: testadmin
  ✓ Created user: testuser1
  ✓ Created user: testuser2

🎮 Step 2: Creating dummy games...
  ✓ Created game: Street Fighter 6
  ✓ Created game: Tekken 8
  ✓ Created game: League of Legends
  ✓ Created game: Dota 2

🏆 Step 3: Creating dummy tournaments...
  ✓ Created tournament: Street Fighter Championship 2024 (pending)
  ✓ Created tournament: Tekken Pro League (progress)
  ✓ Created tournament: Summer Fighting Festival (completed)
  ... (5 more tournaments)

👥 Step 4: Adding tournament participants...
  ✓ Added testuser1 to Street Fighter Championship 2024
  ✓ Added testuser2 to Street Fighter Championship 2024
  ... (more participants)

📊 Created/Verified:
  • 30 users
  • 4 games
  • 8 tournaments

💡 Test Credentials:
  Admin: testadmin@example.com / TestPassword123!
  Admin 2: adminuser@example.com / TestPassword123!
  User 1: testuser1@example.com / TestPassword123!
  User 2: testuser2@example.com / TestPassword123!
  (+ 26 more test users available)
```

### 2. Clean All Dummy Data (Recommended)

**Comprehensive cleanup script that removes everything: tournament participants, tournaments, games, and users.**

```bash
npx ts-node scripts/clean-all-dummy-data.ts
```

**Output Example:**

```
🧹 Starting comprehensive cleanup of all dummy data...

🔍 Finding dummy users...
  Found 3 dummy users

👥 Step 1: Removing tournament participants...
  ✓ Deleted 12 participant records

🏆 Step 2: Removing tournaments...
  ✓ Deleted 8 tournaments

🎮 Step 3: Removing games...
  ✓ Deleted 4 games

👤 Step 4: Removing users...
  ✓ Deleted 3 users

✅ Comprehensive cleanup completed successfully!

📊 Deleted:
  • 30 users
  • 4 games
  • 8 tournaments
  • 40+ participant records
```

---

## Individual Category Scripts (Advanced)

For more granular control, individual scripts are also available:

### 3. Seed Individual Data

Adds dummy data in separate categories (users, games, tournaments only - without participants).

```bash
npx ts-node scripts/seed-dummy-data.ts
```

**Creates:**

- 3 dummy users
- 4 dummy games
- 3 dummy tournaments (basic)

### 4. Clean Individual Data

Removes dummy data by category (tournaments, then games, then users - without handling participants).

```bash
npx ts-node scripts/clean-dummy-data.ts
```

---

## Typical Workflows

### Quick Start (Recommended)

```bash
# Seed everything at once
npx ts-node scripts/seed-all-dummy-data.ts

# Test the application...

# Clean everything
npx ts-node scripts/clean-all-dummy-data.ts
```

### Fresh Test Environment

```bash
# Remove old test data
npx ts-node scripts/clean-all-dummy-data.ts

# Add fresh test data with all relationships
npx ts-node scripts/seed-all-dummy-data.ts
```

### Advanced: Category by Category

```bash
# Clean each category individually (if needed)
npx ts-node scripts/clean-dummy-data.ts

# Seed each category individually (if needed)
npx ts-node scripts/seed-dummy-data.ts
```

---

## Test Data Details

### Users

| Username  | Email                 | Password         | Role  |
| --------- | --------------------- | ---------------- | ----- |
| testadmin | testadmin@example.com | TestPassword123! | admin |
| testuser1 | testuser1@example.com | TestPassword123! | user  |
| testuser2 | testuser2@example.com | TestPassword123! | user  |

### Games

| Name              | Genre    | Description                                 |
| ----------------- | -------- | ------------------------------------------- |
| Street Fighter 6  | Fighting | Classic fighting game with modern mechanics |
| Tekken 8          | Fighting | 3D fighting game with deep combat system    |
| League of Legends | MOBA     | Popular MOBA esports title                  |
| Dota 2            | MOBA     | Complex strategy-based MOBA game            |

### Tournament Types & Statuses

- **Types**: Single Elimination, Double Elimination, Round Robin
- **Statuses**: Pending, Progress, Completed
- **Seeding Orders**: Natural, Reverse, Half Shift, Reverse Half Shift
- **Third Place Match**: Configurable per tournament

---

## Important Notes

- ✅ **Idempotent**: Safe to run multiple times (won't create duplicates)
- ✅ **Comprehensive**: All scripts handle relationships between entities
- ✅ **Ordered Cleanup**: Removes dependencies in correct order
- ⚠️ **Test Data Only**: Credentials are hardcoded - **DO NOT USE IN PRODUCTION**
- ✅ **Easily Identifiable**: All dummy data uses recognizable email patterns
- ✅ **Full Coverage**: Includes users, games, tournaments, and participant relationships
