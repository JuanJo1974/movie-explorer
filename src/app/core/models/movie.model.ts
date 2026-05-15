export interface Genre {
  id: number;
  name: string;
}

export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  vote_count: number;
  release_date: string;
  genre_ids: number[];
}

export interface MovieDetail extends Movie {
  runtime: number;
  genres: Genre[];
  tagline: string;
}

export interface Cast {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export interface Credits {
  cast: Cast[];
}

export interface MovieListResponse {
  results: Movie[];
  page: number;
  total_pages: number;
  total_results: number;
}

export interface GenreListResponse {
  genres: Genre[];
}

export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
}

export interface VideoListResponse {
  results: Video[];
}

export interface WatchProvider {
  provider_id: number;
  provider_name: string;
  logo_path: string;
}

export interface WatchProvidersResult {
  link: string;
  flatrate?: WatchProvider[];
}

export interface WatchProvidersResponse {
  results: Record<string, WatchProvidersResult>;
}
