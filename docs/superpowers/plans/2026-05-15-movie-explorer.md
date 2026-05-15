# Movie Explorer — Plan de Implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir un explorador de películas completo con Angular 17+ consumiendo TMDb API, con páginas de Home, Search, Detail y Favorites.

**Architecture:** Standalone components con Signals, patrón Services + toSignal() para datos HTTP, sin librería de estado externa. Cuatro features lazy-loaded con un shared de componentes reutilizables.

**Tech Stack:** Angular 17+, TypeScript, RxJS (toSignal/toObservable), TMDb REST API v3, SCSS, Jasmine/Karma.

---

## Mapa de archivos

```
src/
  environments/
    environment.ts                          # token TMDb dev
    environment.prod.ts                     # token TMDb prod
  app/
    core/
      models/movie.model.ts                 # interfaces TypeScript
      interceptors/
        tmdb-auth.interceptor.ts            # añade Bearer token
        tmdb-auth.interceptor.spec.ts
      services/
        tmdb.service.ts                     # endpoints TMDb
        tmdb.service.spec.ts
        favorites.service.ts                # signal + localStorage
        favorites.service.spec.ts
    shared/components/
      rating-badge/
        rating-badge.component.ts/.html/.scss
      movie-card/
        movie-card.component.ts/.html/.scss/.spec.ts
      movie-grid/
        movie-grid.component.ts/.html/.scss
      navbar/
        navbar.component.ts/.html/.scss
    features/
      home/home.component.ts/.html/.scss
      search/search.component.ts/.html/.scss
      detail/detail.component.ts/.html/.scss
      favorites/favorites.component.ts/.html/.scss
    app.config.ts
    app.routes.ts
    app.component.ts/.html/.scss
  styles.scss                               # CSS custom properties + reset
  assets/no-poster.svg
```

---

## Task 1: Scaffold Angular 17+

**Files:**
- Create: `/Users/juanjo/movie-explorer/` (proyecto Angular)

- [ ] **Step 1: Mover archivos existentes temporalmente**

```bash
cd /Users/juanjo/movie-explorer
mkdir -p /tmp/me-backup
mv docs .superpowers /tmp/me-backup/ 2>/dev/null; true
cd /Users/juanjo
rmdir movie-explorer 2>/dev/null; true
```

- [ ] **Step 2: Generar el proyecto Angular**

```bash
cd /Users/juanjo
ng new movie-explorer --style=scss --no-ssr --routing=false
```

Cuando pregunte "Which stylesheet format?": ya está fijado por `--style=scss`.  
Cuando pregunte "Do you want to enable Server-Side Rendering?": No (o ya fijado por `--no-ssr`).

- [ ] **Step 3: Restaurar archivos del diseño**

```bash
mv /tmp/me-backup/docs /Users/juanjo/movie-explorer/
mv /tmp/me-backup/.superpowers /Users/juanjo/movie-explorer/ 2>/dev/null; true
```

- [ ] **Step 4: Verificar que el proyecto arranca**

```bash
cd /Users/juanjo/movie-explorer
npm start
```

Esperado: compilación exitosa, `http://localhost:4200` muestra la página de bienvenida de Angular.

- [ ] **Step 5: Añadir .superpowers a .gitignore**

Añadir al final de `.gitignore`:
```
.superpowers/
```

- [ ] **Step 6: Commit inicial**

```bash
cd /Users/juanjo/movie-explorer
git add .
git commit -m "feat: scaffold Angular 17+ movie explorer"
```

---

## Task 2: Entornos y estilos globales

**Files:**
- Create: `src/environments/environment.ts`
- Create: `src/environments/environment.prod.ts`
- Modify: `src/styles.scss`
- Create: `src/assets/no-poster.svg`

- [ ] **Step 1: Crear archivos de entorno**

```bash
mkdir -p src/environments
```

`src/environments/environment.ts`:
```typescript
export const environment = {
  production: false,
  tmdbToken: 'TU_TMDB_READ_ACCESS_TOKEN_AQUI'
};
```

`src/environments/environment.prod.ts`:
```typescript
export const environment = {
  production: true,
  tmdbToken: 'TU_TMDB_READ_ACCESS_TOKEN_AQUI'
};
```

> Obtener token en: https://www.themoviedb.org/settings/api → "API Read Access Token (v4 auth)"

- [ ] **Step 2: Registrar fileReplacements en angular.json**

En `angular.json`, dentro de `projects.movie-explorer.architect.build.configurations.production`, añadir:
```json
"fileReplacements": [
  {
    "replace": "src/environments/environment.ts",
    "with": "src/environments/environment.prod.ts"
  }
]
```

- [ ] **Step 3: Estilos globales con CSS custom properties**

`src/styles.scss`:
```scss
:root {
  --color-bg: #0f1923;
  --color-surface: #132032;
  --color-card: #1e3a4f;
  --color-accent: #01b4e4;
  --color-accent-alt: #90cea1;
  --color-text: #ffffff;
  --color-text-muted: #a8d8f0;
  --color-border: #1e3a4f;

  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 16px;
  --shadow-card: 0 4px 16px rgba(0, 0, 0, 0.4);
}

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html, body {
  height: 100%;
  background-color: var(--color-bg);
  color: var(--color-text);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
  font-size: 16px;
  line-height: 1.5;
}

a {
  color: inherit;
  text-decoration: none;
}

img {
  display: block;
  max-width: 100%;
}

button {
  cursor: pointer;
  border: none;
  background: none;
  font: inherit;
  color: inherit;
}
```

- [ ] **Step 4: Placeholder SVG para pósters sin imagen**

`src/assets/no-poster.svg`:
```svg
<svg xmlns="http://www.w3.org/2000/svg" width="500" height="750" viewBox="0 0 500 750">
  <rect width="500" height="750" fill="#1e3a4f"/>
  <text x="250" y="400" font-family="sans-serif" font-size="80" fill="#01b4e4" text-anchor="middle">🎬</text>
</svg>
```

- [ ] **Step 5: Commit**

```bash
git add src/environments src/styles.scss src/assets/no-poster.svg angular.json
git commit -m "feat: add environments, global styles, and placeholder SVG"
```

---

## Task 3: Modelos TypeScript

**Files:**
- Create: `src/app/core/models/movie.model.ts`

- [ ] **Step 1: Crear interfaces**

```bash
mkdir -p src/app/core/models
```

