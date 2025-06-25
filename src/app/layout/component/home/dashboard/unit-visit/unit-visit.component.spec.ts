import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitVisitComponent } from './unit-visit.component';

describe('UnitVisitComponent', () => {
  let component: UnitVisitComponent;
  let fixture: ComponentFixture<UnitVisitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnitVisitComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnitVisitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
