import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';

export interface BookItem {
  key: string;
  title: string;
  author_name?: string[];
  cover_i?: number;
  first_publish_year?: number;
}

interface OpenLibraryResponse {
  docs: BookItem[];
}

@Injectable({ providedIn: 'root' })
export class BooksService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'https://openlibrary.org/search.json';

  private get lang(): string {
    return navigator.language.startsWith('es') ? 'es' : 'en';
  }

  private get dailyOffset(): number {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const dayOfYear = Math.floor((now.getTime() - start.getTime()) / 86_400_000);
    return (dayOfYear * 16) % 500;
  }

  private query(params: Record<string, string>, minYear?: number): Observable<BookItem[]> {
    const lang = this.lang === 'es' ? 'spa' : 'eng';
    return this.http
      .get<OpenLibraryResponse>(this.baseUrl, { params: { ...params, lang, limit: '50' } })
      .pipe(
        map(r => {
          const seen = new Set<string>();
          return r.docs.filter(b => {
            if (!b.cover_i) return false;
            if (minYear && (b.first_publish_year ?? 0) < minYear) return false;
            const t = b.title.toLowerCase().trim();
            if (seen.has(t)) return false;
            seen.add(t);
            return true;
          }).slice(0, 16);
        }),
        catchError(err => { console.error('Books API error:', err); return of([]); })
      );
  }

  search(query: string): Observable<BookItem[]> {
    if (!query.trim()) return of([]);
    return this.query({ q: query.trim() });
  }

  getBestsellers(): Observable<BookItem[]> {
    const q = this.lang === 'es' ? 'novela' : 'fiction';
    return this.query({ q, sort: 'rating', offset: String(this.dailyOffset) });
  }

  getNewReleases(): Observable<BookItem[]> {
    const q = this.lang === 'es' ? 'novela' : 'fiction';
    return this.query({ q, sort: 'new', offset: '0' }, 2024);
  }

  coverUrl(book: BookItem): string {
    return book.cover_i
      ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
      : '';
  }

  infoUrl(book: BookItem): string {
    return `https://openlibrary.org${book.key}`;
  }

  amazonUrl(book: BookItem): string {
    const query = encodeURIComponent(
      `${book.title} ${book.author_name?.[0] ?? ''}`.trim()
    );
    return `https://www.amazon.es/s?k=${query}&tag=cineypelis-21&i=stripbooks`;
  }
}
