import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MissionStaffComponent } from './mission-staff.component';

describe('MissionStaffComponent', () => {
  let component: MissionStaffComponent;
  let fixture: ComponentFixture<MissionStaffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MissionStaffComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MissionStaffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
