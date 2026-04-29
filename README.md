# Task Board

Live Demo: https://task-board-beta-six.vercel.app/

A simple Task Board application built using Next.js. Users can securely sign up, log in, create personal tasks, and update task status.

---

## Tech Stack Used

### Frontend
- Next.js (App Router)
- TypeScript
- Tailwind CSS

### Backend
- Next.js Route Handlers
- JWT Authentication
- bcryptjs (Password Hashing)

### Database
- PostgreSQL (NeonDB)

### ORM
- Prisma ORM

### Deployment
- Vercel

---

## Short Explanation of Authentication Flow

The application uses **JWT-based authentication** with **HttpOnly cookies** for secure session management.

### Signup Flow
1. User enters name, email, and password.
2. Password is hashed using bcryptjs before storing.
3. User data is saved in PostgreSQL database.

### Login Flow
1. User enters email and password.
2. Credentials are verified.
3. If valid, a JWT token is generated.
4. Token is stored in an HttpOnly cookie.

### Protected Access
Only authenticated users with a valid token cookie can:

- Create tasks
- View their own tasks
- Update task status
- Access dashboard

### Logout Flow
- Token cookie is cleared.
- User session ends.

---

## Database Schema Explanation

The project contains two main models:

### User Model

| Field      | Type     | Description |
|-----------|----------|-------------|
| id        | String   | Primary Key |
| name      | String   | User Name |
| email     | String   | Unique Email |
| password  | String   | Hashed Password |
| createdAt | DateTime | Created Timestamp |

### Task Model

| Field      | Type     | Description |
|-----------|----------|-------------|
| id        | String   | Primary Key |
| title     | String   | Task Title |
| status    | Enum     | TODO / IN_PROGRESS / DONE |
| createdAt | DateTime | Created Timestamp |
| userId    | String   | Foreign Key |

### Relationship Diagram

```text
User (1) ---------> (Many) Task
```

---

## Steps to Run Locally

# Clone the Repository
```
git clone
cd task-board
npm install
```
# Setup .env

```
DATABASE_URL="NeonDB_connection_url"
JWT_SECRET="secret_key"
```

# Setup Prisma
```
npx prisma generate
npx prisma db push
```

# Run the app
```
npm run dev
```

---

# Demo Credentials
 Email : ankush@test.com
 Password: 123456

 ---