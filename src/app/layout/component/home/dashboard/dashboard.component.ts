import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { DashboardService } from './dashboard.service';
import { BattelionUnitComponent } from './battelion-unit/battelion-unit.component';
import { StatsComponent } from './stats/stats.component';
import { UnitVisitComponent } from './unit-visit/unit-visit.component';
import { VisitDetailComponent } from './visit-detail/visit-detail.component';
import { Unit } from '../../models/unit';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    BattelionUnitComponent,
    StatsComponent,
    UnitVisitComponent,
    VisitDetailComponent,
    SelectModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit, OnDestroy {
  subscription: Subscription = new Subscription();
  unitOptions: any[] = [];
  selectedUnit: any = null;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.getUnitOptions();
    this.getUnitIDFromSubject();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getUnitIDFromSubject() {
    this.subscription.add(
      this.dashboardService.selectedUnit.subscribe((data) => {
        if (data && data.code) {
          this.selectedUnit = data.code;
        } else {
          this.selectedUnit = null;
        }
      })
    );
  }

  getUnitOptions() {
    this.subscription.add(
      this.dashboardService.getFilterUnits().subscribe((units: Unit[]) => {
        this.unitOptions = units;
      })
    );
  }

  onChangeUnit(selectedValue: any) {
    if (!selectedValue) {
      this.selectedUnit = null;
      this.dashboardService.selectedUnit.next({
        code: '',
        name: '',
        parent: ''
      });
      return;
    }

    let selectedUnit: any = null;

    // Search in the top-level and nested items
    for (const group of this.unitOptions) {
      if (group.value === selectedValue) {
        selectedUnit = {
          code: group.value,
          name: group.label,
          parent: null
        };
        break;
      }

      if (group.items) {
        const item = group.items.find((unit: any) => unit.value === selectedValue);
        if (item) {
          selectedUnit = {
            code: item.value,
            name: item.label,
            parent: group.label
          };
          break;
        }
      }
    }

    if (selectedUnit) {
      this.dashboardService.selectedUnit.next(selectedUnit);
    } else {
      console.warn('No matching unit found for value:', selectedValue);
    }
  }
}
