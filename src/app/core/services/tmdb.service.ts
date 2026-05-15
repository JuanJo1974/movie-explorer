import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import {
  Credits,
  Genre,
  GenreListResponse,
  Movie,
  MovieDetail,
  MovieListResponse
} from '../models/movie.model';

@Injectable({ providedIn: 'root' })
export class TmdbService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'https://api.themoviedb.org/3';
  private readonly imageBase = 'https://image.tmdb.org/t/p/';

  getTrending(): Observable<Movie[]> {
    return this.http
      .get<MovieListResponse>(`${this.baseUrl}/trending/movie/week`)
      .pipe(map(r => r.results));
  }

  getPopular(): Observable<Movie[]> {
    return this.http
      .get<MovieListResponse>(`${this.baseUrl}/movie/popular`)
      .pipe(map(r => r.results));
  }

  getTopRated(): Observable<Movie[]> {
    return this.http
      .get<MovieListResponse>(`${this.baseUrl}/movie/top_rated`)
      .pipe(map(r => r.results));
  }

  search(query: string, page = 1): Observable<MovieListResponse> {
    return this.http.get<MovieListResponse>(`${this.baseUrl}/search/movie`, {
      params: { query, page }
    });
  }

  getMovie(id: number): Observable<MovieDetail> {
    return this.http.get<MovieDetail>(`${this.baseUrl}/movie/${id}`);
  }

  getCredits(id: number): Observable<Credits> {
    return this.http.get<Credits>(`${this.baseUrl}/movie/${id}/credits`);
  }

  getSimilar(id: number): Observable<Movie[]> {
    return this.http
      .get<MovieListResponse>(`${this.baseUrl}/movie/${id}/similar`)
      .pipe(map(r => r.results));
  }

  getGenres(): Observable<Genre[]> {
    return this.http
      .get<GenreListResponse>(`${this.baseUrl}/genre/movie/list`)
      .pipe(map(r => r.genres));
  }

  posterUrl(path: string | null, size = 'w500'): string {
    return path ? `${this.imageBase}${size}${path}` : '/no-poster.svg';
  }

  backdropUrl(path: string | null, size = 'w1280'): string {
    return path ? `${this.imageBase}${size}${path}` : '/no-poster.svg';
  }
}
