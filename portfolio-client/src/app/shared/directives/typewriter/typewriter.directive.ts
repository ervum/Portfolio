import { Directive, ElementRef, inject, input, effect } from '@angular/core';

import { TypewriterAnimator } from '../../utilities/typewriter';
import { InterfaceService } from '../../../core/services/interface/interface';



@Directive({
  selector: '[FancyTypewriter]',
  standalone: true
})
export class TypewriterDirective {
  private readonly InterfaceService = inject(InterfaceService);
  private readonly ElementRef: ElementRef<HTMLElement> = inject(ElementRef);
  private readonly Animator = new TypewriterAnimator();

  public Text = input<string>('', { alias: 'FancyTypewriter' });

  private Initialized = false;

  constructor() {
    effect(() => {
      const NewText = this.Text()?.trim() ?? '';
      const OldText = this.ElementRef.nativeElement.innerText?.trim() ?? '';

      // Skip animation on first run or if text already matches
      if (!this.Initialized || NewText === OldText) {
        if (NewText !== '') {
          this.ElementRef.nativeElement.innerText = NewText;
          this.Initialized = true;
        }
        return;
      }

      this.Animator.Animate(
        OldText,
        NewText,
        (Text: string) => { this.ElementRef.nativeElement.innerText = Text; },
        this.InterfaceService.Typewriter()
      );
    });
  }
}
