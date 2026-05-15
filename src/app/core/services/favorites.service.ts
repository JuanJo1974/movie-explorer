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
