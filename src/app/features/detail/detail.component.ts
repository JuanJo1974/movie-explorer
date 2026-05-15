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

  readonly isFavorite = computed(() => {
    const m = this.movie();
    return m ? this.favorites.isFavorite(m.id) : false;
  });

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
