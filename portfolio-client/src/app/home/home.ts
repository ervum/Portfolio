import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContainerComponent } from '../shared/components/standalone/container/container';

import { InterfaceService } from '../core/services/interface/interface';

import { SlideUpDownDirective } from '../shared/directives/slide-up-down/slide-up-down.directive';
import { TypewriterDirective } from '../shared/directives/typewriter/typewriter.directive';



@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    ContainerComponent,
    SlideUpDownDirective,
    TypewriterDirective
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class HomeComponent {
  public InterfaceService: InterfaceService = inject(InterfaceService);
}
