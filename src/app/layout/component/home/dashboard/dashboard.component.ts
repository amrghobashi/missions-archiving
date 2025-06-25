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

@Component({
  selector: 'app-dashboard',
  imports: [NgxChartsModule, CommonModule, FormsModule, BattelionUnitComponent,
    StatsComponent, UnitVisitComponent, VisitDetailComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  subscription: Subscription = new Subscription();
  
  constructor(private dashboardService: DashboardService) {

  }

  ngOnInit() {

  }

}