`src/app/core/models/movie.model.ts`:
```typescript
export interface Genre {
  id: number;
  name: string;
}

export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  vote_count: number;
  release_date: string;
  genre_ids: number[];
}

export interface MovieDetail extends Movie {
  runtime: number;
  genres: Genre[];
  tagline: string;
}

export interface Cast {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export interface Credits {
  cast: Cast[];
}

export interface MovieListResponse {
  results: Movie[];
  page: number;
  total_pages: number;
  total_results: number;
}

export interface GenreListResponse {
  genres: Genre[];
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/core/models
git commit -m "feat: add core TypeScript models"
```

---

## Task 4: TmdbAuthInterceptor (TDD)

**Files:**
- Create: `src/app/core/interceptors/tmdb-auth.interceptor.ts`
- Create: `src/app/core/interceptors/tmdb-auth.interceptor.spec.ts`

- [ ] **Step 1: Escribir el test**

```bash
mkdir -p src/app/core/interceptors
```

`src/app/core/interceptors/tmdb-auth.interceptor.spec.ts`:
```typescript
import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { tmdbAuthInterceptor } from './tmdb-auth.interceptor';

describe('tmdbAuthInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([tmdbAuthInterceptor])),
        provideHttpClientTesting()
      ]
    });
    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should add an Authorization Bearer header to every request', () => {
    http.get('/test').subscribe();
    const req = httpMock.expectOne('/test');
    expect(req.request.headers.get('Authorization')).toMatch(/^Bearer .+/);
    req.flush({});
  });
});
```

- [ ] **Step 2: Ejecutar y verificar que falla**

```bash
npx ng test --include="**/tmdb-auth.interceptor.spec.ts" --watch=false
```

Esperado: FAILED — `Cannot find module './tmdb-auth.interceptor'`

- [ ] **Step 3: Implementar el interceptor**

`src/app/core/interceptors/tmdb-auth.interceptor.ts`:
```typescript
import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export const tmdbAuthInterceptor: HttpInterceptorFn = (req, next) => {
  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${environment.tmdbToken}`
    }
  });
  return next(authReq);
};
```

- [ ] **Step 4: Ejecutar y verificar que pasa**

```bash
npx ng test --include="**/tmdb-auth.interceptor.spec.ts" --watch=false
```

Esperado: 1 spec, 0 failures

- [ ] **Step 5: Commit**

```bash
git add src/app/core/interceptors
git commit -m "feat: add TmdbAuthInterceptor with Bearer token"
```

---

## Task 5: TmdbService (TDD)

**Files:**
- Create: `src/app/core/services/tmdb.service.ts`
- Create: `src/app/core/services/tmdb.service.spec.ts`

- [ ] **Step 1: Escribir los tests**

```bash
mkdir -p src/app/core/services
```

`src/app/core/services/tmdb.service.spec.ts`:
```typescript
import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { TmdbService } from './tmdb.service';

const BASE = 'https://api.themoviedb.org/3';

describe('TmdbService', () => {
  let service: TmdbService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TmdbService, provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(TmdbService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should fetch trending movies', () => {
    const mockMovies = [{ id: 1, title: 'Test Movie' }];
    service.getTrending().subscribe(movies => {
      expect(movies.length).toBe(1);
      expect(movies[0].title).toBe('Test Movie');
    });
    const req = httpMock.expectOne(`${BASE}/trending/movie/week`);
    expect(req.request.method).toBe('GET');
    req.flush({ results: mockMovies });
  });

  it('should fetch popular movies', () => {
    service.getPopular().subscribe();
    const req = httpMock.expectOne(`${BASE}/movie/popular`);
    expect(req.request.method).toBe('GET');
    req.flush({ results: [] });
  });

  it('should fetch top rated movies', () => {
    service.getTopRated().subscribe();
    const req = httpMock.expectOne(`${BASE}/movie/top_rated`);
    expect(req.request.method).toBe('GET');
    req.flush({ results: [] });
  });

  it('should search movies with query param', () => {
    service.search('inception').subscribe();
    const req = httpMock.expectOne(r => r.url === `${BASE}/search/movie`);
    expect(req.request.params.get('query')).toBe('inception');
    req.flush({ results: [], total_pages: 1 });
  });

  it('should fetch movie detail by id', () => {
    service.getMovie(123).subscribe();
    const req = httpMock.expectOne(`${BASE}/movie/123`);
    expect(req.request.method).toBe('GET');
    req.flush({ id: 123, title: 'Test' });
  });

  it('should return poster URL with w500 size', () => {
    expect(service.posterUrl('/test.jpg')).toBe('https://image.tmdb.org/t/p/w500/test.jpg');
  });

  it('should return placeholder for null poster path', () => {
    expect(service.posterUrl(null)).toBe('/assets/no-poster.svg');
  });
});
```

- [ ] **Step 2: Ejecutar y verificar que falla**

```bash
npx ng test --include="**/tmdb.service.spec.ts" --watch=false
```

Esperado: FAILED — `Cannot find module './tmdb.service'`

- [ ] **Step 3: Implementar el servicio**

`src/app/core/services/tmdb.service.ts`:
```typescript
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import {
  Credits,
  Genre,
  GenreListResponse,
  Movie,
  MovieDetail,
  MovieListResponse
} from '../models/movie.model';

