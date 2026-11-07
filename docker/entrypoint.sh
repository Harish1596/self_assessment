#!/bin/sh
set -eu
# Fail before serving if migrations or seed validation fail. History stays in PostgreSQL.
node --import tsx server/seed.ts
exec node --import tsx server/main.ts
