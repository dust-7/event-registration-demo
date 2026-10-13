# Event Registration System

This is a demo system for a Software Engineering assignment.

## Instructions

*TODO:*
- *Instructions for running the system locally.*
- *Instructions for running unit tests locally.*

### Database

Create a MySQL database. One method is to run the following command in MySQL CLI:

```
CREATE DATABASE database_name;
```

### .env File

Create a `.env` file at the path `api/.env` with the following variables:

```
DB_NAME=database_name
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

### Seed Data

Database tables and demo records are automatically created with `sequelize.sync()` and a custom `seed()` function. No manual work is needed.