@Injectable({ providedIn: 'root' })
export class TmdbService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'https://api.themoviedb.org/3';
  private readonly imageBase = 'https://image.tmdb.org/t/p/';

  getTrending(): Observable<Movie[]> {
    return this.http
      .get<MovieListResponse>(`${this.baseUrl}/trending/movie/week`)
      .pipe(map(r => r.results));
  }

  getPopular(): Observable<Movie[]> {
    return this.http
      .get<MovieListResponse>(`${this.baseUrl}/movie/popular`)
      .pipe(map(r => r.results));
  }

  getTopRated(): Observable<Movie[]> {
    return this.http
      .get<MovieListResponse>(`${this.baseUrl}/movie/top_rated`)
      .pipe(map(r => r.results));
  }

  search(query: string, page = 1): Observable<MovieListResponse> {
    return this.http.get<MovieListResponse>(`${this.baseUrl}/search/movie`, {
      params: { query, page }
    });
  }

  getMovie(id: number): Observable<MovieDetail> {
    return this.http.get<MovieDetail>(`${this.baseUrl}/movie/${id}`);
  }

  getCredits(id: number): Observable<Credits> {
    return this.http.get<Credits>(`${this.baseUrl}/movie/${id}/credits`);
  }

  getSimilar(id: number): Observable<Movie[]> {
    return this.http
      .get<MovieListResponse>(`${this.baseUrl}/movie/${id}/similar`)
      .pipe(map(r => r.results));
  }

  getGenres(): Observable<Genre[]> {
    return this.http
      .get<GenreListResponse>(`${this.baseUrl}/genre/movie/list`)
      .pipe(map(r => r.genres));
  }

  posterUrl(path: string | null, size = 'w500'): string {
    return path ? `${this.imageBase}${size}${path}` : '/assets/no-poster.svg';
  }

  backdropUrl(path: string | null, size = 'w1280'): string {
    return path ? `${this.imageBase}${size}${path}` : '/assets/no-poster.svg';
  }
}
```

- [ ] **Step 4: Ejecutar y verificar que pasa**

```bash
npx ng test --include="**/tmdb.service.spec.ts" --watch=false
```

Esperado: 7 specs, 0 failures

- [ ] **Step 5: Commit**

```bash
git add src/app/core/services/tmdb.service.ts src/app/core/services/tmdb.service.spec.ts
git commit -m "feat: add TmdbService with all TMDb endpoints"
```

---

## Task 6: FavoritesService (TDD)

**Files:**
- Create: `src/app/core/services/favorites.service.ts`
- Create: `src/app/core/services/favorites.service.spec.ts`

- [ ] **Step 1: Escribir los tests**

`src/app/core/services/favorites.service.spec.ts`:
```typescript
import { TestBed } from '@angular/core/testing';
import { FavoritesService } from './favorites.service';
import { Movie } from '../models/movie.model';

const mockMovie: Movie = {
  id: 1,
  title: 'Inception',
  overview: '',
  poster_path: null,
  backdrop_path: null,
  vote_average: 8.8,
  vote_count: 100,
  release_date: '2010-07-16',
  genre_ids: [28]
};

describe('FavoritesService', () => {
  let service: FavoritesService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(FavoritesService);
  });

  it('should start with empty favorites', () => {
    expect(service.favorites().length).toBe(0);
  });

  it('should add a movie to favorites', () => {
    service.add(mockMovie);
    expect(service.favorites().length).toBe(1);
    expect(service.isFavorite(1)).toBeTrue();
  });

  it('should not add duplicates', () => {
    service.add(mockMovie);
    service.add(mockMovie);
    expect(service.favorites().length).toBe(1);
  });

  it('should remove a movie from favorites', () => {
    service.add(mockMovie);
    service.remove(1);
    expect(service.isFavorite(1)).toBeFalse();
  });

  it('should toggle: add if not favorite, remove if favorite', () => {
    service.toggle(mockMovie);
    expect(service.isFavorite(1)).toBeTrue();
    service.toggle(mockMovie);
    expect(service.isFavorite(1)).toBeFalse();
  });

  it('should persist favorites to localStorage', () => {
    service.add(mockMovie);
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});
    const newService = TestBed.inject(FavoritesService);
    expect(newService.isFavorite(1)).toBeTrue();
  });
});
```

- [ ] **Step 2: Ejecutar y verificar que falla**

```bash
npx ng test --include="**/favorites.service.spec.ts" --watch=false
```

Esperado: FAILED — `Cannot find module './favorites.service'`

- [ ] **Step 3: Implementar el servicio**

`src/app/core/services/favorites.service.ts`:
```typescript
import { effect, Injectable, signal } from '@angular/core';
import { Movie } from '../models/movie.model';

@Injectable({ providedIn: 'root' })
export class FavoritesService {
  private readonly STORAGE_KEY = 'movie-explorer-favorites';
  private readonly _favorites = signal<Movie[]>(this.loadFromStorage());

  readonly favorites = this._favorites.asReadonly();

  constructor() {
    effect(() => {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this._favorites()));
    });
  }

  isFavorite(id: number): boolean {
    return this._favorites().some(m => m.id === id);
  }

  add(movie: Movie): void {
    if (!this.isFavorite(movie.id)) {
      this._favorites.update(favs => [...favs, movie]);
    }
  }

  remove(id: number): void {
    this._favorites.update(favs => favs.filter(m => m.id !== id));
  }

  toggle(movie: Movie): void {
    this.isFavorite(movie.id) ? this.remove(movie.id) : this.add(movie);
  }

  private loadFromStorage(): Movie[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }
}
```

- [ ] **Step 4: Ejecutar y verificar que pasa**

```bash
npx ng test --include="**/favorites.service.spec.ts" --watch=false
```

Esperado: 6 specs, 0 failures

- [ ] **Step 5: Commit**

```bash
git add src/app/core/services/favorites.service.ts src/app/core/services/favorites.service.spec.ts
git commit -m "feat: add FavoritesService with signal-based state and localStorage persistence"
```

---

## Task 7: RatingBadge component

**Files:**
- Create: `src/app/shared/components/rating-badge/rating-badge.component.ts`
- Create: `src/app/shared/components/rating-badge/rating-badge.component.html`
- Create: `src/app/shared/components/rating-badge/rating-badge.component.scss`

- [ ] **Step 1: Crear el componente**

```bash
mkdir -p src/app/shared/components/rating-badge
```

`src/app/shared/components/rating-badge/rating-badge.component.ts`:
```typescript
import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-rating-badge',
  standalone: true,
  imports: [],
  templateUrl: './rating-badge.component.html',
  styleUrl: './rating-badge.component.scss'
})
export class RatingBadgeComponent {
  readonly rating = input.required<number>();

  readonly percentage = computed(() => Math.round(this.rating() * 10));

  readonly color = computed(() => {
    const p = this.percentage();
    if (p >= 70) return '#90cea1';
    if (p >= 50) return '#d2d531';
    return '#db2360';
  });

  readonly dashArray = computed(() => {
    const circumference = 2 * Math.PI * 18;
    const offset = circumference - (this.percentage() / 100) * circumference;
    return `${circumference - offset} ${offset}`;
  });
}
```

`src/app/shared/components/rating-badge/rating-badge.component.html`:
```html
<div class="badge">
  <svg viewBox="0 0 44 44" width="44" height="44">
    <circle cx="22" cy="22" r="18" fill="#081c27" stroke="#204529" stroke-width="3"/>
    <circle
      cx="22" cy="22" r="18"
      fill="none"
      [attr.stroke]="color()"
      stroke-width="3"
      stroke-linecap="round"
      stroke-dasharray="0 113"
      [attr.stroke-dasharray]="dashArray()"
      transform="rotate(-90 22 22)"
    />
  </svg>
  <span class="label">{{ percentage() }}<sup>%</sup></span>
