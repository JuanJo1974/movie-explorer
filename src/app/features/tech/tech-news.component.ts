import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { DatePipe } from '@angular/common';
import { NewsService, NewsArticle } from '../../core/services/news.service';
import { SeoService } from '../../core/services/seo.service';

@Component({
  selector: 'app-tech-news',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './tech-news.component.html',
  styleUrl: './tech-news.component.scss'
})
export class TechNewsComponent {
  private readonly news = inject(NewsService);

  readonly articles = toSignal(this.news.getTech(), { initialValue: [] as NewsArticle[] });

  constructor() {
    inject(SeoService).set('Tecnología', 'Últimas noticias de tecnología e inteligencia artificial actualizadas al momento.');
  }
}
