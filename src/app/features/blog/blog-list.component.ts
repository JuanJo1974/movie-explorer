import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ARTICLES } from '../../core/data/articles';
import { SeoService } from '../../core/services/seo.service';

@Component({
  selector: 'app-blog-list',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './blog-list.component.html',
  styleUrl: './blog-list.component.scss'
})
export class BlogListComponent {
  readonly articles = ARTICLES.slice().sort((a, b) => b.date.localeCompare(a.date));

  constructor() {
    inject(SeoService).set('Blog', 'Artículos, reseñas y guías sobre cine y películas en CinesYPelis.');
  }
}