</div>
```

`src/app/shared/components/rating-badge/rating-badge.component.scss`:
```scss
.badge {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;

  svg {
    position: absolute;
    inset: 0;
  }

  .label {
    position: relative;
    font-size: 11px;
    font-weight: 700;
    color: var(--color-text);
    line-height: 1;

    sup {
      font-size: 7px;
    }
  }
}
```

- [ ] **Step 2: Verificar que compila**

```bash
npx ng build --configuration=development 2>&1 | tail -5
```

Esperado: sin errores de compilación.

- [ ] **Step 3: Commit**

```bash
git add src/app/shared/components/rating-badge
git commit -m "feat: add RatingBadge standalone component"
```

---

## Task 8: MovieCard component (TDD)

**Files:**
- Create: `src/app/shared/components/movie-card/movie-card.component.ts`
- Create: `src/app/shared/components/movie-card/movie-card.component.html`
- Create: `src/app/shared/components/movie-card/movie-card.component.scss`
- Create: `src/app/shared/components/movie-card/movie-card.component.spec.ts`

- [ ] **Step 1: Escribir el test**

```bash
mkdir -p src/app/shared/components/movie-card
```

`src/app/shared/components/movie-card/movie-card.component.spec.ts`:
```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MovieCardComponent } from './movie-card.component';
import { Movie } from '../../../core/models/movie.model';
import { provideRouter } from '@angular/router';

const mockMovie: Movie = {
  id: 42,
  title: 'Inception',
  overview: 'A thief...',
  poster_path: null,
  backdrop_path: null,
  vote_average: 8.8,
  vote_count: 100,
  release_date: '2010-07-16',
  genre_ids: [28]
};

describe('MovieCardComponent', () => {
  let component: MovieCardComponent;
  let fixture: ComponentFixture<MovieCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovieCardComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(MovieCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('movie', mockMovie);
    fixture.componentRef.setInput('isFavorite', false);
    fixture.detectChanges();
  });

  it('should display the movie title', () => {
    const el = fixture.nativeElement.querySelector('[data-testid="movie-title"]');
    expect(el.textContent).toContain('Inception');
  });

  it('should emit favoriteToggled with the movie when button is clicked', () => {
    let emitted: Movie | undefined;
    component.favoriteToggled.subscribe((m: Movie) => (emitted = m));
    const btn = fixture.nativeElement.querySelector('[data-testid="favorite-btn"]');
    btn.click();
    expect(emitted).toEqual(mockMovie);
  });
});
```

- [ ] **Step 2: Ejecutar y verificar que falla**

```bash
npx ng test --include="**/movie-card.component.spec.ts" --watch=false
```

Esperado: FAILED — `Cannot find module './movie-card.component'`

- [ ] **Step 3: Implementar el componente**

`src/app/shared/components/movie-card/movie-card.component.ts`:
```typescript
import { Component, inject, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SlicePipe } from '@angular/common';
import { Movie } from '../../../core/models/movie.model';
import { TmdbService } from '../../../core/services/tmdb.service';
import { RatingBadgeComponent } from '../rating-badge/rating-badge.component';

@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [RouterLink, SlicePipe, RatingBadgeComponent],
  templateUrl: './movie-card.component.html',
  styleUrl: './movie-card.component.scss'
})
export class MovieCardComponent {
  readonly movie = input.required<Movie>();
  readonly isFavorite = input<boolean>(false);
  readonly favoriteToggled = output<Movie>();

  readonly tmdb = inject(TmdbService);

  onFavoriteClick(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.favoriteToggled.emit(this.movie());
  }
}
```

`src/app/shared/components/movie-card/movie-card.component.html`:
```html
<a class="card" [routerLink]="['/movie', movie().id]">
  <div class="poster-wrapper">
    <img
      [src]="tmdb.posterUrl(movie().poster_path)"
      [alt]="movie().title"
      loading="lazy"
    />
    <div class="rating">
      <app-rating-badge [rating]="movie().vote_average" />
    </div>
    <button
      class="fav-btn"
      [class.active]="isFavorite()"
      data-testid="favorite-btn"
      (click)="onFavoriteClick($event)"
      [attr.aria-label]="isFavorite() ? 'Quitar de favoritos' : 'Añadir a favoritos'"
    >
      {{ isFavorite() ? '❤️' : '🤍' }}
    </button>
  </div>
  <div class="info">
    <p class="title" data-testid="movie-title">{{ movie().title }}</p>
    <p class="year">{{ movie().release_date | slice:0:4 }}</p>
  </div>
</a>
```

`src/app/shared/components/movie-card/movie-card.component.scss`:
```scss
.card {
  display: flex;
  flex-direction: column;
  border-radius: var(--radius-md);
  overflow: hidden;
  background: var(--color-card);
  box-shadow: var(--shadow-card);
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.03);
  }
}

