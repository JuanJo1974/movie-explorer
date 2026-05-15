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
