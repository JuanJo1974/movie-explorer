import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, forkJoin, map, Observable, of, switchMap } from 'rxjs';

export interface BookItem {
  key: string;
  title: string;
  author_name?: string[];
  cover_i?: number;
  first_publish_year?: number;
}

export interface BookDetail {
  title: string;
  description?: string;
  covers?: number[];
  subjects?: string[];
  first_publish_date?: string;
  authors?: string[];
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

  getDetail(workId: string): Observable<BookDetail> {
    return this.http.get<any>(`https://openlibrary.org/works/${workId}.json`).pipe(
      switchMap(work => {
        const authorKeys: string[] = (work.authors ?? []).map((a: any) => a.author?.key).filter(Boolean);
        const authorRequests = authorKeys.slice(0, 3).map((key: string) =>
          this.http.get<any>(`https://openlibrary.org${key}.json`).pipe(
            map(a => a.name as string),
            catchError(() => of(''))
          )
        );
        return (authorRequests.length ? forkJoin(authorRequests) : of([])).pipe(
          map(authors => ({
            title: work.title,
            description: typeof work.description === 'string'
              ? work.description
              : work.description?.value ?? '',
            covers: work.covers,
            subjects: (work.subjects ?? []).slice(0, 8),
            first_publish_date: work.first_publish_date,
            authors: (authors as string[]).filter(Boolean)
          } as BookDetail))
        );
      }),
      catchError(() => of({ title: 'Libro no encontrado' } as BookDetail))
    );
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
