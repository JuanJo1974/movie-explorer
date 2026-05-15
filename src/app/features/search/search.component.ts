import { Component, computed, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { combineLatest, debounceTime, distinctUntilChanged, of, switchMap } from 'rxjs';
import { TmdbService } from '../../core/services/tmdb.service';
import { SeoService } from '../../core/services/seo.service';
import { Genre } from '../../core/models/movie.model';
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
  private readonly seo = inject(SeoService);

  constructor() {
    this.seo.set('Buscar películas', 'Busca cualquier película por título o género en CinesYPelis.');
  }

  readonly query = signal('');
  readonly selectedGenre = signal<number | null>(null);
  readonly page = signal(1);

  readonly genres = toSignal(this.tmdb.getGenres(), { initialValue: [] as Genre[] });

  private readonly query$ = toObservable(this.query).pipe(debounceTime(400), distinctUntilChanged());
  private readonly genre$ = toObservable(this.selectedGenre);
  private readonly page$ = toObservable(this.page);

  readonly searchResponse = toSignal(
    combineLatest([this.query$, this.genre$, this.page$]).pipe(
      switchMap(([q, genre, page]) => {
        const hasQuery = q.trim().length > 1;
        if (hasQuery && genre) return this.tmdb.search(q, page);
        if (hasQuery) return this.tmdb.search(q, page);
        if (genre) return this.tmdb.discoverByGenre(genre, page);
        return of(null);
      })
    )
  );

  readonly allResults = computed(() => this.searchResponse()?.results ?? []);

  readonly filteredResults = computed(() => {
    const genre = this.selectedGenre();
    const hasQuery = this.query().trim().length > 1;
    const movies = this.allResults();
    // Solo filtra cliente si hay texto + género (discover ya filtra por género)
    return hasQuery && genre ? movies.filter(m => m.genre_ids.includes(genre)) : movies;
  });

  readonly totalPages = computed(() => Math.min(this.searchResponse()?.total_pages ?? 0, 500));
  readonly totalResults = computed(() => this.searchResponse()?.total_results ?? 0);

  readonly hasQuery = computed(() => this.query().trim().length > 1);
  readonly hasGenre = computed(() => this.selectedGenre() !== null);
  readonly isActive = computed(() => this.hasQuery() || this.hasGenre());

  readonly isLoading = computed(() => this.isActive() && this.searchResponse() === undefined);

  readonly selectedGenreName = computed(() =>
    this.genres().find(g => g.id === this.selectedGenre())?.name ?? ''
  );

  readonly pages = computed(() => {
    const total = this.totalPages();
    const current = this.page();
    const delta = 2;
    const start = Math.max(1, current - delta);
    const end = Math.min(total, current + delta);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  });

  toggleGenre(id: number): void {
    this.selectedGenre.update(current => (current === id ? null : id));
    this.page.set(1);
  }

  onQueryChange(q: string): void {
    this.query.set(q);
    this.page.set(1);
  }

  goToPage(page: number): void {
    this.page.set(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
