import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-loading-spinner',
  templateUrl: './loading-spinner.component.html',
  styleUrls: ['./loading-spinner.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-in', style({ opacity: 1 })),
      ]),
      transition(':leave', [animate('300ms ease-out', style({ opacity: 0 }))]),
    ]),
  ],
  imports: [NgIf],
})
export class LoadingSpinnerComponent {
  @Input() isLoading = false;
}
