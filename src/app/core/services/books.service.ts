import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';

export interface BookVolume {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    publishedDate?: string;
    description?: string;
    imageLinks?: { thumbnail?: string; smallThumbnail?: string };
    infoLink?: string;
    categories?: string[];
  };
}

interface GoogleBooksResponse {
  items?: BookVolume[];
  totalItems: number;
}

@Injectable({ providedIn: 'root' })
export class BooksService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'https://www.googleapis.com/books/v1/volumes';

  private get lang(): string {
    return navigator.language.startsWith('es') ? 'es' : 'en';
  }

  private fetch(q: string, orderBy: string): Observable<BookVolume[]> {
    return this.http
      .get<GoogleBooksResponse>(this.baseUrl, {
        params: {
          q,
          orderBy,
          langRestrict: this.lang,
          maxResults: '16',
          printType: 'books'
        }
      })
      .pipe(
        map(r => r.items ?? []),
        catchError(() => of([]))
      );
  }

  getBestsellers(): Observable<BookVolume[]> {
    const q = this.lang === 'es' ? 'bestseller libros' : 'bestseller books';
    return this.fetch(q, 'relevance');
  }

  getNewReleases(): Observable<BookVolume[]> {
    const q = this.lang === 'es' ? 'novedades libros 2026' : 'new books 2026';
    return this.fetch(q, 'newest');
  }

  amazonUrl(book: BookVolume): string {
    const title = book.volumeInfo.title;
    const author = book.volumeInfo.authors?.[0] ?? '';
    const query = encodeURIComponent(`${title} ${author}`.trim());
    return `https://www.amazon.es/s?k=${query}&tag=cineypelis-21&i=stripbooks`;
  }

  coverUrl(book: BookVolume): string {
    const img = book.volumeInfo.imageLinks;
    return img?.thumbnail ?? img?.smallThumbnail ?? '';
  }
}
