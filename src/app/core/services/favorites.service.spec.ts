import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { FavoritesService } from './favorites.service';
import { Movie } from '../models/movie.model';

const mockMovie: Movie = {
  id: 1,
  title: 'Inception',
  overview: '',
  poster_path: null,
  backdrop_path: null,
  vote_average: 8.8,
  vote_count: 100,
  release_date: '2010-07-16',
  genre_ids: [28]
};

function createLocalStorageMock() {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
    get length() { return Object.keys(store).length; },
    key: (index: number) => Object.keys(store)[index] ?? null,
  };
}

describe('FavoritesService', () => {
  let service: FavoritesService;
  let localStorageMock: ReturnType<typeof createLocalStorageMock>;

  beforeEach(() => {
    localStorageMock = createLocalStorageMock();
    vi.stubGlobal('localStorage', localStorageMock);
    TestBed.configureTestingModule({});
    service = TestBed.inject(FavoritesService);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should start with empty favorites', () => {
    expect(service.favorites().length).toBe(0);
  });

  it('should add a movie to favorites', () => {
    service.add(mockMovie);
    expect(service.favorites().length).toBe(1);
    expect(service.isFavorite(1)).toBe(true);
  });

  it('should not add duplicates', () => {
    service.add(mockMovie);
    service.add(mockMovie);
    expect(service.favorites().length).toBe(1);
  });

  it('should remove a movie from favorites', () => {
    service.add(mockMovie);
    service.remove(1);
    expect(service.isFavorite(1)).toBe(false);
  });

  it('should toggle: add if not favorite, remove if favorite', () => {
    service.toggle(mockMovie);
    expect(service.isFavorite(1)).toBe(true);
    service.toggle(mockMovie);
    expect(service.isFavorite(1)).toBe(false);
  });

  it('should persist favorites to localStorage', () => {
    service.add(mockMovie);
    TestBed.flushEffects();
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});
    const newService = TestBed.inject(FavoritesService);
    expect(newService.isFavorite(1)).toBe(true);
  });
});
