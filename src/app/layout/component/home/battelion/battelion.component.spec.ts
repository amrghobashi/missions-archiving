import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BattelionComponent } from './battelion.component';

describe('BattelionComponent', () => {
  let component: BattelionComponent;
  let fixture: ComponentFixture<BattelionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BattelionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BattelionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
