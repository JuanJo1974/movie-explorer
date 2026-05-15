import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'search',
    loadComponent: () =>
      import('./features/search/search.component').then(m => m.SearchComponent)
  },
  {
    path: 'movie/:id',
    loadComponent: () =>
      import('./features/detail/detail.component').then(m => m.DetailComponent)
  },
  {
    path: 'favorites',
    loadComponent: () =>
      import('./features/favorites/favorites.component').then(m => m.FavoritesComponent)
  },
  {
    path: 'tecnologia',
    loadComponent: () =>
      import('./features/tech/tech-news.component').then(m => m.TechNewsComponent)
  },
  {
    path: 'blog',
    loadComponent: () =>
      import('./features/blog/blog-list.component').then(m => m.BlogListComponent)
  },
  {
    path: 'blog/:slug',
    loadComponent: () =>
      import('./features/blog/blog-detail.component').then(m => m.BlogDetailComponent)
  },
  {
    path: 'about',
    loadComponent: () =>
      import('./features/about/about.component').then(m => m.AboutComponent)
  },
  {
    path: 'contact',
    loadComponent: () =>
      import('./features/contact/contact.component').then(m => m.ContactComponent)
  },
  {
    path: 'privacy',
    loadComponent: () =>
      import('./features/privacy/privacy.component').then(m => m.PrivacyComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
