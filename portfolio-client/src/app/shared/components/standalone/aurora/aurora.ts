import { Component, ElementRef, HostListener, ViewChild, AfterViewInit, Input, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';



interface AuroraSphere {
  top: string;
  left: string;
  size: string;
  
  // Complexity: Mesh Gradients
  // We use multiple radial gradients layered to create the "flowy" internal look
  background: string; 
  
  // Parallax Speed: Higher = moves more (closer), Lower = moves less (farther)
  speed: number;
  
  // Rotation speed for dynamic rotation based on mouse angle
  rotationSpeed: number;
  
  // Scale speed for dynamic scaling based on mouse distance
  scaleSpeed: number;
  
  opacity: number;
  
  // Wave offset for wave-like positioning pattern
  waveOffset: number;
  
  // Animation delay for staggered floating effect
  animationDelay: number;
}



@Component({
  selector: 'Aurora',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div #Container class="Aurora-Container">
      <!-- Wave layers for continuous flowing motion -->
      <div class="Aurora-Wave Aurora-Wave--1"></div>
      <div class="Aurora-Wave Aurora-Wave--2"></div>
      <div class="Aurora-Wave Aurora-Wave--3"></div>
      
      <!-- Smaller gradient blobs with enhanced reactivity -->
      @for (Sphere of Spheres; track $index) {
        <div 
          class = "Aurora-Sphere"

          [style.top] = "Sphere.top"
          [style.left] = "Sphere.left"

          [style.width] = "Sphere.size"
          [style.height] = "Sphere.size"

          [style.background] = "Sphere.background"

          [style.--Sphere-Opacity] = "Sphere.opacity"
          [style.--Sphere-Speed] = "Sphere.speed"
          [style.--Sphere-RotationSpeed] = "Sphere.rotationSpeed"
          [style.--Sphere-ScaleSpeed] = "Sphere.scaleSpeed"
          [style.--Sphere-WaveOffset] = "Sphere.waveOffset"
          
          [style.animation-delay] = "Sphere.animationDelay + 's'">
        </div>
      }
      
      <!-- Optional: A noise texture overlay to add texture/grain to the blur -->
      <div class="Aurora-Noise"></div>
    </div>
  `,
  styleUrls: ['./aurora.scss']
})
export class AuroraComponent implements OnInit, AfterViewInit {
  @ViewChild('Container') ContainerRef!: ElementRef<HTMLDivElement>;
  
  // Input properties for sphere generation configuration
  @Input() sphereCount: number = 30;
  
  // Size constraints (in vw units)
  @Input() minSize: number = 14;
  @Input() maxSize: number = 22;
  
  // Position constraints (in percentage)
  @Input() minTop: number = 0;
  @Input() maxTop: number = 100;
  @Input() minLeft: number = 0;
  @Input() maxLeft: number = 100;
  
  // Speed constraints
  @Input() minSpeed: number = -20;
  @Input() maxSpeed: number = 20;
  
  // Rotation speed constraints
  @Input() minRotationSpeed: number = -0.8;
  @Input() maxRotationSpeed: number = 0.8;
  
  // Scale speed constraints
  @Input() minScaleSpeed: number = 0.1;
  @Input() maxScaleSpeed: number = 0.2;
  
  // Opacity constraints
  @Input() minOpacity: number = 0.3;
  @Input() maxOpacity: number = 0.5;
  
  // Wave offset constraints
  @Input() minWaveOffset: number = 0;
  @Input() maxWaveOffset: number = 3;
  
  // Animation delay constraints (in seconds)
  @Input() minAnimationDelay: number = 0;
  @Input() maxAnimationDelay: number = 4;
  
  private rafId: number | null = null;
  private mouseX: number = 0;
  private mouseY: number = 0;
  private lastMouseX: number = 0;
  private lastMouseY: number = 0;
  private mouseVelocity: number = 0;
  private lastTime: number = Date.now();
  private readonly isBrowser: boolean;

  // Dynamically generated spheres
  public Spheres: AuroraSphere[] = [];
  
  // Color palette for random gradient generation
  private readonly colorPalette = [
    // Purple/Pink variations
    { r: 139, g: 92, b: 246 },   // Purple
    { r: 236, g: 72, b: 153 },   // Pink
    { r: 124, g: 58, b: 237 },   // Deep Purple
    { r: 79, g: 70, b: 229 },    // Indigo
    { r: 219, g: 39, b: 119 },   // Magenta
    // Cyan/Blue variations
    { r: 6, g: 182, b: 212 },    // Cyan
    { r: 59, g: 130, b: 246 },   // Blue
    { r: 14, g: 165, b: 233 },   // Sky Blue
  ];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  /**
   * Generate random spheres based on input constraints
   */
  ngOnInit(): void {
    this.generateSpheres();
  }

  /**
   * Generate random spheres with properties within the specified min/max bounds
   */
  private generateSpheres(): void {
    this.Spheres = [];
    
    for (let i = 0; i < this.sphereCount; i++) {
      const sphere: AuroraSphere = {
        top: `${this.randomBetween(this.minTop, this.maxTop)}%`,
        left: `${this.randomBetween(this.minLeft, this.maxLeft)}%`,
        size: `${this.randomBetween(this.minSize, this.maxSize)}vw`,
        speed: this.randomBetween(this.minSpeed, this.maxSpeed),
        rotationSpeed: this.randomBetween(this.minRotationSpeed, this.maxRotationSpeed),
        scaleSpeed: this.randomBetween(this.minScaleSpeed, this.maxScaleSpeed),
        opacity: this.randomBetween(this.minOpacity, this.maxOpacity),
        waveOffset: this.randomBetween(this.minWaveOffset, this.maxWaveOffset),
        animationDelay: this.randomBetween(this.minAnimationDelay, this.maxAnimationDelay),
        background: this.generateRandomGradient()
      };
      
      this.Spheres.push(sphere);
    }
  }

  /**
   * Generate a random number between min and max (inclusive)
   */
  private randomBetween(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }

  /**
   * Generate a random gradient background using colors from the palette
   */
  private generateRandomGradient(): string {
    const gradientType = Math.random();
    const color1 = this.colorPalette[Math.floor(Math.random() * this.colorPalette.length)];
    const color2 = this.colorPalette[Math.floor(Math.random() * this.colorPalette.length)];
    const color3 = this.colorPalette[Math.floor(Math.random() * this.colorPalette.length)];
    
    // Random opacity for colors (between 0.4 and 0.8)
    const opacity1 = this.randomBetween(0.4, 0.8);
    const opacity2 = this.randomBetween(0.4, 0.8);
    const opacity3 = this.randomBetween(0.3, 0.6);
    
    // Random positions for gradient stops
    const pos1 = Math.floor(this.randomBetween(20, 40));
    const pos2 = Math.floor(this.randomBetween(50, 70));
    const pos3 = Math.floor(this.randomBetween(60, 80));
    
    if (gradientType < 0.5) {
      // Radial gradient (most common)
      return `
        radial-gradient(circle at ${pos1}% ${pos1}%, rgba(${color1.r}, ${color1.g}, ${color1.b}, ${opacity1}), transparent ${pos2}%),
        radial-gradient(circle at ${pos3}% ${100 - pos3}%, rgba(${color2.r}, ${color2.g}, ${color2.b}, ${opacity2}), transparent ${pos3}%)
      `;
    } else if (gradientType < 0.8) {
      // Conic gradient
      const angle = Math.floor(this.randomBetween(0, 360));
      return `
        conic-gradient(from ${angle}deg, rgba(${color1.r}, ${color1.g}, ${color1.b}, ${opacity1}), rgba(${color2.r}, ${color2.g}, ${color2.b}, ${opacity2}), rgba(${color1.r}, ${color1.g}, ${color1.b}, ${opacity1}))
      `;
    } else {
      // Triple radial gradient for more complexity
      return `
        radial-gradient(circle at ${pos1}% ${pos1}%, rgba(${color1.r}, ${color1.g}, ${color1.b}, ${opacity1}), transparent ${pos2}%),
        radial-gradient(circle at ${pos3}% ${pos1}%, rgba(${color2.r}, ${color2.g}, ${color2.b}, ${opacity2}), transparent ${pos3}%),
        radial-gradient(circle at ${100 - pos1}% ${100 - pos1}%, rgba(${color3.r}, ${color3.g}, ${color3.b}, ${opacity3}), transparent ${pos2}%)
      `;
    }
  }

  /**
   * Initialize mouse position on view init to ensure parallax works immediately
   */
  ngAfterViewInit(): void {
    if (!this.isBrowser) return;
    
    if (this.ContainerRef?.nativeElement) {
      // Initialize mouse position to center (0, 0)
      this.lastMouseX = 0;
      this.lastMouseY = 0;
      this.lastTime = Date.now();
      this.updateMousePosition(0, 0);
    }
  }

  /**
   * Updates CSS variables with normalized mouse position and enhanced metrics.
   * Uses requestAnimationFrame for smooth 60fps updates.
   */
  private updateMousePosition(x: number, y: number): void {
    if (!this.isBrowser || !this.ContainerRef?.nativeElement) return;

    // Calculate velocity
    const now = Date.now();
    const deltaTime = Math.max(now - this.lastTime, 1);
    const deltaX = x - this.lastMouseX;
    const deltaY = y - this.lastMouseY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    this.mouseVelocity = distance / deltaTime * 1000; // pixels per second
    
    // Calculate distance from center (normalized 0 to ~1.414)
    const distanceFromCenter = Math.sqrt(x * x + y * y);
    
    // Calculate angle from center to mouse position
    const angle = Math.atan2(y, x);

    this.mouseX = x;
    this.mouseY = y;
    this.lastMouseX = x;
    this.lastMouseY = y;
    this.lastTime = now;

    // Cancel any pending animation frame
    if (this.rafId !== null && typeof cancelAnimationFrame !== 'undefined') {
      cancelAnimationFrame(this.rafId);
    }

    // Use requestAnimationFrame for smooth updates
    if (typeof requestAnimationFrame !== 'undefined') {
      this.rafId = requestAnimationFrame(() => {
        const container = this.ContainerRef.nativeElement;
        container.style.setProperty('--Mouse-X', x.toString());
        container.style.setProperty('--Mouse-Y', y.toString());
        container.style.setProperty('--Mouse-Distance', distanceFromCenter.toString());
        container.style.setProperty('--Mouse-Angle', angle.toString());
        container.style.setProperty('--Mouse-Velocity', this.mouseVelocity.toString());
        this.rafId = null;
      });
    }
  }

  /**
   * Tracks mouse movement and updates CSS Variables.
   * We do NOT update Angular variables here to avoid Change Detection cycles.
   * We update the DOM styles directly for 60fps performance.
   */
  @HostListener('window:mousemove', ['$event'])
  onMouseMove(e: MouseEvent): void {
    if (!this.isBrowser || !this.ContainerRef?.nativeElement) return;

    // Calculate normalized mouse position (-1 to +1)
    // -1 = Left/Top, 0 = Center, +1 = Right/Bottom
    // Using window dimensions for consistent behavior across viewport sizes
    const X: number = (e.clientX / window.innerWidth) * 2 - 1;
    const Y: number = (e.clientY / window.innerHeight) * 2 - 1;

    // Update mouse position with throttling via requestAnimationFrame
    this.updateMousePosition(X, Y);
  }
}