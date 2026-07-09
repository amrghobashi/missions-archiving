import { Component } from '@angular/core';
import { LegendPosition, NgxChartsModule } from '@swimlane/ngx-charts';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ScaleType } from '@swimlane/ngx-charts';
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
  imports: [NgxChartsModule, CommonModule, FormsModule, BattelionUnitComponent,
    StatsComponent, UnitVisitComponent, VisitDetailComponent, SelectModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  subscription: Subscription = new Subscription();
  unitOptions: any[] = [];
  selectedUnit: any = null;
  
  constructor(private dashboardService: DashboardService) {

  }

  ngOnInit() {
    this.getUnitOptions();
    this.getUnitIDFromSubject();
  }
  
  getUnitIDFromSubject() {
    this.subscription = this.dashboardService.selectedUnit.subscribe(data => {
        console.log('Selected Unit from Subject:', data);
        this.selectedUnit = data.code;
      });
    }

  getUnitOptions() {
    this.subscription = this.dashboardService.getFilterUnits().subscribe((units: Unit[]) => {
        this.unitOptions = units;
      });
    }

    onChangeUnit(selectedValue: any) {
        let selectedUnit: any = null;

        // Search in the top-level and nested items
        for (const group of this.unitOptions) {
            // Check if the selected value matches the group's value
            if (group.value === selectedValue) {
                selectedUnit = {
                    code: group.value,
                    name: group.label,
                    parent: null // Top-level group has no parent
                };
                break;
            }

            // Check if the selected value matches any item's value in the group
            if (group.items) {
                const item = group.items.find((unit: any) => unit.value === selectedValue);
                if (item) {
                    selectedUnit = {
                        code: item.value,
                        name: item.label,
                        parent: group.label // Parent is the group's label
                    };
                    break;
                }
            }
        }

        // If a matching unit is found, send it to the selectedUnit subject
        if (selectedUnit) {
            this.dashboardService.selectedUnit.next(selectedUnit);
            console.log('Selected Unit:', selectedUnit);
        } else {
            console.warn('No matching unit found for value:', selectedValue);
        }
    }
}
