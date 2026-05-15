import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { TmdbService } from './tmdb.service';

const BASE = 'https://api.themoviedb.org/3';

describe('TmdbService', () => {
  let service: TmdbService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TmdbService, provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(TmdbService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should fetch trending movies', () => {
    const mockMovies = [{ id: 1, title: 'Test Movie' }];
    service.getTrending().subscribe(movies => {
      expect(movies.length).toBe(1);
      expect(movies[0].title).toBe('Test Movie');
    });
    const req = httpMock.expectOne(`${BASE}/trending/movie/week`);
    expect(req.request.method).toBe('GET');
    req.flush({ results: mockMovies });
  });

  it('should fetch popular movies', () => {
    service.getPopular().subscribe();
    const req = httpMock.expectOne(`${BASE}/movie/popular`);
    expect(req.request.method).toBe('GET');
    req.flush({ results: [] });
  });

  it('should fetch top rated movies', () => {
    service.getTopRated().subscribe();
    const req = httpMock.expectOne(`${BASE}/movie/top_rated`);
    expect(req.request.method).toBe('GET');
    req.flush({ results: [] });
  });

  it('should search movies with query param', () => {
    service.search('inception').subscribe();
    const req = httpMock.expectOne(r => r.url === `${BASE}/search/movie`);
    expect(req.request.params.get('query')).toBe('inception');
    req.flush({ results: [], total_pages: 1 });
  });

  it('should fetch movie detail by id', () => {
    service.getMovie(123).subscribe();
    const req = httpMock.expectOne(`${BASE}/movie/123`);
    expect(req.request.method).toBe('GET');
    req.flush({ id: 123, title: 'Test' });
  });

  it('should return poster URL with w500 size', () => {
    expect(service.posterUrl('/test.jpg')).toBe('https://image.tmdb.org/t/p/w500/test.jpg');
  });

  it('should return placeholder for null poster path', () => {
    expect(service.posterUrl(null)).toBe('/no-poster.svg');
  });
});
