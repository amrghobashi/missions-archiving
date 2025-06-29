import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitDetailComponent } from './visit-detail.component';

describe('VisitDetailComponent', () => {
  let component: VisitDetailComponent;
  let fixture: ComponentFixture<VisitDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisitDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisitDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
