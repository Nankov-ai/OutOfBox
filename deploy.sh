#!/usr/bin/env bash
# Publica o último commit no repositório público SEM o CLAUDE.md.
# O código continua público (build/deploy automático mantém-se); CLAUDE.md e histórico ficam em OutOfBox-src (privado).
set -euo pipefail
PUBLIC_REPO="https://github.com/Nankov-ai/OutOfBox.git"
cd "$(dirname "$0")"
[ -z "$(git status --porcelain)" ] || { echo "ERRO: faz commit antes do deploy." >&2; exit 1; }
TMP="$(mktemp -d)"; trap 'rm -rf "$TMP"' EXIT
git archive HEAD | tar -x -C "$TMP"
rm -f "$TMP/CLAUDE.md"
SRC_REV="$(git rev-parse --short HEAD)"
cd "$TMP"; git init -q -b main; git add -A
git commit -q -m "Publish ($(date +%Y-%m-%d))"
git push -q --force "$PUBLIC_REPO" main
echo "Publicado (fonte: $SRC_REV)."
