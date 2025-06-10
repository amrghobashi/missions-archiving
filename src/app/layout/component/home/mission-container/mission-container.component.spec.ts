import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MissionContainerComponent } from './mission-container.component';

describe('MissionContainerComponent', () => {
  let component: MissionContainerComponent;
  let fixture: ComponentFixture<MissionContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MissionContainerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MissionContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
