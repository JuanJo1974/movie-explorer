import { Component, computed, effect, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { SlicePipe } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { map, switchMap } from 'rxjs';
import { WatchProvider } from '../../core/models/movie.model';
import { TmdbService } from '../../core/services/tmdb.service';
import { FavoritesService } from '../../core/services/favorites.service';
import { SeoService } from '../../core/services/seo.service';
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
  private readonly seo = inject(SeoService);
  private readonly route = inject(ActivatedRoute);
  private readonly sanitizer = inject(DomSanitizer);

  private readonly country = navigator.language.split('-')[1] ?? 'ES';
  private readonly id$ = this.route.paramMap.pipe(map(p => +p.get('id')!));

  readonly movie = toSignal(this.id$.pipe(switchMap(id => this.tmdb.getMovie(id))));

  constructor() {
    effect(() => {
      const film = this.movie();
      if (film) this.seo.set(film.title, film.overview?.slice(0, 160) || film.title);
    });
  }
  readonly credits = toSignal(this.id$.pipe(switchMap(id => this.tmdb.getCredits(id))));
  readonly similar = toSignal(this.id$.pipe(switchMap(id => this.tmdb.getSimilar(id))));
  readonly videos = toSignal(this.id$.pipe(switchMap(id => this.tmdb.getVideos(id))));
  readonly providers = toSignal(this.id$.pipe(switchMap(id => this.tmdb.getWatchProviders(id, this.country))));

  readonly watchProviders = computed((): WatchProvider[] => this.providers()?.flatrate ?? []);
  readonly watchLink = computed((): string | null => this.providers()?.link ?? null);
  readonly amazonUrl = computed((): string | null => {
    const title = this.movie()?.title;
    if (!title) return null;
    return `https://www.amazon.es/s?k=${encodeURIComponent(title)}&tag=cineypelis-21`;
  });

  readonly trailerUrl = computed((): SafeResourceUrl | null => {
    const trailer = this.videos()?.find(
      v => v.site === 'YouTube' && v.type === 'Trailer'
    ) ?? this.videos()?.find(v => v.site === 'YouTube');
    if (!trailer) return null;
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.youtube.com/embed/${trailer.key}`
    );
  });

  readonly isFavorite = computed(() => {
    const m = this.movie();
    return m ? this.favorites.isFavorite(m.id) : false;
  });

  readonly cast = computed(() => this.credits()?.cast.slice(0, 8) ?? []);

  onFavoriteClick(): void {
    const m = this.movie();
    if (m) this.favorites.toggle(m);
  }

  logoUrl(path: string): string {
    return this.tmdb.logoUrl(path);
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