.poster-wrapper {
  position: relative;
  aspect-ratio: 2 / 3;
  background: var(--color-surface);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.rating {
  position: absolute;
  bottom: -16px;
  left: 8px;
  background: var(--color-bg);
  border-radius: 50%;
  padding: 2px;
}

.fav-btn {
  position: absolute;
  top: 6px;
  right: 6px;
  font-size: 18px;
  line-height: 1;
  padding: 4px;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 50%;
  transition: transform 0.15s ease;

  &:hover {
    transform: scale(1.2);
  }
}

.info {
  padding: 20px 8px 8px;
}

.title {
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.year {
  font-size: 11px;
  color: var(--color-text-muted);
  margin-top: 2px;
}
```

- [ ] **Step 4: Ejecutar y verificar que pasa**

```bash
npx ng test --include="**/movie-card.component.spec.ts" --watch=false
```

Esperado: 2 specs, 0 failures

- [ ] **Step 5: Commit**

```bash
git add src/app/shared/components/movie-card
git commit -m "feat: add MovieCard standalone component with TDD"
```

---

## Task 9: MovieGrid y Navbar

**Files:**
- Create: `src/app/shared/components/movie-grid/movie-grid.component.ts/.html/.scss`
- Create: `src/app/shared/components/navbar/navbar.component.ts/.html/.scss`

- [ ] **Step 1: MovieGrid component**

```bash
mkdir -p src/app/shared/components/movie-grid src/app/shared/components/navbar
```

`src/app/shared/components/movie-grid/movie-grid.component.ts`:
```typescript
import { Component, inject, input } from '@angular/core';
import { Movie } from '../../../core/models/movie.model';
import { MovieCardComponent } from '../movie-card/movie-card.component';
import { FavoritesService } from '../../../core/services/favorites.service';

@Component({
  selector: 'app-movie-grid',
  standalone: true,
  imports: [MovieCardComponent],
  templateUrl: './movie-grid.component.html',
  styleUrl: './movie-grid.component.scss'
})
export class MovieGridComponent {
  readonly movies = input<Movie[]>([]);

  readonly favorites = inject(FavoritesService);

  onFavoriteToggled(movie: Movie): void {
    this.favorites.toggle(movie);
  }
}
```

`src/app/shared/components/movie-grid/movie-grid.component.html`:
```html
<div class="grid">
  @for (movie of movies(); track movie.id) {
    <app-movie-card
      [movie]="movie"
      [isFavorite]="favorites.isFavorite(movie.id)"
      (favoriteToggled)="onFavoriteToggled($event)"
    />
  } @empty {
    <p class="empty">No hay películas para mostrar.</p>
  }
</div>
```

`src/app/shared/components/movie-grid/movie-grid.component.scss`:
```scss
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 16px;
  padding: 16px 0;
}

.empty {
  grid-column: 1 / -1;
  text-align: center;
  color: var(--color-text-muted);
  padding: 48px 0;
}
```

- [ ] **Step 2: Navbar component**

`src/app/shared/components/navbar/navbar.component.ts`:
```typescript
import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FavoritesService } from '../../../core/services/favorites.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  private readonly favorites = inject(FavoritesService);

  readonly favCount = computed(() => this.favorites.favorites().length);
}
```

`src/app/shared/components/navbar/navbar.component.html`:
```html
<nav class="navbar">
  <a class="brand" routerLink="/">🎬 MovieExplorer</a>
  <ul class="links">
    <li><a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}">Inicio</a></li>
    <li><a routerLink="/search" routerLinkActive="active">Buscar</a></li>
    <li>
      <a routerLink="/favorites" routerLinkActive="active" class="fav-link">
        Favoritos
        @if (favCount() > 0) {
          <span class="badge">{{ favCount() }}</span>
        }
      </a>
    </li>
  </ul>
</nav>
```

`src/app/shared/components/navbar/navbar.component.scss`:
```scss
.navbar {
  display: flex;
  align-items: center;
  padding: 0 24px;
  height: 60px;
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  position: sticky;
  top: 0;
  z-index: 100;
}

.brand {
  font-size: 18px;
  font-weight: 700;
  color: var(--color-accent);
  margin-right: auto;
}

.links {
  display: flex;
  gap: 24px;
  list-style: none;

  a {
    color: var(--color-text-muted);
    font-size: 14px;
    font-weight: 500;
    transition: color 0.15s;
    display: flex;
    align-items: center;
    gap: 6px;

    &:hover, &.active {
      color: var(--color-text);
    }
  }
}

.badge {
  background: var(--color-accent);
  color: var(--color-bg);
  font-size: 11px;
  font-weight: 700;
  border-radius: 10px;
  padding: 1px 6px;
  min-width: 18px;
  text-align: center;
}

.fav-link {
  position: relative;
}
```

- [ ] **Step 3: Verificar que compila**

```bash
npx ng build --configuration=development 2>&1 | tail -5
```

Esperado: sin errores.

- [ ] **Step 4: Commit**

```bash
git add src/app/shared/components/movie-grid src/app/shared/components/navbar
git commit -m "feat: add MovieGrid and Navbar shared components"
```

---

## Task 10: App config, rutas y AppComponent

**Files:**
- Modify: `src/app/app.config.ts`
- Create: `src/app/app.routes.ts`
- Modify: `src/app/app.component.ts`
- Modify: `src/app/app.component.html`
- Modify: `src/app/app.component.scss`

- [ ] **Step 1: Definir las rutas**

`src/app/app.routes.ts`:
```typescript
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'search',
    loadComponent: () =>
      import('./features/search/search.component').then(m => m.SearchComponent)
  },
  {
    path: 'movie/:id',
    loadComponent: () =>
      import('./features/detail/detail.component').then(m => m.DetailComponent)
  },
  {
    path: 'favorites',
    loadComponent: () =>
      import('./features/favorites/favorites.component').then(m => m.FavoritesComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
```

- [ ] **Step 2: Configurar la app**

`src/app/app.config.ts`:
```typescript
import { ApplicationConfig } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { tmdbAuthInterceptor } from './core/interceptors/tmdb-auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withInterceptors([tmdbAuthInterceptor]))
  ]
};
```

- [ ] **Step 3: AppComponent**

`src/app/app.component.ts`:
```typescript
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {}
```

`src/app/app.component.html`:
```html
<app-navbar />
<main class="main-content">
  <router-outlet />
</main>
```

`src/app/app.component.scss`:
```scss
.main-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px 48px;
}
```

- [ ] **Step 4: Verificar que compila**

```bash
npx ng build --configuration=development 2>&1 | tail -5
```

Esperado: sin errores.

- [ ] **Step 5: Commit**

```bash
git add src/app/app.config.ts src/app/app.routes.ts src/app/app.component.ts src/app/app.component.html src/app/app.component.scss
git commit -m "feat: configure app routing and AppComponent shell"
```

---

## Task 11: Home feature

**Files:**
- Create: `src/app/features/home/home.component.ts`
- Create: `src/app/features/home/home.component.html`
- Create: `src/app/features/home/home.component.scss`

- [ ] **Step 1: Crear el componente**

```bash
mkdir -p src/app/features/home
```

`src/app/features/home/home.component.ts`:
```typescript
import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { SlicePipe } from '@angular/common';
import { TmdbService } from '../../core/services/tmdb.service';
import { FavoritesService } from '../../core/services/favorites.service';
import { MovieGridComponent } from '../../shared/components/movie-grid/movie-grid.component';
import { RatingBadgeComponent } from '../../shared/components/rating-badge/rating-badge.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, SlicePipe, MovieGridComponent, RatingBadgeComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  private readonly tmdb = inject(TmdbService);
  private readonly favorites = inject(FavoritesService);

  readonly trending = toSignal(this.tmdb.getTrending());
  readonly popular = toSignal(this.tmdb.getPopular());
  readonly topRated = toSignal(this.tmdb.getTopRated());

  readonly hero = computed(() => this.trending()?.[0] ?? null);
  readonly heroIsFavorite = computed(() =>
    this.hero() ? this.favorites.isFavorite(this.hero()!.id) : false
  );

  onHeroFavoriteClick(): void {
    const movie = this.hero();
    if (movie) this.favorites.toggle(movie);
  }

  backdropUrl(path: string | null): string {
    return this.tmdb.backdropUrl(path);
  }
}
```

`src/app/features/home/home.component.html`:
```html
<!-- Hero Banner -->
@if (hero(); as movie) {
  <section class="hero" [style.background-image]="'url(' + backdropUrl(movie.backdrop_path) + ')'">
    <div class="hero-overlay">
      <div class="hero-content">
        <h1>{{ movie.title }}</h1>
        <div class="hero-meta">
          <app-rating-badge [rating]="movie.vote_average" />
          <span class="year">{{ movie.release_date | slice:0:4 }}</span>
        </div>
        <p class="overview">{{ movie.overview | slice:0:200 }}...</p>
        <div class="hero-actions">
          <a class="btn-primary" [routerLink]="['/movie', movie.id]">Ver detalle</a>
          <button class="btn-outline" (click)="onHeroFavoriteClick()">
            {{ heroIsFavorite() ? '❤️ En favoritos' : '🤍 Añadir' }}
          </button>
        </div>
      </div>
    </div>
  </section>
} @else {
  <div class="hero hero--loading"></div>
}

