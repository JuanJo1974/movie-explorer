import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { BooksService } from '../../core/services/books.service';
import { SeoService } from '../../core/services/seo.service';

@Component({
  selector: 'app-book-detail',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './book-detail.component.html',
  styleUrl: './book-detail.component.scss'
})
export class BookDetailComponent {
  private readonly booksService = inject(BooksService);
  private readonly route = inject(ActivatedRoute);

  readonly book = toSignal(
    this.route.paramMap.pipe(
      switchMap(p => this.booksService.getDetail(p.get('id') ?? ''))
    )
  );

  constructor() {
    inject(SeoService).set('Detalle de libro', 'Información detallada del libro con enlace para comprar en Amazon.');
  }

  coverUrl(coverId: number): string {
    return `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`;
  }

  amazonUrl(title: string, author?: string): string {
    const q = encodeURIComponent(`${title} ${author ?? ''}`.trim());
    return `https://www.amazon.es/s?k=${q}&tag=cineypelis-21&i=stripbooks`;
  }
}
