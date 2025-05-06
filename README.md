# Next.js Role-Based Access Control (RBAC) Application

A full-featured Next.js application with authentication, role-based access control, article management, and admin dashboard.

## 🚀 Features

- **Authentication System**
  - Sign up as new user (USER role)
  - Login/logout via NextAuth.js
  - Secure password handling with bcrypt
  - Protected routes with middleware

- **Role-Based Access Control (RBAC)**
  - Two roles: USER and ADMIN
  - Role-specific UI elements and navigation
  - Middleware protection for restricted routes

- **Article Management**
  - Create, update, and view articles
  - Rich text editor for content
  - Publish/unpublish functionality
  - Public articles view for visitors

- **User Management (Admin)**
  - View all user accounts
  - Change user roles between USER and ADMIN
  - Delete user accounts with confirmation

- **Profile Management**
  - View and update personal information
  - Role display and account information

## 💻 Tech Stack

- **Frontend**
  - Next.js 15 with App Router
  - React 19
  - TypeScript
  - Tailwind CSS
  - Shadcn UI Components
  - Lucide Icons

- **Backend**
  - Next.js API Routes
  - NextAuth.js (Auth.js)
  - Prisma ORM

- **Database**
  - SQLite (local development)
  - Compatible with PostgreSQL for production

## 🛠️ Setup & Installation

### Prerequisites

- Node.js (v18 or higher)
- Yarn package manager

### Installation

1. Clone the repository
   ```bash
   git clone <repository-url>
   cd iboss
   ```

2. Install dependencies
   ```bash
   yarn install
   ```

3. Set up environment variables
   ```bash
   # Create a .env file in the root directory with the following content
   DATABASE_URL="file:./dev.db"
   NEXTAUTH_SECRET="your-secret-key-here"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. Set up the database
   ```bash
   # Run the database migrations
   yarn db:push
   
   # Seed the database with initial data (admin and user accounts)
   yarn db:seed
   ```

5. Run the development server
   ```bash
   yarn dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

### Default Accounts

After running the seed script, you'll have access to two accounts:

- **Admin Account**
  - Email: admin@example.com
  - Password: password123

- **User Account**
  - Email: user@example.com
  - Password: password123

## 📁 Project Structure

```
iboss/
├── prisma/                 # Database schema and migrations
├── public/                 # Static assets
├── src/
│   ├── app/                # Next.js App Router
│   │   ├── api/            # API routes
│   │   ├── admin/          # Admin pages
│   │   ├── articles/       # Article pages
│   │   ├── login/          # Authentication pages
│   │   ├── profile/        # User profile
│   │   └── public/         # Public pages
│   ├── components/         # React components
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions
│   ├── types/              # TypeScript types
│   └── middleware.ts       # NextAuth middleware for route protection
└── package.json            # Project dependencies and scripts
```

## 📜 Available Scripts

- `yarn dev` - Run the development server with Turbopack
- `yarn build` - Build the application for production
- `yarn start` - Start the production server
- `yarn lint` - Run ESLint on the codebase
- `yarn db:push` - Push the Prisma schema to the database
- `yarn db:seed` - Seed the database with initial data
- `yarn prisma:studio` - Open Prisma Studio to view/edit database

## 🧪 Development

### Working with Prisma

To modify the database schema, edit `prisma/schema.prisma` and then run:

```bash
yarn db:push
```

To explore the database with a GUI:

```bash
yarn prisma:studio
```

### Authorization Flow

The application uses a custom middleware to protect routes based on authentication and user roles:

- Public routes: Home, Login, Signup, Public Articles
- Authenticated routes: Profile, My Articles
- Admin-only routes: Admin Dashboard, All Articles, User Management
