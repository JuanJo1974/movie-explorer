import { Component, inject } from '@angular/core';
import { SeoService } from '../../core/services/seo.service';

@Component({
  selector: 'app-privacy',
  standalone: true,
  templateUrl: './privacy.component.html',
  styleUrl: './privacy.component.scss'
})
export class PrivacyComponent {
  constructor() {
    inject(SeoService).set('Política de privacidad', 'Información sobre el uso de datos, cookies y servicios de terceros en CinesYPelis.');
  }
}
