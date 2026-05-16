import { Component, inject } from '@angular/core';
import { SlicePipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { BooksService, BookVolume } from '../../core/services/books.service';
import { SeoService } from '../../core/services/seo.service';

@Component({
  selector: 'app-books',
  standalone: true,
  imports: [SlicePipe],
  templateUrl: './books.component.html',
  styleUrl: './books.component.scss'
})
export class BooksComponent {
  readonly booksService = inject(BooksService);

  readonly bestsellers = toSignal(this.booksService.getBestsellers());
  readonly newReleases = toSignal(this.booksService.getNewReleases());

  constructor() {
    inject(SeoService).set('Libros', 'Los libros más vendidos y las últimas novedades editoriales con enlace directo para comprar en Amazon.');
  }

  amazonUrl(book: BookVolume): string {
    return this.booksService.amazonUrl(book);
  }

  coverUrl(book: BookVolume): string {
    return this.booksService.coverUrl(book);
  }
}
