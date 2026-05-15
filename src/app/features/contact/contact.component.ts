import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent {
  readonly email = 'juanjoseft@gmail.com';

  mailtoLink(name: string, message: string): string {
    const subject = encodeURIComponent('Contacto desde CinesYPelis');
    const body = encodeURIComponent(`Nombre: ${name}\n\n${message}`);
    return `mailto:${this.email}?subject=${subject}&body=${body}`;
  }

  name = '';
  message = '';

  send(): void {
    if (this.name.trim() && this.message.trim()) {
      window.location.href = this.mailtoLink(this.name, this.message);
    }
  }
}
