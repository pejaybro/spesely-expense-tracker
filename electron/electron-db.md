npm install better-sqlite3
npm install -D @types/better-sqlite3 @electron/rebuild

then  rebuild electron
npx electron-rebuild

---------------------------------------------

Because better-sqlite3 contains native code, it needs to be compiled for Electron, not normal Node.js.
From your project root run:
npx electron-rebuild -f -w better-sqlite3

Why are we doing this?
normally
Node.js
   ↓
better-sqlite3 native binary
---------------------------------------------
But Electron has its own Node/Electron ABI:
Electron
   ↓
better-sqlite3 native binary compiled for Electron

electron-rebuild handles that difference.


---------------------------------------------

create database.cjs file 
and update main.cjs

---------------------------------------------

# STEP : Migrations

these are sql db schemas 
create migration folder in db and strat creating xxx(number indentification)_migration_schema_file_name.sql

and write sql queryies 

once we create inital file and run dev electron 
electron will auto setup the schema in our 
"sps.sqlite" or the name you have given here

```tsx
const dbPath = path.join(app.getPath("userData"), "sps.sqlite");
```

if we want to remove a table or add something new 
we sinply create a new migration 
as old migrations are already executed so rewriting them wont change the existing db

we want a clean setup 

1. Finish deciding your initial schema
2. Keep ONE 001_initial_schema.sql
3. Delete your development sps.sqlite
4. Start fresh
5. Once the schema is stable/released, never edit 001
6. Future changes → 002, 003, 004...

for production version we dont delete old db migrations and sqlite file we just keep adding new migrations 

# The dangerous part
lets say we have 

schema_migrations

001_initial_schema.sql   ✅
002_add_phone.sql        ✅
003_add_address.sql      ✅

Now you "clean up" your migrations and delete:

002_add_phone.sql
003_add_address.sql

Your SQLite file is still intact with:
phone column
address column

but migration will only see 001_initial_schema
so,
Your database might have changes that are no longer represented by your migration files.
Your migration history and actual schema are now out of sync

This is why you should do one of two things

# Option A — Clean migrations + delete DB
# Option B — Keep the SQLite file



https://www.w3resource.com/sqlite