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
  private readonly apiKey = 'b9cff31dabba28d716b92e84fa3eef3c';
  private readonly baseUrl = 'https://gnews.io/api/v4';

  private get lang(): string {
    return navigator.language.startsWith('es') ? 'es' : 'en';
  }

  getTech(): Observable<NewsArticle[]> {
    return this.http
      .get<GNewsResponse>(`${this.baseUrl}/top-headlines`, {
        params: {
          topic: 'technology',
          lang: this.lang,
          max: '20',
          apikey: this.apiKey
        }
      })
      .pipe(
        map(r => r.articles),
        catchError(err => {
          console.error('GNews API error:', err);
          return of([]);
        })
      );
  }
}
