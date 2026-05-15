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
