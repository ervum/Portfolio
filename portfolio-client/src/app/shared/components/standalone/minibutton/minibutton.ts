import { Component, input, inject, InputSignal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Undefinable } from '@ervum/types';

import { ContainerComponent } from '../container/container';
import { InterfaceService } from '../../../../core/services/interface/interface';



/**
 * A small, interactive button component that can display an icon or a text label.
 * It uses the FancyContainer for its background and adapts to the global interface theme.
 */
@Component({
  selector: 'FancyMinibutton',
  standalone: true,
  imports: [CommonModule, ContainerComponent],
  templateUrl: './minibutton.html',
  styleUrl: './minibutton.scss',
})
export class MinibuttonComponent {
  /** The global interface service for theme synchronization. */
  public InterfaceService: InterfaceService = inject(InterfaceService);

  /** Optional text label to display inside the button. */
  public Label: InputSignal<Undefinable<string>> = input<Undefinable<string>>(undefined);

  /** Optional icon path to display inside the button. */
  public Icon: InputSignal<Undefinable<string>> = input<Undefinable<string>>(undefined);

  /** Whether the icon should play entering/exiting animations. */
  public Animated: InputSignal<boolean> = input<boolean>(true);

  /** Current state of the icon animation. */
  public IconStatus: 'AtCenter' | 'Entering' | 'Exiting' | 'OffScreen' = 'AtCenter';

  /** Whether an entry animation is queued. */
  private EntryIsQueued: boolean = false;

  /** Whether an exit animation is queued. */
  private ExitIsQueued: boolean = false;

  public OnDown(): void {
    if (!this.Animated()) return;
    
    if (this.IconStatus === 'AtCenter') {
      this.ExitIsQueued = true;
      this.IconStatus = 'Exiting';
    } else if (this.IconStatus === 'Entering') {
      this.ExitIsQueued = true;
    }
  }

  public OnUp(): void {
    if (!this.Animated()) return;

    if (this.IconStatus === 'OffScreen') {
      this.IconStatus = 'Entering';
    } else if (this.IconStatus === 'Exiting') {
      this.EntryIsQueued = true;
    }
  }

  public OnIconAnimationEnd(): void {
    if (this.IconStatus === 'Exiting') {
      this.ExitIsQueued = false;
      this.IconStatus = 'OffScreen';

      if (this.EntryIsQueued) {
        this.EntryIsQueued = false;
        requestAnimationFrame(() => (this.IconStatus = 'Entering'));
      }
    } else if (this.IconStatus === 'Entering') {
      this.EntryIsQueued = false;
      this.IconStatus = 'AtCenter';

      if (this.ExitIsQueued) {
        this.ExitIsQueued = false;
        requestAnimationFrame(() => (this.IconStatus = 'Exiting'));
      }
    }
  }
}
