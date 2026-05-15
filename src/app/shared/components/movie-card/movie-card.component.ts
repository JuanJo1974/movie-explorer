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
