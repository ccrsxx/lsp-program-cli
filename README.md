# Sora Backend

## Development

Here are the steps to run the project locally.

1. Clone the repository

   ```bash
   git clone https://github.com/ccrsxx/sora-backend.git
   ```

1. Change directory to the project

   ```bash
   cd sora-backend
   ```

1. Install dependencies

   ```bash
   npm i
   ```

1. Create a copy of the `.env.example` file and name it `.env.local`. Make sure to fill the credentials correctly.

   ```bash
   cp .env.example .env.local
   ```

1. Create DB if not exists

   ```bash
   npm run db:create
   ```

1. Run migrations

   ```bash
   npm run db:migrate
   ```

1. Run seeders

   ```bash
   npm run db:seed
   ```

1. Run the app

   ```bash
   npm run dev
   ```
