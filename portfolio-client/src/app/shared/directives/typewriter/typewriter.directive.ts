import { Directive, ElementRef, Input, OnChanges, SimpleChanges, inject } from '@angular/core';

import { TypewriterAnimator } from '../../utilities/typewriter';
import { InterfaceService } from '../../../core/services/interface/interface';



@Directive({
  selector: '[FancyTypewriter]',
  standalone: true
})
export class TypewriterDirective implements OnChanges {
  private readonly InterfaceService = inject(InterfaceService);
  private readonly ElementRef: ElementRef<HTMLElement> = inject(ElementRef);
  private readonly Animator = new TypewriterAnimator();

  @Input('FancyTypewriter') Text: string = '';

  ngOnChanges(Changes: SimpleChanges): void {
    if (Changes['Text']) {
      const OldText: string = (Changes['Text'].previousValue) ?? '';
      const NewText: string = (Changes['Text'].currentValue) ?? '';

      if (Changes['Text'].isFirstChange()) {
        this.ElementRef.nativeElement.innerText = NewText;
        return;
      }

      this.Animator.Animate(
        OldText,
        NewText,
        (Text: string) => { this.ElementRef.nativeElement.innerText = Text; },
        this.InterfaceService.Typewriter()
      );
    }
  }
}
