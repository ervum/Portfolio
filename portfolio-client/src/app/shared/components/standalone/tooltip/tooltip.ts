import { Component, input, InputSignal, signal, effect, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContainerComponent } from '../container/container';
import { TypewriterDirective } from '../../../directives/typewriter/typewriter.directive';

/**
 * A generic, premium floating tooltip component.
 * Adapts to the global interface theme and displays an animated text message.
 * Supports configurable manga-style speechbubble arrow pointers on all sides.
 */
@Component({
  selector: 'FancyTooltip',
  standalone: true,
  imports: [
    CommonModule,
    ContainerComponent,
    TypewriterDirective
  ],
  templateUrl: './tooltip.html',
  styleUrl: './tooltip.scss',
  host: {
    '[class.FancyTooltip-Arrow--HasLeft]': 'ArrowLeft()',
    '[class.FancyTooltip-Arrow--HasRight]': 'ArrowRight()',
    '[class.FancyTooltip-Arrow--HasTop]': 'ArrowTop()',
    '[class.FancyTooltip-Arrow--HasBottom]': 'ArrowBottom()'
  }
})
export class TooltipComponent {
  /** The message text to display inside the tooltip. */
  public Message: InputSignal<string> = input<string>('');

  /** Whether the tooltip is currently visible. */
  public Active: InputSignal<boolean> = input<boolean>(false);

  /** Whether the tooltip uses the fixed top page-level layout. */
  public Fixed: InputSignal<boolean> = input<boolean>(true);

  /** Speechbubble arrow pointers for each side. */
  public ArrowTop: InputSignal<boolean> = input<boolean>(false);
  public ArrowBottom: InputSignal<boolean> = input<boolean>(false);
  public ArrowLeft: InputSignal<boolean> = input<boolean>(false);
  public ArrowRight: InputSignal<boolean> = input<boolean>(false);

  /** The message currently displayed, managed locally to delay clearing text until the fade transition finishes. */
  public DisplayedMessage: WritableSignal<string> = signal('');

  constructor() {
    effect(() => {
      const isActive = this.Active();
      const msg = this.Message();

      if (isActive && msg) {
        this.DisplayedMessage.set(msg);
      } else if (!isActive) {
        // Wait 600ms for the scale/fade out transition to complete before clearing the text
        setTimeout(() => {
          if (!this.Active()) {
            this.DisplayedMessage.set('');
          }
        }, 600);
      }
    });
  }
}
