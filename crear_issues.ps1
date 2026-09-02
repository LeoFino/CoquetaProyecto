# ============================================================
# Script para cargar todas las tareas del proyecto a GitHub
# Version PowerShell (no necesita bash ni WSL)
# ============================================================

$csvFile = "issues.csv"

$usuarios = @{
    "Leandro"  = "LeoFino_leandro"
    "Ezequiel" = "ezequielreche33-commits_ezequiel"
    "Gustavo"  = "Gutaito_gustavo"
}

Write-Host "Creando labels..."
gh label create "frontend" --color "1D76DB" --description "Tareas de frontend (Leandro)" 2>$null
gh label create "backend"  --color "0E8A16" --description "Tareas de backend (Gustavo)"  2>$null
gh label create "testing"  --color "D93F0B" --description "Tareas de testing (Ezequiel)" 2>$null

$rows = Import-Csv -Path $csvFile

Write-Host "Creando milestones..."
$sprints = $rows | Select-Object -ExpandProperty Sprint -Unique
foreach ($sprint in $sprints) {
    gh api repos/:owner/:repo/milestones -f title="$sprint" 2>$null | Out-Null
    Write-Host "  - $sprint"
}

Write-Host "Creando issues..."
foreach ($row in $rows) {
    $issue       = $row.Issue
    $sprint      = $row.Sprint
    $responsable = $row.Responsable
    $label       = $row.Label
    $assignee    = $usuarios[$responsable]

    if ($assignee) {
        gh issue create --title "$issue" --body "Sprint: $sprint | Responsable: $responsable" --milestone "$sprint" --label "$label" --assignee "$assignee"
    } else {
        gh issue create --title "$issue" --body "Sprint: $sprint | Responsable: $responsable" --milestone "$sprint" --label "$label"
    }
    Write-Host "  OK: $issue ($responsable)"
}

Write-Host "Listo! Todos los issues fueron creados."
