# gErCK Local Database

This folder contains the local PostgreSQL + pgvector setup for gErCK.
It is used for development and testing, with zero external dependencies.

---

## Start the database

From this folder:

```bash
docker compose up -d
Check the container:
docker ps
You should see gerck-postgres running.
Connect to the database
psql -h localhost -U postgres -d gerck
Password:postgres
Enable pgvector (first time only)
Inside psql:
CREATE EXTENSION IF NOT EXISTS vector;
Apply the schema
psql -h localhost -U postgres -d gerck -f schema.sql
Verify tables
\dt
You should see all workspace, content, chunk, instruction, assistant, and chat tables.
Reset the database (dangerous)
If you need a clean reset:
docker compose down
docker volume rm db_gerck_pgdata   # volume name may vary
docker compose up -d
Then reapply the schema.
