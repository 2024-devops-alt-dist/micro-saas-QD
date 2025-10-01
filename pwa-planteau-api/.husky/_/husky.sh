#!/usr/bin/env sh
# Script Husky pour l'exécution des hooks
debug() {
  [ "$HUSKY_DEBUG" = "1" ] && echo "husky: $1"
}

if [ "$HUSKY" = "0" ]; then
  debug "skipped (HUSKY=0)"
  exit 0
fi
