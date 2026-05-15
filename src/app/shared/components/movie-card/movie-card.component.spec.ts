import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MovieCardComponent } from './movie-card.component';
import { Movie } from '../../../core/models/movie.model';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

const mockMovie: Movie = {
  id: 42,
  title: 'Inception',
  overview: 'A thief...',
  poster_path: null,
  backdrop_path: null,
  vote_average: 8.8,
  vote_count: 100,
  release_date: '2010-07-16',
  genre_ids: [28]
};

describe('MovieCardComponent', () => {
  let component: MovieCardComponent;
  let fixture: ComponentFixture<MovieCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovieCardComponent],
      providers: [provideRouter([]), provideHttpClient()]
    }).compileComponents();

    fixture = TestBed.createComponent(MovieCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('movie', mockMovie);
    fixture.componentRef.setInput('isFavorite', false);
    fixture.detectChanges();
  });

  it('should display the movie title', () => {
    const el = fixture.nativeElement.querySelector('[data-testid="movie-title"]');
    expect(el.textContent).toContain('Inception');
  });

  it('should emit favoriteToggled with the movie when button is clicked', () => {
    let emitted: Movie | undefined;
    component.favoriteToggled.subscribe((m: Movie) => (emitted = m));
    const btn = fixture.nativeElement.querySelector('[data-testid="favorite-btn"]');
    btn.click();
    expect(emitted).toEqual(mockMovie);
  });
});
