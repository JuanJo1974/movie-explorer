# Movie Explorer — Diseño de la aplicación

**Fecha:** 2026-05-15  
**Stack:** Angular 17+ · TMDb API · TypeScript

---

## Resumen

Explorador de películas completo construido con Angular moderno (standalone components + Signals) consumiendo la API pública de TMDb. El objetivo es un proyecto de portfolio que demuestre buenas prácticas de Angular sin sobreingeniería.

---

## Arquitectura

**Patrón:** Services + Signals. Sin librería de gestión de estado externa.

**Versión de Angular:** 17+ con standalone components, Signals (`signal`, `computed`, `effect`) y `toSignal()` para convertir observables a signals.

### Estructura de carpetas

```
src/app/
  core/
    services/
      tmdb.service.ts          # Todos los endpoints de la API TMDb
      favorites.service.ts     # Estado de favoritos + localStorage
    interceptors/
      tmdb-auth.interceptor.ts # Inyecta Bearer token en cada petición HTTP
    models/
      movie.model.ts           # Interfaces TypeScript (Movie, Credits, Genre...)
  features/
    home/                      # Ruta /  (lazy-loaded)
    search/                    # Ruta /search  (lazy-loaded)
    detail/                    # Ruta /movie/:id  (lazy-loaded)
    favorites/                 # Ruta /favorites  (lazy-loaded)
  shared/
    components/
      movie-card/              # Póster + rating + botón de favorito
      movie-grid/              # Grid responsive de MovieCards
      navbar/                  # Navegación global con contador de favoritos
      rating-badge/            # Círculo con puntuación TMDb
  app.routes.ts
  app.config.ts
```

---

## Páginas y rutas

### Home (`/`)
- Navbar global
- Hero banner: backdrop de la primera película trending, título, puntuación, botones "Ver detalle" y "Añadir a favoritos"
- Carrusel horizontal "Películas populares" (lazy scroll)
- Carrusel horizontal "Mejor valoradas"

### Search (`/search`)
- Barra de búsqueda reactiva con debounce de 400 ms
- Chips de género (obtenidos de `/genre/movie/list`)
- Filtros de año y puntuación mínima
- Grid de resultados con paginación infinita (Intersection Observer)
- Estado vacío cuando no hay resultados

### Detail (`/movie/:id`)
- Backdrop full-width con gradiente oscuro
- Póster flotante superpuesto al backdrop
- Puntuación circular (TMDb style)
- Sinopsis completa
- Reparto principal (avatares + nombre + personaje)
- Botón de favorito (toggle)
- Sección "Películas similares" con grid horizontal

### Favorites (`/favorites`)
- Grid de películas guardadas
- Badge con contador en la Navbar
- Botón para eliminar cada película
- Estado vacío con llamada a la acción para buscar

---

## Flujo de datos

### Peticiones HTTP

`TmdbService` expone métodos que devuelven `Observable<T>`. Los componentes los convierten a signals dentro del injection context:

```ts
// Componente — sin initialValue para que undefined indique "cargando"
readonly movies = toSignal(this.tmdb.getTrending());
readonly isLoading = computed(() => this.movies() === undefined);
readonly movieList = computed(() => this.movies() ?? []);
```

El interceptor `TmdbAuthInterceptor` añade automáticamente el header `Authorization: Bearer <token>` a cada petición. Las credenciales nunca se gestionan en los componentes.

### Búsqueda reactiva

```ts
readonly query = signal('');

readonly results = toSignal(
  toObservable(this.query).pipe(
    debounceTime(400),
    distinctUntilChanged(),
    switchMap(q => q.length > 2 ? this.tmdb.search(q) : of([]))
  ),
  { initialValue: [] }
);
```

### Favoritos

`FavoritesService` mantiene un `signal<Movie[]>()`. Un `effect()` sincroniza con `localStorage` en cada cambio. Cualquier componente puede inyectar el servicio y usar `computed(() => this.favorites.isFavorite(movieId))`.

---

## Manejo de errores

- Tres estados por petición: `loading | data | error` (modelados con signals)
- El interceptor captura errores HTTP y los relanza con mensaje legible
- Cada feature renderiza su propio estado de error en pantalla (sin alerts)
- Las imágenes de póster tienen fallback a placeholder SVG si TMDb no devuelve imagen

---

## Tema visual

**Dark Blue (TMDb Style)**

| Token         | Valor     |
|---------------|-----------|
| Fondo base    | `#0f1923` |
| Fondo card    | `#1e3a4f` |
| Fondo surface | `#132032` |
| Acento        | `#01b4e4` |
| Acento alt    | `#90cea1` |
| Texto         | `#ffffff` |
| Texto muted   | `#a8d8f0` |

Fuente: Inter o sistema por defecto. Sin dependencias de CSS externas (estilos propios con CSS custom properties).

---

## Testing

Foco en demostrar conocimiento de testing, no en cobertura total.

| Qué                  | Cómo                                               |
|----------------------|----------------------------------------------------|
| `TmdbService`        | Unit test con `HttpClientTestingModule`; verifica endpoints y token |
| `FavoritesService`   | Unit test de `add`, `remove`, `isFavorite` con mock de `localStorage` |
| `MovieCardComponent` | Test de renderizado y de emisión del evento `favoriteToggled` |

---

## Decisiones descartadas

- **NgRx Signal Store:** excesivo para este tamaño de proyecto; añade dependencia pesada sin beneficio claro en portfolio
- **NgModules:** patrón pre-Angular 17, no demuestra conocimiento del stack moderno
- **CSS framework externo (Tailwind, Material):** se evita para mostrar capacidad de escribir estilos propios y mantener el bundle pequeño
