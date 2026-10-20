#!/bin/bash
# ============================================================
# Script para cargar todas las tareas del proyecto a GitHub
# Crea: milestones (uno por sprint), labels (frontend/backend/testing)
# e issues (uno por tarea), asignados al responsable correspondiente.
#
# REQUISITOS ANTES DE CORRERLO:
# 1. Tener instalado GitHub CLI (gh) -> https://cli.github.com
# 2. Haber corrido "gh auth login" una vez (inicia sesión en tu cuenta)
# 3. Completar el mapeo de usuarios de GitHub más abajo
# 4. Correr este script DESDE ADENTRO de la carpeta del repositorio
#    (o con "gh repo set-default" ya configurado)
# ============================================================

set -e

CSV_FILE="$(dirname "${BASH_SOURCE[0]}")/issues.csv"

# --- 1) Completá acá el usuario de GitHub real de cada persona ---
declare -A USUARIOS
USUARIOS["Leandro"]="LeoFino_leandro"
USUARIOS["Ezequiel"]="ezequielreche33-commits_ezequiel"
USUARIOS["Gustavo"]="Gutaito_gustavo"

# --- 2) Crear labels (si ya existen, el script sigue sin problema) ---
echo "Creando labels..."
gh label create "frontend" --color "1D76DB" --description "Tareas de frontend (Leandro)" 2>/dev/null || true
gh label create "backend"  --color "0E8A16" --description "Tareas de backend (Gustavo)"  2>/dev/null || true
gh label create "testing"  --color "D93F0B" --description "Tareas de testing (Ezequiel)" 2>/dev/null || true

# --- 3) Crear un milestone por cada sprint distinto en el CSV ---
echo "Creando milestones..."
tail -n +2 "$CSV_FILE" | cut -d',' -f1 | sort -u | while read -r sprint; do
  [ -z "$sprint" ] && continue
  gh api repos/:owner/:repo/milestones -f title="$sprint" >/dev/null 2>&1 || true
  echo "  - $sprint"
done

# --- 4) Crear un issue por cada fila del CSV ---
echo "Creando issues..."
tail -n +2 "$CSV_FILE" | while IFS=',' read -r sprint issue responsable label; do
  [ -z "$issue" ] && continue

  ASSIGNEE="${USUARIOS[$responsable]}"

  if [ -n "$ASSIGNEE" ]; then
    gh issue create \
      --title "$issue" \
      --body "Sprint: $sprint | Responsable: $responsable" \
      --milestone "$sprint" \
      --label "$label" \
      --assignee "$ASSIGNEE"
  else
    # Caso "Todos" u otro responsable sin usuario mapeado: se crea sin asignar
    gh issue create \
      --title "$issue" \
      --body "Sprint: $sprint | Responsable: $responsable" \
      --milestone "$sprint" \
      --label "$label"
  fi

  echo "  ✓ $issue ($responsable)"
done

echo "¡Listo! Todos los issues fueron creados."
