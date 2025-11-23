#!/bin/bash
set -e

docker-entrypoint.sh postgres &

until pg_isready -U "$POSTGRES_USER" -d "$POSTGRES_DB"; do
  echo "Waiting for PostgreSQL..."
  sleep 2
done

echo "Running startup SQL..."
psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -f /setup.sql

echo "SQL completed."

wait
