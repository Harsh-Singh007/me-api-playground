# ME-API Playground

A basic playground that stores a candidate profile in a database and exposes it via a small API + minimal frontend.

## Architecture
- **Frontend**: React (Vite) with Vanilla CSS (Modern design, Glassmorphism).
- **Backend**: Node.js with Express.
- **Database**: SQLite with Prisma ORM.
- **Hosting**: Designed for deployment on platforms like Vercel (Frontend) and Render/Railway/Glitch (Backend).

## Setup & Running Local
### Backend
1. `cd backend`
2. `npm install`
3. `npx prisma migrate dev --name init`
4. `npx prisma db seed`
5. `npm start` (Runs on http://localhost:3000)

### Frontend
1. `cd frontend`
2. `npm install`
3. `npm run dev` (Runs on http://localhost:5173)

## Schema
### Profile
- `id`: Int (PK)
- `name`: String
- `email`: String
- `education`: String
- `github`: String (optional)
- `linkedin`: String (optional)
- `portfolio`: String (optional)
- `skills`: String (Comma separated)
- `updatedAt`: DateTime

### Project
- `id`: Int (PK)
- `title`: String
- `description`: String
- `links`: String (JSON string)
- `skills`: String (Comma separated)
- `profileId`: Int (FK)

### WorkExperience
- `id`: Int (PK)
- `company`: String
- `role`: String
- `description`: String
- `profileId`: Int (FK)

## API Documentation
- `GET /health`: Liveness check.
- `GET /profile`: Returns the full candidate profile with projects and work experience.
- `POST /profile`: Create or update the profile record.
- `GET /projects?skill=...`: Filter projects by skill.
- `GET /skills/top`: Returns top 10 skills.
- `GET /search?q=...`: Search projects and work experience by text.

### Sample CURL
```bash
# Get profile
curl http://localhost:3000/profile

# Search projects for "React"
curl http://localhost:3000/search?q=React
```

## Known Limitations
- SQLite is used for simplicity; for production, a hosted Postgres/MongoDB is recommended.
- Basic Auth for write operations is planned but not currently implemented (as per "Nice-to-have").
- CORS is configured for all origins (`*`) for easy playground testing.

## Resume Link
[View Harsh Singh's Resume](https://drive.google.com/file/d/16WP30dZTXK1kRkLdX-EKQdqCzPkavgDw/view?usp=sharing)
