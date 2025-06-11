
# StructureFlow - Next.js Project

StructureFlow is a Next.js application designed to help teams manage daily scrums, projects, and foster better communication. It features user authentication, daily standup feeds, and a clean, modern UI built with ShadCN components and Tailwind CSS.

## Features

*   User Authentication (Login, Registration - basic setup)
*   Daily Scrum Submission
*   Daily Standup Feed with Comments
*   Protected Routes
*   Modern UI with Next.js, React, ShadCN, Tailwind CSS
*   Prisma ORM with PostgreSQL for database interaction
*   Genkit for potential AI features (setup included)

## Prerequisites

Before you begin, ensure you have the following installed:

*   [Node.js](https://nodejs.org/) (v18 or later recommended)
*   [npm](https://www.npmjs.com/), [yarn](https://yarnpkg.com/), or [pnpm](https://pnpm.io/) (this guide will use npm commands)
*   [Docker](https://www.docker.com/get-started) and [Docker Compose](https://docs.docker.com/compose/install/) (Recommended for database setup)
*   Alternatively, a direct [PostgreSQL](https://www.postgresql.org/download/) installation if not using Docker.

## Getting Started Locally

Follow these steps to get the application running on your local machine:

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd <repository-name>
```

### 2. Install Dependencies

Install the project dependencies using your preferred package manager:

```bash
npm install
# or
# yarn install
# or
# pnpm install
```

### 3. Set Up a Local PostgreSQL Database (Using Docker Compose - Recommended)

This application uses PostgreSQL as its database. The easiest way to get this running locally is with Docker Compose.

*   **Ensure Docker and Docker Compose are installed and running.**
*   **Start the PostgreSQL container:**
    From the root of the project directory (where `docker-compose.yml` is located), run:
    ```bash
    docker-compose up -d
    ```
    This command will:
    *   Download the PostgreSQL image (if not already present).
    *   Create and start a container named `structureflow-postgres`.
    *   Set the PostgreSQL user to `devuser`, password to `devpassword`, and create a database `structureflow_db` (as defined in `docker-compose.yml`).
    *   Map port `5432` on your host to port `5432` in the container.
    *   Persist data in a Docker volume named `pgdata`.
    *   Run the container in detached mode (`-d`).

    Your connection string in `.env.local` will use these credentials.

*   **To stop the database container:**
    ```bash
    docker-compose down
    ```
*   **To view logs (if needed):**
    ```bash
    docker-compose logs -f postgres
    ```

**Alternative: Direct PostgreSQL Installation**

If you prefer not to use Docker, you can install PostgreSQL directly:
*   Download and install PostgreSQL from the [official website](https://www.postgresql.org/download/) for your operating system.
*   During installation, you'll typically set a password for the default `postgres` user or create a new user/role.
*   You'll also need to create a database for the application (e.g., `structureflow_db`).
*   Ensure PostgreSQL is running and you have the username, password, host, and port for connecting. You will need to adjust your `.env.local` accordingly.

**After setting up PostgreSQL (either via Docker or directly), ensure it's running.**

### 4. Set Up Environment Variables

The application requires certain environment variables to function correctly, especially for database connection and JWT authentication.

*   Create a new file named `.env.local` in the root of your project.
*   Copy the contents from `.env.local.example` (if it exists, otherwise create it based on the example below) into `.env.local`.

Your `.env.local` file should look something like this:

```env
# .env.local

# PostgreSQL Database Connection URL
# If using the provided docker-compose.yml, this should work out of the box.
# Format: postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public
DATABASE_URL="postgresql://devuser:devpassword@localhost:5432/structureflow_db?schema=public"

# JWT Secret for signing authentication tokens
# Generate a strong, random string for this.
JWT_SECRET="replace_with_a_strong_random_secret_key"

# Optional: Google AI API Key for Genkit (if using AI features)
# GOOGLE_API_KEY="your_google_ai_api_key"
```

**Important:**
*   **`DATABASE_URL`**:
    *   If you used the `docker-compose up -d` command, the default `DATABASE_URL` above (`postgresql://devuser:devpassword@localhost:5432/structureflow_db?schema=public`) should work.
    *   If you installed PostgreSQL directly or used different credentials, replace `devuser`, `devpassword`, `localhost:5432`, and `structureflow_db` with your actual PostgreSQL credentials and database name.
*   **`JWT_SECRET`**: This is crucial for security. **DO NOT USE WEAK OR PREDICTABLE SECRETS.**
    *   **How to generate a strong JWT_SECRET:**
        *   Use a password manager to generate a long, random string (e.g., 64+ characters).
        *   Use an online cryptographically secure random string generator.
        *   On Linux/macOS, you can use a command like: `openssl rand -hex 32` (which gives a 64-character hex string).
    *   A good secret should be long and contain a mix of uppercase letters, lowercase letters, numbers, and symbols if your system supports it, though a long hex string is also very strong.
    *   **Example of a generated secret (DO NOT USE THIS):** `a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0`

### 5. Set Up the Database Schema with Prisma

Prisma is used to manage the database schema and interactions.

*   **Ensure your PostgreSQL database is running (e.g., via `docker-compose up -d`), and your `.env.local` file has the correct `DATABASE_URL`.**
*   **Apply the schema to your database:**
    This command will create the tables defined in `prisma/schema.prisma` in your database.
    ```bash
    npx prisma db push
    ```
    Alternatively, for a more robust workflow involving migration files (recommended for ongoing development and production):
    ```bash
    npx prisma migrate dev --name initial_setup
    ```
*   **Generate Prisma Client:**
    This command generates the Prisma Client based on your schema, allowing you to interact with the database in your code.
    ```bash
    npx prisma generate
    ```
    This step is usually run automatically after `db push` or `migrate dev`, but it's good to know.

### 6. Run the Development Server

The application consists of a Next.js frontend/backend and potentially a Genkit server for AI functionalities.

*   **Start the Next.js development server:**
    ```bash
    npm run dev
    ```
    This will typically start the application on `http://localhost:9002` (as configured in `package.json`).

*   **Start the Genkit development server (if you plan to use or develop AI features):**
    Open a new terminal window and run:
    ```bash
    npm run genkit:dev
    ```
    This will start the Genkit development flow server, usually on `http://localhost:3400`.

### 7. Access the Application

Open your web browser and navigate to `http://localhost:9002` (or the port specified in your terminal).

You should now be able to:
*   Register a new user (basic functionality, UI needs completion).
*   Log in with existing credentials (after registration or seeding).
*   Access the dashboard and other features.

## Available Scripts

In the `package.json` file, you can find various scripts:

*   `npm run dev`: Starts the Next.js development server (with Turbopack).
*   `npm run genkit:dev`: Starts the Genkit development server.
*   `npm run genkit:watch`: Starts the Genkit development server with watch mode.
*   `npm run build`: Builds the Next.js application for production.
*   `npm run start`: Starts the Next.js production server (after building).
*   `npm run lint`: Lints the codebase using Next.js's built-in ESLint configuration.
*   `npm run typecheck`: Runs TypeScript type checking.
*   `npm run prisma:migrate:dev`: Creates a new migration based on schema changes.
*   `npm run prisma:studio`: Opens Prisma Studio to view/edit data.

## Project Structure (Key Directories)

*   `src/app/`: Contains the Next.js App Router pages and API routes.
    *   `src/app/api/`: Backend API routes.
*   `src/components/`: Reusable React components.
    *   `src/components/layout/`: Layout components (header, sidebar, etc.).
    *   `src/components/ui/`: ShadCN UI components.
*   `src/contexts/`: React Context providers (e.g., `AuthContext`).
*   `src/hooks/`: Custom React hooks.
*   `src/lib/`: Utility functions, Prisma client, auth helpers.
*   `src/ai/`: Genkit related files (flows, configuration).
*   `prisma/`: Prisma schema (`schema.prisma`) and migrations.
*   `public/`: Static assets.
*   `docker-compose.yml`: Configuration for running services like PostgreSQL in Docker.

## Contributing

(Add guidelines for contributing if this is an open project).

## License

(Specify the license for your project, e.g., MIT).
