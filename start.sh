#!/usr/bin/env bash
# Start Recall locally with Docker as the only prerequisite.
# Rebuild the app, mount the persistent database, apply migrations, synchronise
# changed seed content, wait for readiness and print the app URL. Safe to re-run.
#
#   ./start.sh             build and start in the background
#   ./start.sh --stop      stop containers, keeping the database
#   ./start.sh --logs      follow stack logs (Ctrl+C leaves the app running)
#   ./start.sh --status    show container status and the actual browser URL
#   ./start.sh --help      show these instructions
set -euo pipefail
umask 077

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT"
PROJECT="${COMPOSE_PROJECT_NAME:-recall}"
ENV_FILE="${RECALL_ENV_FILE:-$ROOT/.env}"

step() { printf '\n==> %s\n' "$1"; }
die() { printf '\nError: %s\n' "$1" >&2; exit 1; }
compose() {
  if [ -f "$ENV_FILE" ]; then
    docker compose -p "$PROJECT" --env-file "$ENV_FILE" -f "$ROOT/compose.yaml" "$@"
  else
    docker compose -p "$PROJECT" -f "$ROOT/compose.yaml" "$@"
  fi
}
help_text() { sed -n '2,10s/^# \{0,1\}//p' "$ROOT/start.sh"; }
require_docker() {
  command -v docker >/dev/null 2>&1 || die 'Install Docker Desktop (or Docker Engine with Compose v2), then run ./start.sh again.'
  docker compose version >/dev/null 2>&1 || die 'Docker Compose v2 is required.'
  if ! docker info >/dev/null 2>&1; then
    if [ "$(uname -s)" = Darwin ] && [ -d /Applications/Docker.app ]; then
      step 'Starting Docker Desktop'
      open -a Docker || die 'Docker Desktop could not be opened. Start it manually and retry.'
      local elapsed=0
      until docker info >/dev/null 2>&1; do
        [ "$elapsed" -lt 120 ] || die 'Docker did not become ready within two minutes. Start Docker Desktop and retry.'
        sleep 3
        elapsed=$((elapsed + 3))
      done
    else
      die 'Docker is not running. Start Docker Desktop or your Docker daemon and retry.'
    fi
  fi
}
read_web_port() {
  [ -f "$ENV_FILE" ] || return 0
  awk -F= '/^[[:space:]]*RECALL_WEB_PORT=/ { sub(/^[^=]*=/, ""); gsub(/^[[:space:]"\047]+|[[:space:]"\047]+$/, ""); value=$0 } END { print value }' "$ENV_FILE"
}
write_web_port() {
  local temporary
  temporary="$(mktemp "${ENV_FILE}.recall.XXXXXX")"
  awk -v value="$1" '/^[[:space:]]*RECALL_WEB_PORT=/ { print "RECALL_WEB_PORT=" value; found=1; next } { print } END { if (!found) print "\n# Browser port selected by start.sh\nRECALL_WEB_PORT=" value }' "$ENV_FILE" > "$temporary"
  mv "$temporary" "$ENV_FILE"
}
port_in_use() { (exec 3<>"/dev/tcp/127.0.0.1/$1") >/dev/null 2>&1; }
choose_web_port() {
  local wanted current candidate limit
  wanted="${RECALL_WEB_PORT:-$(read_web_port)}"
  wanted="${wanted:-5173}"
  case "$wanted" in *[!0-9]*|'') die 'RECALL_WEB_PORT must be a number between 1024 and 65535.' ;; esac
  [ "${#wanted}" -le 5 ] || die 'RECALL_WEB_PORT is out of range.'
  wanted=$((10#$wanted))
  [ "$wanted" -ge 1024 ] && [ "$wanted" -le 65535 ] || die 'RECALL_WEB_PORT must be between 1024 and 65535.'
  current="$(compose port app 3001 2>/dev/null || true)"
  candidate="$wanted"
  limit=$((wanted + 100))
  while port_in_use "$candidate"; do
    [ "$current" = "127.0.0.1:$candidate" ] && break
    candidate=$((candidate + 1))
    [ "$candidate" -lt "$limit" ] && [ "$candidate" -le 65535 ] || die "No available browser port near $wanted. Set RECALL_WEB_PORT in .env and retry."
  done
  if [ "$candidate" != "$wanted" ]; then
    write_web_port "$candidate"
    printf 'Port %s is occupied; using %s (saved in .env).\n' "$wanted" "$candidate"
  fi
  export RECALL_WEB_PORT="$candidate"
}
show_url() {
  local binding
  binding="$(compose port app 3001 2>/dev/null || true)"
  if [ -n "$binding" ]; then
    printf '\nRecall: http://%s\n' "$binding"
  else
    printf '\nThe app is not running. Run ./start.sh to start it.\n'
  fi
}
start() {
  require_docker
  [ -f "$ENV_FILE" ] || { cp .env.example "$ENV_FILE"; printf 'Created .env from .env.example.\n'; }
  compose config --quiet
  choose_web_port
  step 'Building and starting Recall'
  printf 'The first build may take several minutes. Seed updates preserve session answers and progress.\n'
  if ! compose up -d --build --wait --wait-timeout 180; then
    compose logs --tail 40 app >&2 || true
    die 'Startup did not complete. Inspect ./start.sh --logs, fix the reported issue, then retry. No database volume was removed.'
  fi
  step 'Recall is ready'
  show_url
  printf '\nContainers run in the background.\nStop: ./start.sh --stop\nLogs: ./start.sh --logs\nStatus: ./start.sh --status\n'
}
[ "$#" -le 1 ] || die 'Pass one command at a time. Use ./start.sh --help.'
case "${1:---start}" in
  --help|-h|help) help_text ;;
  --start|start) start ;;
  --stop|stop) require_docker; compose stop app db; printf 'Stopped. The database volume is preserved.\n' ;;
  --logs|logs) require_docker; compose logs --follow --tail 100 ;;
  --status|status) require_docker; compose ps --all; show_url ;;
  *) die "Unknown command: $1. Use ./start.sh --help." ;;
esac
