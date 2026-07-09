import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { StaffVisitDetailComponent } from './staff-visit-detail.component';
import { StaffService } from '../staff.service';

describe('StaffVisitDetailComponent', () => {
  let component: StaffVisitDetailComponent;
  let fixture: ComponentFixture<StaffVisitDetailComponent>;
  let staffService: jasmine.SpyObj<StaffService>;

  beforeEach(async () => {
    const staffServiceSpy = jasmine.createSpyObj('StaffService', ['getVisitsByStaffId']);

    await TestBed.configureTestingModule({
      imports: [StaffVisitDetailComponent],
      providers: [{ provide: StaffService, useValue: staffServiceSpy }]
    }).compileComponents();

    fixture = TestBed.createComponent(StaffVisitDetailComponent);
    component = fixture.componentInstance;
    staffService = TestBed.inject(StaffService) as jasmine.SpyObj<StaffService>;
  });

  it('loads visits when a staff id is provided', () => {
    const visits = [{ id: 1, mission_id: 'M-101' } as any];
    staffService.getVisitsByStaffId.and.returnValue(of(visits));

    component.staffId = 7;
    component.ngOnChanges({
      staffId: {
        currentValue: 7,
        previousValue: null,
        firstChange: true,
        isFirstChange: () => true
      }
    });

    expect(staffService.getVisitsByStaffId).toHaveBeenCalledWith(7);
    expect(component.visitList).toEqual(visits);
  });
});
