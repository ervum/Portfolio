import { Component, inject, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

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

  public ngOnInit(): void {
  }

  public GoBack(): void {
    // Navigate back to authentication
    this.NavigationService.NavigateWithAnimation('authentication');
  }
}
