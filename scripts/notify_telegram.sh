#!/usr/bin/env bash
# Usage: notify_telegram.sh "message" — reads config from venture/07-automation/telegram.conf
# telegram.conf format (two lines): TG_BOT_TOKEN=...  TG_CHAT_ID=...
CONF="$(dirname "$0")/../venture/07-automation/telegram.conf"
[ -f "$CONF" ] || { echo "telegram.conf missing — skipping TG notify"; exit 0; }
source "$CONF"
[ -n "$TG_BOT_TOKEN" ] && [ -n "$TG_CHAT_ID" ] || { echo "telegram.conf incomplete"; exit 0; }
curl -s -X POST "https://api.telegram.org/bot${TG_BOT_TOKEN}/sendMessage" \
  -d chat_id="${TG_CHAT_ID}" --data-urlencode text="$1" -d disable_web_page_preview=true | head -c 200
