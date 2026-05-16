import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Subject, switchMap, debounceTime, distinctUntilChanged, of } from 'rxjs';
import { BooksService, BookItem } from '../../core/services/books.service';
import { SeoService } from '../../core/services/seo.service';

@Component({
  selector: 'app-books',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './books.component.html',
  styleUrl: './books.component.scss'
})
export class BooksComponent {
  readonly booksService = inject(BooksService);

  readonly bestsellers = toSignal(this.booksService.getBestsellers());
  readonly newReleases = toSignal(this.booksService.getNewReleases());

  searchQuery = '';
  searching = signal(false);

  private readonly search$ = new Subject<string>();

  readonly searchResults = toSignal(
    this.search$.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(q => {
        this.searching.set(!!q.trim());
        return q.trim() ? this.booksService.search(q) : of(null);
      })
    )
  );

  constructor() {
    inject(SeoService).set('Libros', 'Los libros más vendidos y las últimas novedades editoriales con enlace directo para comprar en Amazon.');
  }

  onSearch(q: string): void { this.search$.next(q); }
  clearSearch(): void { this.searchQuery = ''; this.search$.next(''); this.searching.set(false); }

  amazonUrl(book: BookItem): string { return this.booksService.amazonUrl(book); }
  coverUrl(book: BookItem): string { return this.booksService.coverUrl(book); }
  infoUrl(book: BookItem): string { return this.booksService.infoUrl(book); }
}
