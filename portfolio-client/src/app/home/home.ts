import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { ContainerComponent } from '../shared/components/standalone/container/container';
import { InterfaceService } from '../core/services/interface/interface';
import { SlideUpDownDirective } from '../shared/directives/slide-up-down/slide-up-down.directive';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    ContainerComponent,
    SlideUpDownDirective
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class HomeComponent implements OnInit {
  private ActivatedRoute: ActivatedRoute = inject(ActivatedRoute);
  public InterfaceService: InterfaceService = inject(InterfaceService);

  public ngOnInit(): void {
  }
}
