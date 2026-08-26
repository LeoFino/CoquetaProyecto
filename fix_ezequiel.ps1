# ============================================================
# Corrige la asignacion de Ezequiel en los issues que ya se crearon
# (el username estaba mal escrito la primera vez)
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

foreach ($titulo in $titulosEzequiel) {
    $resultado = gh issue list --state all --search "`"$titulo`" in:title" --json number,title | ConvertFrom-Json
    $match = $resultado | Where-Object { $_.title -eq $titulo }

    if ($match) {
        gh issue edit $match.number --add-assignee $assignee
        Write-Host "  OK: #$($match.number) - $titulo asignado a $assignee"
    } else {
        Write-Host "  NO ENCONTRADO: $titulo (revisalo a mano)"
    }
}

Write-Host "Listo! Revisado."
