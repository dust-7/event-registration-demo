# Event Registration System

This is an Event Registration System for a fictional Event Company. It is a demo system for a Software Engineering assignment.

### Note on User Story 5

The Registration Trend user story mentions "The table should consist of all dates from event creation date till registration deadline".

If the deadline is a future date from the present day, it seems redundant to display rows for future dates. This demo system instead displays rows for dates until deadline OR "today", whichever is earlier.

## Instructions

### Database

Create a MySQL database. One method is to run the following command in MySQL CLI:

```sql
CREATE DATABASE event_registration_demo;
```

Database tables are automatically created with `sequelize.sync()`.

### .env Files

For the API server, create a **.env** file at the path `api/.env` with the following variables:

```properties
DB_NAME=event_registration_demo
DB_USER=root
DB_PASSWORD=
DB_HOST=localhost
DB_PORT=3306
ONEMAP_EMAIL=
ONEMAP_EMAIL_PASSWORD=
ONEMAP_BASE_URL=https://www.onemap.gov.sg/api
```

At minimum, update the following variables with your own values:
- DB_NAME
- DB_USER
- DB_PASSWORD
- ONEMAP_EMAIL
- ONEMAP_EMAIL_PASSWORD

For the frontend server, create a **.env.local** file at the path `frontend/.env.local` with the following variable:

```properties
VITE_API_URL=/api
```

### Seed Data

Demo records are inserted with a custom `seed()` function. It seeds a few employees, events, and registrants. See [seed.ts](api/src/config/seed.ts) for more info.

Additional employees can be created like so:

```sql
INSERT INTO employees (uuid, name)
VALUES (uuid(), 'John Doe');
```

### Running The System

1. Start the API server:

   - From the `api/` folder, install node packages using `npm install`.
   - Build the app using `npm run build`.
   - Then, start the app using `npm start`.
   - Alternatively, run the dev instance using `npm run dev`.

2. Start the frontend server:

   - From the `frontend/` folder, install node packages using `npm install`.
   - Build the app using `npm run build`.
   - Then, start the app using `npm run preview`.
   - Alternatively, run the dev instance using `npm run dev`.

3. Navigating the frontend:

   - Access the frontend via: http://localhost:8001/
   - The index displays the public open events list.
   - The "Admin" button on the top-right corner links to `/admin`, which displays the admin events list.

### Running Unit Tests

Unit tests are available for the API server.

From the `api/` folder:
- run `npm test` for regular testing with jest, or
- run `npm run test:coverage` for a test coverage report
