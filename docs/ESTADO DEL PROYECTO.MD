# BP Playlist Builder — Estado del proyecto

## Visión

Generador de playlists para Spotify a partir de:
1. **Modo filtros:** selección manual de criterios (artista, año, género, BPM, key, mercado, explicit, etc.).
2. **Modo prompt:** descripción en lenguaje natural traducida a filtros estructurados vía Claude API.

Distribución: PWA (Progressive Web App) instalable en iOS y desktop. Sin costo de Apple Developer Program.

## Decisiones de diseño (Módulo 0)

### Ruta elegida: B

Spotify Web API + GetSongBPM como complemento gratuito. BPM y key (Camelot) vienen de GetSongBPM con backlink obligatorio. Catálogo, búsqueda y creación de playlists vienen de Spotify.

### Stack confirmado

- **Frontend:** HTML + CSS + JavaScript vanilla (sin framework al inicio).
- **Backend:** Funciones serverless en Vercel (free tier).
- **APIs externas:** Spotify Web API, GetSongBPM API, Claude API.
- **Hosting:** Vercel.
- **Distribución:** PWA.

### Ejemplos de playlists objetivo para v1

1. "Canciones para el momento más alto de una boda en México."
2. "Canciones para un warm up tropical clásico."
3. "Cumbias rebajadas que se bailarían en cualquier fiesta."

### Definición de "v1 terminada"

Cuando se puede generar una playlist desde **dos rutas distintas**:
- Modo filtros (selección manual de criterios).
- Modo prompt (lenguaje natural).

Ambos modos crean playlists reales en la cuenta de Spotify del usuario.

## Realidades técnicas confirmadas

### Spotify Web API — restricciones para apps nuevas en Development Mode

Las siguientes capacidades NO están disponibles para apps registradas después de noviembre 2024:

- ❌ Audio Features endpoint (BPM, energy, valence, danceability, key, tempo).
- ❌ Get Artist's Top Tracks endpoint.
- ❌ Related Artists endpoint.
- ❌ Recommendations endpoint.
- ❌ Popularity en respuestas de tracks (vía Client Credentials).

### Spotify Web API — capacidades disponibles

- ✅ Search (con sintaxis avanzada: `artist:"..."`, `year:`, `genre:`).
- ✅ Get Track / Get Album / Get Artist (info básica).
- ✅ Crear playlists (vía Authorization Code Flow con login del usuario).
- ✅ Leer playlists del usuario (con scopes apropiados).
- ✅ Manejar biblioteca personal del usuario.

### GetSongBPM API

- Acceso gratuito con API key.
- Backlink obligatorio a `getsongbpm.com` en la app.
- Cobertura buena pero con huecos (música nicho regional puede no estar).
- Tracks sin BPM se incluyen con marca "BPM desconocido" en lugar de descartarse.

### Cambios de Spotify de fines de 2024 y febrero 2026

- Redirect URIs: ya no se acepta `localhost`, solo `127.0.0.1`.
- Extended Quota Mode requiere ahora business legalmente registrado y 250k+ MAU.
- Algunos endpoints adicionales restringidos en febrero 2026.

## Plan modular (14 módulos)

### ✅ Módulo 0 — Decisiones de diseño
Cerrado. Ruta B elegida, ejemplos validados, criterios de v1 definidos.

### ✅ Módulo 1 — Setup del entorno
Cerrado. Tiene:
- Node.js 24, npm, Git instalados y verificados.
- VS Code con extensiones: ESLint (Microsoft), Prettier, GitLens.
- Cuenta de GitHub + Personal Access Token generado, expira a 90 días.
- Editor de Git configurado para usar VS Code (`git config --global core.editor "code --wait"`).
- Repo público: `https://github.com/BeatProfessor/bp_playlist_builder`.
- README con backlink a GetSongBPM en sección "Credits".
- `.gitignore` con exclusiones de OS, IDE, `.env`, `node_modules`.
- App Spotify Developer registrada con Redirect URI `http://127.0.0.1:3000/callback`.
- Credenciales Spotify (Client ID + Secret) guardadas localmente fuera del repo.
- API key de GetSongBPM recibida y guardada localmente.
- Hábito de no pegar credenciales en chats establecido (con un susto educativo).

### ✅ Módulo 2 — Conceptos base de web
Cerrado. Pablo entiende:
- Cliente vs servidor.
- HTTP: métodos (GET, POST, PUT, DELETE), status codes (200, 401, 403, 404), headers, body.
- JSON: estructura y parseo.
- REST y endpoints.
- Diferencia entre autenticación (quién eres) y autorización (qué puedes hacer).
- OAuth 2.0 paso a paso: redirección a Spotify, consentimiento, código temporal, intercambio por tokens.
- Por qué el Client Secret nunca vive en el navegador.
- Por qué GetSongBPM usa API Key simple y Spotify usa OAuth (datos públicos vs personales).
- Access Token vs Refresh Token y sus vidas útiles.
- Scopes vs endpoints.

### 🔁 Módulo 3 — Tu primera llamada a Spotify API (A REHACER)

Se completó previamente pero se perdieron los archivos. Hay que reconstruir físicamente.

**Por reconstruir:**
- Carpeta `module3-first-api-call/`.
- `package.json` con `"type": "module"`.
- `dotenv` instalado.
- `.env` con credenciales (Pablo las tiene guardadas localmente).
- `search.js` con tres funciones: `getAccessToken`, `searchArtist`, `searchTracksByArtist`.
- `main()` final que recibe nombre de artista como argumento de terminal.

