import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MissionVisitComponent } from './mission-visit.component';

describe('MissionVisitComponent', () => {
  let component: MissionVisitComponent;
  let fixture: ComponentFixture<MissionVisitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MissionVisitComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MissionVisitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
