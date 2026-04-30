# Módulo 0 — Decisiones de diseño

## Ruta elegida para v1

**Ruta B:** Spotify Web API + GetSongBPM como complemento gratuito.

Esta ruta combina lo mejor de Spotify (catálogo, búsqueda, creación de playlists, autenticación de usuarios) con el dato más importante para mí como DJ: BPM y key (Camelot). El costo es agregar un backlink obligatorio a getsongbpm.com en la app, lo cual es aceptable. Asumo que habrá huecos de cobertura en música nicho (ej: cumbias rebajadas), por lo que el motor de generación debe permitir incluir tracks sin BPM en lugar de descartarlos automáticamente.

## Ejemplos de playlists que quiero poder generar en v1

1. Canciones para el momento más alto de una boda en México.
2. Canciones para un warm up tropical clásico.
3. Cumbias rebajadas que se bailarían en cualquier fiesta.

## Definición de "v1 terminada"

La v1 se considera terminada cuando puedo generar una playlist desde dos rutas distintas:

- **Modo filtros:** seleccionando criterios manuales (género, año, popularidad, BPM, etc.).
- **Modo prompt:** escribiendo en lenguaje natural y dejando que la app interprete los criterios.

Ambos modos deben crear una playlist real en mi cuenta de Spotify, con un link funcional para abrirla.

## Stack acordado

- Frontend: HTML + CSS + JavaScript vanilla
- Backend: Funciones serverless en Vercel
- APIs externas: Spotify Web API, GetSongBPM API
- IA (Modo prompt): Claude API
- Hosting: Vercel
- Distribución: PWA (Progressive Web App), instalable en iOS y desktop