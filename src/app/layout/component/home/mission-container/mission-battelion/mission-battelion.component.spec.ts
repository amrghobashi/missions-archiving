import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MissionBattelionComponent } from './mission-battelion.component';

describe('MissionBattelionComponent', () => {
  let component: MissionBattelionComponent;
  let fixture: ComponentFixture<MissionBattelionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MissionBattelionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MissionBattelionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
