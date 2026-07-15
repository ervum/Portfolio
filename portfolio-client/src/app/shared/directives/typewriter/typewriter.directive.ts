import { Directive, ElementRef, inject, input, effect, type InputSignal } from '@angular/core';

import { TypewriterAnimator } from '../../utilities/typewriter';
import { InterfaceService } from '../../../core/services/interface/interface';



@Directive({
  selector: '[FancyTypewriter]',
  standalone: true
})
export class TypewriterDirective {
  private readonly InterfaceService: InterfaceService = inject(InterfaceService);
  private readonly ElementRef: ElementRef<HTMLElement> = inject(ElementRef);
  private readonly Animator: TypewriterAnimator = new TypewriterAnimator();

  public Text: InputSignal<string> = input<string>('', { alias: 'FancyTypewriter' });

  private Initialized: boolean = false;

  constructor() {
    effect(() => {
      const NewText: string = this.Text()?.trim() ?? '';
      const OldText: string = this.ElementRef.nativeElement.innerText?.trim() ?? '';

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
