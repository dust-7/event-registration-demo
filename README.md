# Event Registration System

This is a demo system for a Software Engineering assignment.

## Instructions

*TODO:*
- *Instructions for running the system locally.*
- *Instructions for running unit tests locally.*

### Setting Up Database

1. Create a MySQL database. One method is to run the following command in MySQL CLI:

   ```
   CREATE DATABASE database_name;
   ```

2. Create a `.env` file at the path `api/.env` with the following variables:

   ```
   DB_NAME=database_name
   DB_USER=root
   DB_PASSWORD=
   DB_HOST=localhost
   DB_PORT=3306
   ```

   Only `DB_NAME` and `DB_USER` are mandatory. `DB_HOST` defaults to `localhost` and `DB_PORT` defaults to `3306`.

### Seed Data

Database tables and demo records are automatically created with `sequelize.sync()` and a custom `seed()` function. No manual work is needed.