<!-- Carouseles -->
<section class="section">
  <h2 class="section-title">Populares</h2>
  @if (popular(); as movies) {
    <app-movie-grid [movies]="movies.slice(0, 10)" />
  } @else {
    <div class="loading-row"></div>
  }
</section>

<section class="section">
  <h2 class="section-title">Mejor valoradas</h2>
  @if (topRated(); as movies) {
    <app-movie-grid [movies]="movies.slice(0, 10)" />
  } @else {
    <div class="loading-row"></div>
  }
</section>
```

`src/app/features/home/home.component.scss`:
```scss
.hero {
  position: relative;
  min-height: 500px;
  background-size: cover;
  background-position: center top;
  margin: 0 -24px;

  &--loading {
    background: var(--color-card);
    animation: pulse 1.5s ease-in-out infinite;
  }
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to right, rgba(15, 25, 35, 0.95) 40%, transparent);
  display: flex;
  align-items: flex-end;
  padding: 40px 40px;
}

.hero-content {
  max-width: 500px;

  h1 {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 12px;
  }
}

.hero-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;

  .year {
    color: var(--color-text-muted);
    font-size: 14px;
  }
}

.overview {
  color: var(--color-text-muted);
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 20px;
}

.hero-actions {
  display: flex;
  gap: 12px;
}

.btn-primary {
  background: var(--color-accent);
  color: var(--color-bg);
  padding: 10px 20px;
  border-radius: var(--radius-md);
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: opacity 0.15s;

  &:hover { opacity: 0.85; }
}

.btn-outline {
  border: 1px solid var(--color-accent);
  color: var(--color-accent);
  padding: 10px 20px;
  border-radius: var(--radius-md);
  font-weight: 600;
  font-size: 14px;
  background: transparent;
  cursor: pointer;
  transition: background 0.15s;

  &:hover { background: rgba(1, 180, 228, 0.1); }
}

.section {
  margin-top: 40px;
}

.section-title {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 4px;
  color: var(--color-text);

  &::after {
    content: '';
    display: block;
    width: 40px;
    height: 3px;
    background: var(--color-accent);
    margin-top: 6px;
    border-radius: 2px;
  }
}

