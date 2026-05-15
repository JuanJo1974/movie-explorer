import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ARTICLES } from '../../core/data/articles';
import { SeoService } from '../../core/services/seo.service';

@Component({
  selector: 'app-blog-detail',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './blog-detail.component.html',
  styleUrl: './blog-detail.component.scss'
})
export class BlogDetailComponent {
  private readonly seo = inject(SeoService);
  private readonly slug = inject(ActivatedRoute).snapshot.paramMap.get('slug') ?? '';

  readonly article = computed(() => {
    const found = ARTICLES.find(a => a.slug === this.slug) ?? null;
    if (found) this.seo.set(found.title, found.excerpt);
    return found;
  });
}
