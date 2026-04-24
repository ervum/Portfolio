import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Minibutton } from './minibutton';



describe('Minibutton', () => {
  let component: Minibutton;
  let fixture: ComponentFixture<Minibutton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Minibutton]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Minibutton);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
