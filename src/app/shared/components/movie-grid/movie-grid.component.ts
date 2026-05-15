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
