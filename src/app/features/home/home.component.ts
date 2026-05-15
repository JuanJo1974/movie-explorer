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
