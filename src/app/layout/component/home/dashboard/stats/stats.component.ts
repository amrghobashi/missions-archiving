import { Component } from '@angular/core';
import { DashboardService } from '../dashboard.service';
import { Subscription } from 'rxjs';
import { PurposeStats, Stats } from '../../../models/dashboard';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ScaleType } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-stats',
  imports: [NgxChartsModule, CommonModule, FormsModule],
  templateUrl: './stats.component.html',
  styleUrl: './stats.component.scss'
})
export class StatsComponent {
  subscription: Subscription = new Subscription();
  visits = [];
  stats: Stats | null = null;
  purposeStats: PurposeStats[] | null = null;
  zoneStats: PurposeStats[] | null = null;
  purposeView: [number, number] = [700, 200];
  zoneView: [number, number] = [400, 200];
  gradient: boolean = true;
  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = false;

  colorScheme = {
    name: 'customScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#b7e4c7', '#95d5b2', '#74c69d', '#2d6a4f', '#081c15', '#1b4332', '#52b788', '#40916c', '#d8f3dc']
  };

  constructor(private dashboardService: DashboardService) { }

  ngOnInit() {
    this.getStats();
    this.getPurposeStats();
    this.getZoneStats();
  }

  getStats() {
    this.subscription = this.dashboardService.getStats().subscribe(data => {
      this.stats = data;
      console.log('Stats:', this.stats);
    });
  }

  getPurposeStats() {
    this.subscription = this.dashboardService.getPurposeStats().subscribe(data => {
      this.purposeStats = data;
      console.log('Purpose Stats:', this.purposeStats);
    });
  }

  getZoneStats() {
    this.subscription = this.dashboardService.getZoneStats().subscribe(data => {
      this.zoneStats = data;
      console.log('Zone Stats:', this.zoneStats);
    });
  }

}
