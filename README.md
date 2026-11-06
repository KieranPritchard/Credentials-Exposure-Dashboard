# Credentials Exposure Dashboard

![GitHub Created At](https://img.shields.io/github/created-at/KieranPritchard/credentials-exposure-dashboard) ![GitHub License](https://img.shields.io/github/license/KieranPritchard/credentials-exposure-dashboard) ![GitHub commit activity](https://img.shields.io/github/commit-activity/t/KieranPritchard/credentials-exposure-dashboard) ![GitHub last commit](https://img.shields.io/github/last-commit/KieranPritchard/credentials-exposure-dashboard) ![GitHub language count](https://img.shields.io/github/languages/count/KieranPritchard/credentials-exposure-dashboard) ![GitHub Repo stars](https://img.shields.io/github/stars/KieranPritchard/credentials-exposure-dashboard)

## Project Description

### Objective

To build a full-stack cybersecurity dashboard that monitors email addresses against known data breaches. I wanted to combine a Laravel API with a React frontend in one project, and work on authentication, background jobs and data visualisation along the way.

### Features

- **Authentication:** Registration, login and password reset using Laravel Sanctum API tokens. Protected routes on the frontend recover the session from local storage.
- **Credential Management:** Add, edit and delete the emails you want monitored. Each email is unique per user (`user_id` + `email`), so multiple users can track the same address without conflicts.
- **Exposure Analytics:** Summary metrics (total credentials, total breaches, average exposure, breach rate), plus an SVG donut chart that sorts credentials into Safe (0 breaches), Moderate (1 to 2) and Critical (3+).
- **Top Breaches:** Ranked bar charts showing which breaches (Adobe, Dropbox, LinkedIn etc.) affect the most accounts.
- **Domain Exposure:** Groups accounts by email provider (`@gmail.com`, custom domains) and shows safe vs breached for each.
- **Automated Breach Sync:** The Laravel scheduler checks every distinct monitored email against the XposedOrNot API, logs failures instead of crashing, and adds delays between requests to respect rate limits.
- **Dockerised Setup:** Multi-stage Docker builds, Docker secrets for the database password, and an Nginx reverse proxy in front of the API and frontend.

### Technology and Tools Used

- **Language:** PHP, TypeScript.
- **Framework/Library:** Laravel, Laravel Sanctum, Pest, Laravel Pint, React 19, Vite, Tailwind CSS v4, React Router 7, Zod, Axios, Lucide React.
- **Database:** PostgreSQL 16 (in-memory SQLite for tests).
- **API:** XposedOrNot.
- **Tools:** Git, VS Code, Docker, Docker Compose, Nginx, Composer, npm.

### Challenges Faced

**Proxy Routing:** Requests were reaching the app with and without the `/api` prefix depending on whether they came through the Nginx proxy or straight from the Vite dev server. I fixed this by making every endpoint available both with and without the `/api` prefix.

**Rate Limits:** The scheduled sync checks every monitored email against the XposedOrNot API, and firing the requests back to back hit the API's limits. I added delays between requests and made the sync log failures instead of stopping, so one bad lookup doesn't break the whole run.

**Unique Emails Per User:** A plain unique constraint on `email` meant two users couldn't monitor the same address. I changed it to a compound unique constraint on `user_id` + `email`, so each user has their own list.

### Outcome

[Kieran: confirm or change this.] The project is a working dashboard where a user can log in, add emails and see how exposed they are across known breaches, with the data kept up to date by the scheduler in the background. It gave me experience connecting a Laravel API to a React frontend, running scheduled jobs against a third party API, and containerising the whole stack.

## How to Use the Project

1. **Clone The Repository:**
   - Use git to clone the project.

```
git clone https://github.com/KieranPritchard/credentials-exposure-dashboard.git
cd credentials-exposure-dashboard
```

2. **Option 1, Run With Docker Compose (Recommended):**
   - Create the database password secret and the root environment file:

```
cp secrets/db/password.txt.example secrets/db/password.txt
cp .env.example .env
```

   - Build and start the containers:

```
docker compose up --build -d
```

   - The web dashboard is at `http://localhost` and the Laravel API is at `http://localhost:8000`.
   - To stop everything, run `docker compose down`.

3. **Option 2, Run Locally:**
   - You need PHP 8.3 or higher (with `pdo_sqlite`, `pdo_pgsql`, `mbstring` and `openssl`), Composer and Node.js v20+.
   - Set up the backend:

```
cd api
composer install
cp .env.example .env
php artisan key:generate
touch database/database.sqlite
php artisan migrate
php artisan serve
```

   - In a second terminal, run the scheduler so breach checks happen: `php artisan schedule:work`
   - In a third terminal, set up the frontend:

```
cd web
npm install
npm run dev
```

   - The frontend runs at `http://localhost:5173` and proxies `/api` requests to `http://localhost:8000`.

4. **Use The Dashboard:**
   - Register an account and log in.
   - Go to the Credentials page and add the emails you want to monitor.
   - Check the Dashboard page for the exposure breakdown, top breaches and domain analysis.

5. **Run The Tests:**
   - Backend tests: `cd api` then `php artisan test`
   - Code style check: `./vendor/bin/pint --test`
   - Frontend lint and build check: `cd web` then `npm run lint` and `npm run build`

## Licenses

License is located in the root of the repository.