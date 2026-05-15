import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';

export interface NewsArticle {
  title: string;
  description: string;
  content: string;
  url: string;
  image: string | null;
  publishedAt: string;
  source: { name: string; url: string };
}

interface GNewsResponse {
  articles: NewsArticle[];
}

@Injectable({ providedIn: 'root' })
export class NewsService {
  private readonly http = inject(HttpClient);

  private get lang(): string {
    return navigator.language.startsWith('es') ? 'es' : 'en';
  }

  getTech(): Observable<NewsArticle[]> {
    return this.http
      .get<GNewsResponse>(`/.netlify/functions/tech-news`, {
        params: { lang: this.lang }
      })
      .pipe(
        map(r => r.articles),
        catchError(err => {
          console.error('Tech news error:', err);
          return of([]);
        })
      );
  }
}
