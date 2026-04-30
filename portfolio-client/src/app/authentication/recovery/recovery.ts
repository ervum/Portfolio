import { Component, inject, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

import { FancyDropdownItemType } from '@ervum/types';
import { ContainerComponent } from '../../shared/components/standalone/container/container';
import { DropdownComponent } from '../../shared/components/standalone/dropdown/dropdown';
import { InterfaceService } from '../../core/services/interface/interface';
import { NavigationService } from '../../core/services/navigation/navigation';
import { TypewriterDirective } from '../../shared/directives/typewriter/typewriter.directive';
import { ButtonComponent } from '../../shared/components/standalone/button/button';
import { TextboxComponent } from '../../shared/components/standalone/textbox/textbox';
import { SlideUpDownDirective } from '../../shared/directives/slide-up-down/slide-up-down.directive';

@Component({
  selector: 'app-recovery',
  standalone: true,
  imports: [
    CommonModule,
    ContainerComponent,
    DropdownComponent,
    TypewriterDirective,
    ButtonComponent,
    TextboxComponent,
    SlideUpDownDirective
  ],
  templateUrl: './recovery.html',
  styleUrl: './recovery.scss'
})
export class RecoveryComponent implements OnInit {
  private Router: Router = inject(Router);
  public InterfaceService: InterfaceService = inject(InterfaceService);
  private NavigationService: NavigationService = inject(NavigationService);

  public RecoveryOptions = computed(() => [
    { Label: this.InterfaceService.T().Username, Action: () => {} },
    { Label: this.InterfaceService.T().PhoneNumber, Action: () => {} },
    { Label: this.InterfaceService.T().Email, Action: () => {} },
    { Label: this.InterfaceService.T().Password, Action: () => {} },
  ]);

  public SelectedOption = signal<FancyDropdownItemType | undefined>(undefined);

  public SelectedRecoveryType = computed(() => {
    const Selected = this.SelectedOption();
    if (!Selected) return 'Username';

    const T = this.InterfaceService.T();
    if (Selected.Label === T.Username) return 'Username';
    if (Selected.Label === T.PhoneNumber) return 'PhoneNumber';
    if (Selected.Label === T.Email) return 'Email';
    if (Selected.Label === T.Password) return 'Password';

    return 'Username';
  });

  public ngOnInit(): void {
    // Wait for options to be available if needed, then set default to 'Password'
    const Options = this.RecoveryOptions();
    if (Options.length >= 4) {
      this.SelectedOption.set(Options[3]);
    }
  }

  public OnSelectionChange(Item: FancyDropdownItemType): void {
    this.SelectedOption.set(Item);
  }

  public FirstTextboxIcon = computed(() => {
    const Type = this.SelectedRecoveryType();
    if (Type === 'Username') return 'phone';
    if (Type === 'PhoneNumber' || Type === 'Email') return 'at';
    return undefined;
  });

  public FirstTextboxPlaceholder = computed(() => {
    const Type = this.SelectedRecoveryType();
    const T = this.InterfaceService.T();
    if (Type === 'Username') return T.PhoneNumber;
    if (Type === 'PhoneNumber' || Type === 'Email') return T.Username;
    return '';
  });

  public SecondTextboxIcon = computed(() => {
    const Type = this.SelectedRecoveryType();
    if (Type === 'Username' || Type === 'PhoneNumber') return 'envelope';
    if (Type === 'Email') return 'phone';
    return undefined;
  });

  public SecondTextboxPlaceholder = computed(() => {
    const Type = this.SelectedRecoveryType();
    const T = this.InterfaceService.T();
    if (Type === 'Username' || Type === 'PhoneNumber') return T.Email;
    if (Type === 'Email') return T.PhoneNumber;
    return '';
  });

  public GoBack(): void {
    // Navigate back to authentication
    this.NavigationService.NavigateWithAnimation('authentication');
  }
}