**Conceptos ya internalizados (NO rehacer la explicación):**
- Client Credentials Flow y Base64 encoding con `Buffer.from(...).toString('base64')`.
- Diferencia entre header `Basic` (intercambio inicial) y `Bearer` (uso del token).
- Endpoint de Search con sintaxis avanzada: `artist:"..."`, `year:`, `genre:`.
- Por qué `getTopTracks` ya no es viable: Spotify lo deprecó para apps nuevas en Development Mode.
- Validación de coincidencia exacta normalizada (lowercase + sin acentos + trim) para rechazar basura como "gggggggggggg".
- Por qué Spotify ya no devuelve `popularity` vía Client Credentials.
- `encodeURIComponent` para escapar espacios y acentos en URLs.

**Hábitos de seguridad ya establecidos (NO rehacer la explicación):**
- Redactar credenciales antes de pegar outputs en chats.
- Guardar archivo (`Ctrl + S`) antes de correr.
- Crear archivos desde VS Code para evitar BOM/encoding issues (no `echo` en PowerShell).
- `.env` siempre bloqueado por `.gitignore`.
- Verificar con `git status --ignored` antes de hacer push.

**Pendientes para sub-módulo opcional después:**
- Mejorar `searchArtist` con Levenshtein distance para distinguir basura vs errores de tipeo razonables.
- Devolver múltiples candidatos con imágenes para que el usuario elija.

### 🔜 Módulo 4 — OAuth con usuario real
Próximo. Authorization Code Flow para que el usuario logueado pueda dar permisos. Aquí aparece el backend serverless por primera vez. Entregable: botón "Conectar Spotify" funcional en localhost.

### Módulo 5 — Leer playlists y tracks del usuario
Paginación, manejo de tokens que expiran, UI básica de playlists del usuario.

### Módulo 6 — Filtros disponibles en v1
Construir filtros con metadata pura: artista, año, género, mercado, explicit, artistas relacionados (vía búsqueda creativa). Excluye popularidad por la deprecación reciente.

### Módulo 7 — Motor de generación de playlists
La lógica que combina los filtros y arma una lista de candidatos. Incluye narrativa de DJ (cómo balancear y ordenar para una playlist con flujo).

### Módulo 8 — Crear la playlist en Spotify
Endpoint de creación, agregar los tracks, devolver el link.

### Módulo 9 — Modo prompt con Claude API
Claude traduce prompts en lenguaje natural a JSON de filtros que el motor del Módulo 7 ya sabe procesar.

### Módulo 10 — UX y manejo de errores
Loading states, errores de API, tokens expirados, tracks no disponibles en MX, etc.

### Módulo 11 — Convertirla en PWA
Manifest.json, service worker básico, íconos. Instalable en iPhone y PC.

### Módulo 12 — Deploy en Vercel
Subir el proyecto, configurar variables de entorno, dominio gratis. Migrar backlink de GetSongBPM al dominio de Vercel.

### Módulo 13 — Iteración con feedback real
Compartirla con 5-10 personas (DJs y no-DJs), recoger feedback, priorizar mejoras.

### Módulo 14 — Opcional: audio features y/o Apple Music
Integración de servicios pagados de audio features, o Apple Music con Developer Program.

## Convenciones del proyecto

### Credenciales

Todas las credenciales viven en archivos `.env` locales bloqueados por `.gitignore`. Nunca se pegan en chats sin redactar primero. Las variables se nombran con MAYÚSCULAS_Y_GUIONES_BAJOS.

Credenciales actuales:
- `SPOTIFY_CLIENT_ID` (público pero se trata como sensible).
- `SPOTIFY_CLIENT_SECRET` (alta sensibilidad).
- `GETSONGBPM_API_KEY` (media sensibilidad).
- Personal Access Token de GitHub (en Credential Manager de Windows).
- Anthropic API Key (cuando aplique, Módulo 9, alta sensibilidad por costo directo).

### Git workflow

```
git pull              ← al inicio de cada sesión
... trabajar ...
git add .
git commit -m "Module N: descripción clara"
git push
```

Antes de cada `git push`, verificar con `git status` que no se vaya a subir nada sensible.

### Estructura del repo

```
bp_playlist_builder/
├── README.md (con backlink a GetSongBPM)
├── .gitignore
├── docs/
│   └── module-0-decisions.md
├── notes/
├── module3-first-api-call/    ← módulos como carpetas separadas hasta el Módulo 11
│   ├── .env (ignorado)
│   ├── search.js
│   ├── package.json
│   └── node_modules/ (ignorado)
└── ... (futuras carpetas de módulos)
```

En el Módulo 11 se reorganiza todo en estructura limpia de PWA.

## Notas de Pablo como aprendiz

- Tiene background en C# pero el ecosistema Node moderno (imports, fetch nativo, async/await en JS) es nuevo.
- Aprende mejor cuando el "porqué" se explica antes del "cómo".
- Aprecia que se le anticipen errores comunes (encoding, typos, archivos sin guardar).
- Hábitos de seguridad de credenciales ya internalizados después de un susto en el Módulo 3 (pegó Client ID en chat, regeneró Secret, ahora redacta outputs).
- Cuestiona buenas decisiones: leyó términos de Spotify Developer antes de aceptar, verificó autenticidad de GetSongBPM antes de usar.