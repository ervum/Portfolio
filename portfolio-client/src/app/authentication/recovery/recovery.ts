import { Component, inject, OnInit, computed, signal, type Signal, type WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { Undefinable, FancyDropdownItemType } from '@ervum/types';

import { ContainerComponent } from '../../shared/components/standalone/container/container';
import { DropdownComponent } from '../../shared/components/standalone/dropdown/dropdown';
import { ButtonComponent } from '../../shared/components/standalone/button/button';
import { TextboxComponent } from '../../shared/components/standalone/textbox/textbox';

import { type TranslationDictionary } from '../../core/internationalization';
import { InterfaceService } from '../../core/services/interface/interface';
import { NavigationService } from '../../core/services/navigation/navigation';

import { TypewriterDirective } from '../../shared/directives/typewriter/typewriter.directive';
import { SlideUpDownDirective } from '../../shared/directives/slide-up-down/slide-up-down.directive';



@Component({
  selector: 'app-recovery',
  standalone: true,
  imports: [
    CommonModule,

    ContainerComponent,
    DropdownComponent,
    ButtonComponent,
    TextboxComponent,

    TypewriterDirective,
    SlideUpDownDirective
  ],
  templateUrl: './recovery.html',
  styleUrl: './recovery.scss'
})
export class RecoveryComponent implements OnInit {
  private Router: Router = inject(Router);

  private NavigationService: NavigationService = inject(NavigationService);
  public InterfaceService: InterfaceService = inject(InterfaceService);

  public RecoveryOptions: Signal<FancyDropdownItemType[]> = computed(() => [
    { ID: 'Username', Label: this.InterfaceService.T().Username, Action: () => {} },
    { ID: 'PhoneNumber', Label: this.InterfaceService.T().PhoneNumber, Action: () => {} },
    { ID: 'Email', Label: this.InterfaceService.T().Email, Action: () => {} },
    { ID: 'Password', Label: this.InterfaceService.T().Password, Action: () => {} },
  ]);

  public SelectedOption: WritableSignal<Undefinable<FancyDropdownItemType>> = signal<Undefinable<FancyDropdownItemType>>(undefined);

  public SelectedRecoveryType: Signal<string> = computed(() => {
    const Selected: Undefinable<FancyDropdownItemType> = this.SelectedOption();

    if (!Selected) return 'Username';

    if (Selected.ID === 'Username') return 'Username';
    if (Selected.ID === 'PhoneNumber') return 'PhoneNumber';
    if (Selected.ID === 'Email') return 'Email';
    if (Selected.ID === 'Password') return 'Password';

    return 'Username';
  });

  public ngOnInit(): void {
    // Wait for options to be available if needed, then set default to 'Password'
    const Options: FancyDropdownItemType[] = this.RecoveryOptions();
    if (Options.length >= 4) {
      this.SelectedOption.set(Options[3]);
    }
  }

  public OnSelectionChange(Item: FancyDropdownItemType): void {
    this.SelectedOption.set(Item);
  }

  public FirstTextboxOnlyAllow: Signal<Undefinable<string>> = computed(() => {
    return this.SelectedRecoveryType() === 'Username' ? '0123456789+-()' : undefined;
  });

  public SecondTextboxOnlyAllow: Signal<Undefinable<string>> = computed(() => {
    return this.SelectedRecoveryType() === 'Email' ? '0123456789+-()' : undefined;
  });

  public FirstTextboxIcon: Signal<Undefinable<string>> = computed(() => {
    const Type: string = this.SelectedRecoveryType();
  
    if (Type === 'Username') return 'phone';
    if (Type === 'PhoneNumber' || Type === 'Email') return 'at';
  
    return undefined;
  });

  public SecondTextboxIcon: Signal<Undefinable<string>> = computed(() => {
    const Type: string = this.SelectedRecoveryType();
  
    if (Type === 'Username' || Type === 'PhoneNumber') return 'envelope';
    if (Type === 'Email') return 'phone';
  
    return undefined;
  });

  public FirstTextboxPlaceholder: Signal<string> = computed(() => {
    const Type: string = this.SelectedRecoveryType();
    const T: TranslationDictionary = this.InterfaceService.T();

    if (Type === 'Username') return T.PhoneNumber;
    if (Type === 'PhoneNumber' || Type === 'Email') return T.Username;

    return '';
  });

  public SecondTextboxPlaceholder: Signal<string> = computed(() => {
    const Type: string = this.SelectedRecoveryType();
    const T: TranslationDictionary = this.InterfaceService.T();
  
    if (Type === 'Username' || Type === 'PhoneNumber') return T.Email;
    if (Type === 'Email') return T.PhoneNumber;

    return '';
  });

  public GoBack(): void {
    // Navigate back to authentication
    this.NavigationService.NavigateWithAnimation('authentication');
  }

  /**
   * Mock handler for the recovery process to show the shared animation.
   */
  public HandleRecovery(): void {
    this.InterfaceService.SetStatus('Loading');

    // Simulate a network request
    setTimeout(() => {
      // 80% chance of success for demonstration
      if (Math.random() > 0.2) {
        this.InterfaceService.SetStatus('Success');
      } else {
        this.InterfaceService.SetStatus('Error');
      }
    }, 500);
  }
}
