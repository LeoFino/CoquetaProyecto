# ============================================================
# Corrige la asignacion de Ezequiel en los issues que ya se crearon
# Version 2: trae todos los issues primero, evita problemas de comillas
# ============================================================

$assignee = "ezequielreche33"

$titulosEzequiel = @(
    "Configurar CI basico",
    "Definir convencion de ramas y commits",
    "Tests de creacion de pedido",
    "Tests de cobro y stock",
    "Tests de flujo de estados",
    "Tests de reportes y licencia",
    "Testing end-to-end completo",
    "Deploy a produccion",
    "Documentacion final",
    "Pulido de UI/UX general"
)

Write-Host "Trayendo todos los issues del repositorio..."
$todos = gh issue list --state all --limit 100 --json number,title | ConvertFrom-Json

foreach ($titulo in $titulosEzequiel) {
    $match = $todos | Where-Object { $_.title -eq $titulo }

    if ($match) {
        gh issue edit $match.number --add-assignee $assignee
        Write-Host "  OK: #$($match.number) - $titulo asignado a $assignee"
    } else {
        Write-Host "  NO ENCONTRADO: $titulo (revisalo a mano)"
    }
}

Write-Host "Listo! Revisado."
