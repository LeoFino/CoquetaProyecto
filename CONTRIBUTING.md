# Cómo trabajamos en La Coqueta

Esta guía define cómo nombramos las ramas, cómo escribimos los commits y cómo
subimos cambios. Somos 4 personas en el mismo repo, así que seguirla evita que
nos pisemos el trabajo.

## Regla de oro

**Nadie sube directo a `main`.** `main` siempre tiene que funcionar: es lo que
muestra el estado real del proyecto. Todo cambio entra por una rama propia y un
Pull Request.

## Ramas

Una rama por tarea (un issue = una rama).

**Formato:** `tipo/numero-descripcion-corta`

| Tipo | Se usa para |
|---|---|
| `feature` | Algo nuevo (una pantalla, un endpoint) |
| `fix` | Arreglar un error |
| `docs` | Documentación |
| `test` | Agregar o mejorar tests |
| `chore` | Configuración, CI, dependencias |

**Ejemplos:**

- `feature/46-formulario-pedido`
- `fix/51-descuento-stock`
- `docs/42-convencion-ramas-commits`

**Reglas del nombre:** todo en minúsculas, palabras separadas por guiones, sin
espacios, tildes ni ñ. `numero` es el número del issue en GitHub.

## Commits

**Formato:** `tipo: qué hiciste (#issue)`

- Mismos tipos que las ramas (`feature`, `fix`, `docs`, `test`, `chore`).
- En español, en presente, y cortos: que se entienda en una línea.
- Un commit = un cambio con sentido. Mejor varios commits chicos que uno gigante.

**Ejemplos buenos:**

- `feature: agregar formulario de carga de pedido (#46)`
- `fix: corregir cálculo del costo del lomito (#51)`
- `test: agregar test del costo por receta (#48)`

**Ejemplos malos:** `cambios`, `arreglo`, `asdf`, `listo`.

## Paso a paso para una tarea

```bash
# 1. Partir siempre de main actualizado
git checkout main
git pull

# 2. Crear tu rama
git checkout -b feature/46-formulario-pedido

# 3. Trabajar, y guardar con commits chicos
git add <archivos>
git commit -m "feature: agregar formulario de carga de pedido (#46)"

# 4. Subir la rama
git push -u origin feature/46-formulario-pedido
```

5. En GitHub, abrir un **Pull Request** hacia `main`.
6. Escribir `Closes #46` en la descripción: así el issue se cierra solo al unir.
7. Esperar que el **CI esté en verde** ✅ y que **otra persona** del equipo lo
   revise y apruebe.
8. Unir (merge) y borrar la rama.

## Reglas del Pull Request

- Chico y enfocado en una sola tarea.
- Si el CI está en rojo ❌, no se une. Se arregla primero.
- Lo revisa otra persona, nunca el mismo que lo escribió.
- Si algo no se entiende, se pregunta en el PR antes de unir.

## Antes de empezar cada día

```bash
git checkout main
git pull
```

Así trabajás siempre sobre lo último que subió el resto del equipo.
