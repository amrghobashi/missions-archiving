import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MissionCarComponent } from './mission-car.component';

describe('MissionCarComponent', () => {
  let component: MissionCarComponent;
  let fixture: ComponentFixture<MissionCarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MissionCarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MissionCarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
