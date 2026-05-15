import { Component, computed, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, of, switchMap, tap } from 'rxjs';
import { TmdbService } from '../../core/services/tmdb.service';
import { Genre } from '../../core/models/movie.model';
import { MovieGridComponent } from '../../shared/components/movie-grid/movie-grid.component';

interface SearchParams {
  q: string;
  page: number;
}

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

  private readonly params = signal<SearchParams | null>(null);

  constructor() {
    toSignal(
      toObservable(this.query).pipe(
        debounceTime(400),
        distinctUntilChanged(),
        tap(q => this.params.set(q.trim().length > 1 ? { q, page: 1 } : null))
      )
    );
  }

  readonly searchResponse = toSignal(
    toObservable(this.params).pipe(
      switchMap(p => p ? this.tmdb.search(p.q, p.page) : of(null))
    )
  );

  readonly allResults = computed(() => this.searchResponse()?.results ?? []);
  readonly totalPages = computed(() => this.searchResponse()?.total_pages ?? 0);
  readonly totalResults = computed(() => this.searchResponse()?.total_results ?? 0);
  readonly currentPage = computed(() => this.params()?.page ?? 1);

  readonly filteredResults = computed(() => {
    const genre = this.selectedGenre();
    const movies = this.allResults();
    return genre ? movies.filter(m => m.genre_ids.includes(genre)) : movies;
  });

  readonly isLoading = computed(() =>
    this.query().trim().length > 1 && this.searchResponse() === undefined
  );

  readonly hasQuery = computed(() => this.query().trim().length > 1);

  readonly pages = computed(() => {
    const total = Math.min(this.totalPages(), 500);
    const current = this.currentPage();
    const delta = 2;
    const start = Math.max(1, current - delta);
    const end = Math.min(total, current + delta);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  });

  toggleGenre(id: number): void {
    this.selectedGenre.update(current => (current === id ? null : id));
  }

  goToPage(page: number): void {
    this.params.update(p => p ? { ...p, page } : null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
