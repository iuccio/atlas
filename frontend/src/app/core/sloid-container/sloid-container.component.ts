import { Component, input } from '@angular/core';
import { AtlasClipboardComponent } from '../form-components/atlas-clipboard/atlas-clipboard.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'atlas-sloid-container',
  imports: [AtlasClipboardComponent, TranslatePipe],
  templateUrl: './sloid-container.component.html',
  providers: [TranslatePipe],
})
export class SloidContainerComponent {
  sloid = input.required<string>();
  label = input<string>('SEPODI.SERVICE_POINTS.SLOID');
}