.loading-row {
  height: 220px;
  background: var(--color-card);
  border-radius: var(--radius-md);
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
```

- [ ] **Step 2: Verificar en el navegador**

```bash
npm start
```

Abrir `http://localhost:4200`. Debe mostrar hero + carruseles con películas de TMDb.

- [ ] **Step 3: Commit**

```bash
git add src/app/features/home
git commit -m "feat: implement Home feature with hero banner and movie carousels"
```

---

## Task 12: Search feature

**Files:**
- Create: `src/app/features/search/search.component.ts`
- Create: `src/app/features/search/search.component.html`
- Create: `src/app/features/search/search.component.scss`

- [ ] **Step 1: Crear el componente**

```bash
mkdir -p src/app/features/search
```

`src/app/features/search/search.component.ts`:
```typescript
import { Component, computed, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import {
  debounceTime,
  distinctUntilChanged,
  of,
  switchMap
} from 'rxjs';
import { TmdbService } from '../../core/services/tmdb.service';
import { Genre, Movie } from '../../core/models/movie.model';
import { MovieGridComponent } from '../../shared/components/movie-grid/movie-grid.component';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [FormsModule, MovieGridComponent],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent {
  private readonly tmdb = inject(TmdbService);

  readonly query = signal('');
  readonly selectedGenre = signal<number | null>(null);

  readonly genres = toSignal(this.tmdb.getGenres(), { initialValue: [] as Genre[] });

  readonly searchResponse = toSignal(
    toObservable(this.query).pipe(
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(q =>
        q.trim().length > 1 ? this.tmdb.search(q) : of(null)
      )
    )
  );

  readonly allResults = computed(() => this.searchResponse()?.results ?? []);

  readonly filteredResults = computed(() => {
    const genre = this.selectedGenre();
    const movies = this.allResults();
    return genre ? movies.filter(m => m.genre_ids.includes(genre)) : movies;
  });

  readonly isLoading = computed(() =>
    this.query().trim().length > 1 && this.searchResponse() === undefined
  );

  readonly hasQuery = computed(() => this.query().trim().length > 1);

  toggleGenre(id: number): void {
    this.selectedGenre.update(current => (current === id ? null : id));
  }
}
```

`src/app/features/search/search.component.html`:
```html
<div class="search-page">
  <h1 class="page-title">Buscar películas</h1>

  <div class="search-bar">
    <input
      type="search"
      placeholder="Título de la película..."
      [ngModel]="query()"
      (ngModelChange)="query.set($event)"
      class="search-input"
      autofocus
    />
  </div>

  <!-- Genre chips -->
  @if (genres().length > 0) {
    <div class="genres">
      @for (genre of genres(); track genre.id) {
        <button
          class="chip"
          [class.active]="selectedGenre() === genre.id"
          (click)="toggleGenre(genre.id)"
        >
          {{ genre.name }}
        </button>
      }
    </div>
  }

  <!-- Results -->
  @if (isLoading()) {
    <p class="status">Buscando...</p>
  } @else if (!hasQuery()) {
    <p class="status">Escribe al menos 2 caracteres para buscar.</p>
  } @else if (filteredResults().length === 0) {
    <p class="status">No se encontraron resultados para "<strong>{{ query() }}</strong>".</p>
  } @else {
    <p class="results-count">{{ filteredResults().length }} resultado(s)</p>
    <app-movie-grid [movies]="filteredResults()" />
  }
</div>
```

`src/app/features/search/search.component.scss`:
```scss
.search-page {
  padding-top: 32px;
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 20px;
}

.search-bar {
  margin-bottom: 16px;
}

.search-input {
  width: 100%;
  max-width: 600px;
  padding: 12px 16px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text);
  font-size: 16px;
  outline: none;
  transition: border-color 0.15s;

  &:focus {
    border-color: var(--color-accent);
  }

  &::placeholder {
    color: var(--color-text-muted);
  }
}

.genres {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 20px;
}

.chip {
  padding: 4px 12px;
  border-radius: 20px;
  border: 1px solid var(--color-border);
  background: transparent;
  color: var(--color-text-muted);
  font-size: 13px;
  cursor: pointer;
  transition: all 0.15s;

  &:hover {
    border-color: var(--color-accent);
    color: var(--color-accent);
  }

  &.active {
    background: var(--color-accent);
    border-color: var(--color-accent);
    color: var(--color-bg);
    font-weight: 600;
  }
}

.status {
  color: var(--color-text-muted);
  padding: 48px 0;
  text-align: center;
}

.results-count {
  font-size: 13px;
  color: var(--color-text-muted);
  margin-bottom: 4px;
}
```

- [ ] **Step 2: Verificar en el navegador**

Navegar a `http://localhost:4200/search`. Escribir "Inception" — deben aparecer resultados tras 400ms.

- [ ] **Step 3: Commit**

```bash
git add src/app/features/search
git commit -m "feat: implement Search feature with debounce and genre filter"
```

---

## Task 13: Detail feature

**Files:**
- Create: `src/app/features/detail/detail.component.ts`
- Create: `src/app/features/detail/detail.component.html`
- Create: `src/app/features/detail/detail.component.scss`

- [ ] **Step 1: Crear el componente**

```bash
mkdir -p src/app/features/detail
```

`src/app/features/detail/detail.component.ts`:
```typescript
import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { SlicePipe } from '@angular/common';
import { map, switchMap } from 'rxjs';
import { TmdbService } from '../../core/services/tmdb.service';
import { FavoritesService } from '../../core/services/favorites.service';
import { MovieGridComponent } from '../../shared/components/movie-grid/movie-grid.component';
import { RatingBadgeComponent } from '../../shared/components/rating-badge/rating-badge.component';

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [SlicePipe, MovieGridComponent, RatingBadgeComponent],
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.scss'
})
export class DetailComponent {
  private readonly tmdb = inject(TmdbService);
  private readonly favorites = inject(FavoritesService);
  private readonly route = inject(ActivatedRoute);

  private readonly id$ = this.route.paramMap.pipe(map(p => +p.get('id')!));

  readonly movie = toSignal(this.id$.pipe(switchMap(id => this.tmdb.getMovie(id))));
  readonly credits = toSignal(this.id$.pipe(switchMap(id => this.tmdb.getCredits(id))));
  readonly similar = toSignal(this.id$.pipe(switchMap(id => this.tmdb.getSimilar(id))));

  readonly isFavorite = computed(() =>
    this.movie() ? this.favorites.isFavorite(this.movie()!.id) : false
  );

  readonly cast = computed(() => this.credits()?.cast.slice(0, 8) ?? []);

  onFavoriteClick(): void {
    const m = this.movie();
    if (m) this.favorites.toggle(m);
  }

  backdropUrl(path: string | null): string {
    return this.tmdb.backdropUrl(path);
  }

  posterUrl(path: string | null): string {
    return this.tmdb.posterUrl(path);
  }

  profileUrl(path: string | null): string {
    return this.tmdb.posterUrl(path, 'w185');
  }

  runtime(minutes: number): string {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return h > 0 ? `${h}h ${m}min` : `${m}min`;
  }
}
```

`src/app/features/detail/detail.component.html`:
```html
@if (movie(); as film) {
  <!-- Backdrop -->
  <div
    class="backdrop"
    [style.background-image]="'url(' + backdropUrl(film.backdrop_path) + ')'"
  ></div>

  <!-- Main content -->
  <div class="detail-content">
    <div class="poster-col">
      <img [src]="posterUrl(film.poster_path)" [alt]="film.title" class="poster" />
    </div>

    <div class="info-col">
      <h1 class="title">{{ film.title }}</h1>

      @if (film.tagline) {
        <p class="tagline">{{ film.tagline }}</p>
      }

      <div class="meta">
        <app-rating-badge [rating]="film.vote_average" />
        <span class="year">{{ film.release_date | slice:0:4 }}</span>
        @if (film.runtime) {
          <span class="year">{{ runtime(film.runtime) }}</span>
        }
      </div>

      <div class="genres">
        @for (genre of film.genres; track genre.id) {
          <span class="genre-tag">{{ genre.name }}</span>
        }
      </div>

      <p class="overview">{{ film.overview }}</p>

      <button class="fav-btn" (click)="onFavoriteClick()">
        {{ isFavorite() ? '❤️ En favoritos' : '🤍 Añadir a favoritos' }}
      </button>
    </div>
  </div>

  <!-- Cast -->
  @if (cast().length > 0) {
    <section class="section">
      <h2 class="section-title">Reparto principal</h2>
      <div class="cast-list">
        @for (actor of cast(); track actor.id) {
          <div class="cast-card">
            <img [src]="profileUrl(actor.profile_path)" [alt]="actor.name" />
            <p class="actor-name">{{ actor.name }}</p>
            <p class="character">{{ actor.character }}</p>
          </div>
        }
      </div>
    </section>
  }

  <!-- Similar -->
  @if (similar()?.length) {
    <section class="section">
      <h2 class="section-title">Películas similares</h2>
      <app-movie-grid [movies]="similar()!.slice(0, 8)" />
    </section>
  }
} @else {
  <div class="loading-state">Cargando...</div>
}
```

`src/app/features/detail/detail.component.scss`:
```scss
.backdrop {
  height: 400px;
  background-size: cover;
  background-position: center top;
  margin: 0 -24px;
  mask-image: linear-gradient(to bottom, black 60%, transparent);
  -webkit-mask-image: linear-gradient(to bottom, black 60%, transparent);
}

.detail-content {
  display: flex;
  gap: 32px;
  margin-top: -120px;
  position: relative;
  z-index: 1;
}

.poster-col {
  flex-shrink: 0;
}

.poster {
  width: 200px;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-card);

  @media (max-width: 600px) {
    width: 120px;
  }
}

.info-col {
  flex: 1;
  padding-top: 80px;
}

.title {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 8px;
}

.tagline {
  color: var(--color-text-muted);
  font-style: italic;
  margin-bottom: 12px;
}

.meta {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;

  .year {
    color: var(--color-text-muted);
    font-size: 14px;
  }
}

.genres {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}

.genre-tag {
  border: 1px solid var(--color-accent);
  color: var(--color-accent);
  font-size: 12px;
  padding: 2px 10px;
  border-radius: 20px;
}

.overview {
  color: var(--color-text-muted);
  font-size: 14px;
  line-height: 1.7;
  margin-bottom: 20px;
}

.fav-btn {
  border: 1px solid var(--color-accent);
  color: var(--color-accent);
  padding: 10px 20px;
  border-radius: var(--radius-md);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  background: transparent;
  transition: background 0.15s;

  &:hover { background: rgba(1, 180, 228, 0.1); }
}

.section {
  margin-top: 48px;
}

.section-title {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 16px;

  &::after {
    content: '';
    display: block;
    width: 40px;
    height: 3px;
    background: var(--color-accent);
    margin-top: 6px;
    border-radius: 2px;
  }
}

.cast-list {
  display: flex;
  gap: 16px;
  overflow-x: auto;
  padding-bottom: 8px;
}

.cast-card {
  flex-shrink: 0;
  width: 90px;
  text-align: center;

  img {
    width: 90px;
    height: 90px;
    border-radius: 50%;
    object-fit: cover;
    background: var(--color-card);
  }
}

.actor-name {
  font-size: 12px;
  font-weight: 600;
  margin-top: 6px;
}

.character {
  font-size: 11px;
  color: var(--color-text-muted);
  margin-top: 2px;
}

.loading-state {
  padding: 80px;
  text-align: center;
  color: var(--color-text-muted);
}
```

- [ ] **Step 2: Verificar en el navegador**

Hacer click en cualquier película desde Home o Search. Debe navegar a `/movie/:id` mostrando el detalle completo.

- [ ] **Step 3: Commit**

```bash
git add src/app/features/detail
git commit -m "feat: implement Detail feature with movie info, cast, and similar movies"
```

---

## Task 14: Favorites feature

**Files:**
- Create: `src/app/features/favorites/favorites.component.ts`
- Create: `src/app/features/favorites/favorites.component.html`
- Create: `src/app/features/favorites/favorites.component.scss`

- [ ] **Step 1: Crear el componente**

```bash
mkdir -p src/app/features/favorites
```

`src/app/features/favorites/favorites.component.ts`:
```typescript
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FavoritesService } from '../../core/services/favorites.service';
import { MovieCardComponent } from '../../shared/components/movie-card/movie-card.component';
import { Movie } from '../../core/models/movie.model';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [RouterLink, MovieCardComponent],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.scss'
})
export class FavoritesComponent {
  readonly favoritesService = inject(FavoritesService);

  readonly favorites = this.favoritesService.favorites;

  onFavoriteToggled(movie: Movie): void {
    this.favoritesService.remove(movie.id);
  }
}
```

`src/app/features/favorites/favorites.component.html`:
```html
<div class="favorites-page">
  <h1 class="page-title">
    Mis favoritos
    @if (favorites().length > 0) {
      <span class="count">{{ favorites().length }}</span>
    }
  </h1>

  @if (favorites().length === 0) {
    <div class="empty-state">
      <p class="empty-icon">🎬</p>
      <p class="empty-text">Todavía no tienes películas guardadas.</p>
      <a routerLink="/search" class="cta-btn">Explorar películas</a>
    </div>
  } @else {
    <div class="grid">
      @for (movie of favorites(); track movie.id) {
        <app-movie-card
          [movie]="movie"
          [isFavorite]="true"
          (favoriteToggled)="onFavoriteToggled($event)"
        />
      }
    </div>
  }
</div>
```

`src/app/features/favorites/favorites.component.scss`:
```scss
.favorites-page {
  padding-top: 32px;
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.count {
  background: var(--color-accent);
  color: var(--color-bg);
  font-size: 14px;
  font-weight: 700;
  border-radius: 20px;
  padding: 2px 10px;
}

.empty-state {
  text-align: center;
  padding: 80px 24px;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.empty-text {
  color: var(--color-text-muted);
  font-size: 16px;
  margin-bottom: 24px;
}

.cta-btn {
  display: inline-block;
  background: var(--color-accent);
  color: var(--color-bg);
  padding: 12px 24px;
  border-radius: var(--radius-md);
  font-weight: 600;
  transition: opacity 0.15s;

  &:hover { opacity: 0.85; }
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 16px;
}
```

- [ ] **Step 2: Verificar en el navegador**

1. Añadir varias películas como favorito desde Home o Search.
2. Navegar a `http://localhost:4200/favorites`.
3. Verificar que aparecen las películas guardadas.
4. Cerrar y reabrir el navegador — las películas deben seguir ahí (localStorage).
5. Hacer click en ❤️ de una tarjeta — debe desaparecer de la lista.

- [ ] **Step 3: Ejecutar todos los tests**

```bash
npx ng test --watch=false
```

Esperado: todos los specs pasan.

- [ ] **Step 4: Build de producción**

```bash
npx ng build
```

Esperado: compilación exitosa sin warnings críticos.

- [ ] **Step 5: Commit final**

```bash
git add src/app/features/favorites
git commit -m "feat: implement Favorites feature with localStorage persistence"
```

---

## Verificación final

- [ ] Home muestra hero + carruseles con datos reales de TMDb
- [ ] Search devuelve resultados con debounce de 400ms y filtra por género
- [ ] Detail muestra sinopsis, reparto y películas similares
- [ ] Favoritos persisten al recargar la página
- [ ] El badge de Navbar se actualiza en tiempo real al marcar/desmarcar favoritos
- [ ] `ng test --watch=false` pasa sin errores
- [ ] `ng build` compila sin errores
