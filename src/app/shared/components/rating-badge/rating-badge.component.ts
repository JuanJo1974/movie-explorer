import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-rating-badge',
  standalone: true,
  imports: [],
  templateUrl: './rating-badge.component.html',
  styleUrl: './rating-badge.component.scss'
})
export class RatingBadgeComponent {
  readonly rating = input.required<number>();

  readonly percentage = computed(() => Math.round(this.rating() * 10));

  readonly color = computed(() => {
    const p = this.percentage();
    if (p >= 70) return 'var(--color-accent-alt)';
    if (p >= 50) return 'var(--color-rating-mid)';
    return 'var(--color-rating-bad)';
  });

  readonly dashArray = computed(() => {
    const circumference = 2 * Math.PI * 18;
    const offset = circumference - (this.percentage() / 100) * circumference;
    return `${circumference - offset} ${offset}`;
  });
}
