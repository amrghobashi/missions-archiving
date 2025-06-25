import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BattelionUnitComponent } from './battelion-unit.component';

describe('BattelionUnitComponent', () => {
  let component: BattelionUnitComponent;
  let fixture: ComponentFixture<BattelionUnitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BattelionUnitComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BattelionUnitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
