import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChartModule } from 'primeng/chart';
import { ProgressBarModule } from 'primeng/progressbar';
import { Subscription } from 'rxjs';
import { DashboardService } from '../dashboard.service';
import { PurposeStats, Stats } from '../../../models/dashboard';

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [CommonModule, FormsModule, ChartModule, ProgressBarModule],
  templateUrl: './stats.component.html',
  styleUrl: './stats.component.scss'
})
export class StatsComponent implements OnInit, OnDestroy {
  subscription: Subscription = new Subscription();
  stats: Stats | null = null;
  purposeStats: PurposeStats[] = [];
  zoneStats: PurposeStats[] = [];

  purposeChartData: any;
  purposeChartOptions: any;

  zoneChartData: any;
  zoneChartOptions: any;

  totalPurposeMissions = 0;
  totalZoneMissions = 0;

  readonly purposeColors = [
    '#10b981', // emerald
    '#0ea5e9', // sky
    '#8b5cf6', // purple
    '#f59e0b', // amber
    '#ec4899', // pink
    '#14b8a6', // teal
    '#64748b'  // slate
  ];

  readonly zoneColors = [
    '#10b981', // emerald
    '#0ea5e9', // sky
    '#8b5cf6', // purple
    '#f59e0b'  // amber
  ];

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.initChartOptions();
    this.getStats();
    this.getPurposeStats();
    this.getZoneStats();
  }

  private initChartOptions(): void {
    this.purposeChartOptions = {
      responsive: true,
      maintainAspectRatio: true,
      aspectRatio: 1,
      cutout: '72%',
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: 'rgba(15, 23, 42, 0.92)',
          titleFont: { size: 13, weight: 'bold' },
          bodyFont: { size: 12 },
          padding: 10,
          cornerRadius: 8,
          callbacks: {
            label: (context: any) => {
              const val = context.raw || 0;
              const total = this.totalPurposeMissions || 1;
              const pct = ((val / total) * 100).toFixed(1);
              return ` ${val} Missions (${pct}%)`;
            }
          }
        }
      }
    };

    this.zoneChartOptions = {
      responsive: true,
      maintainAspectRatio: true,
      aspectRatio: 1,
      cutout: '72%',
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: 'rgba(15, 23, 42, 0.92)',
          titleFont: { size: 13, weight: 'bold' },
          bodyFont: { size: 12 },
          padding: 10,
          cornerRadius: 8,
          callbacks: {
            label: (context: any) => {
              const val = context.raw || 0;
              const total = this.totalZoneMissions || 1;
              const pct = ((val / total) * 100).toFixed(1);
              return ` ${val} Missions (${pct}%)`;
            }
          }
        }
      }
    };
  }

  getStats(): void {
    this.subscription.add(
      this.dashboardService.getStats().subscribe({
        next: (data) => (this.stats = data),
        error: (err) => console.error('Error fetching stats:', err)
      })
    );
  }

  getPurposeStats(): void {
    this.subscription.add(
      this.dashboardService.getPurposeStats().subscribe({
        next: (data) => {
          this.purposeStats = data || [];
          this.totalPurposeMissions = this.purposeStats.reduce((sum, item) => sum + (item.value || 0), 0);
          this.purposeChartData = {
            labels: this.purposeStats.map((item) => item.name),
            datasets: [
              {
                data: this.purposeStats.map((item) => item.value),
                backgroundColor: this.purposeColors.slice(0, this.purposeStats.length),
                hoverOffset: 4,
                borderWidth: 0,
                spacing: 2,
                borderRadius: 4
              }
            ]
          };
        },
        error: (err) => console.error('Error fetching purpose stats:', err)
      })
    );
  }

  getZoneStats(): void {
    this.subscription.add(
      this.dashboardService.getZoneStats().subscribe({
        next: (data) => {
          this.zoneStats = data || [];
          this.totalZoneMissions = this.zoneStats.reduce((sum, item) => sum + (item.value || 0), 0);
          this.zoneChartData = {
            labels: this.zoneStats.map((item) => item.name),
            datasets: [
              {
                data: this.zoneStats.map((item) => item.value),
                backgroundColor: this.zoneColors.slice(0, this.zoneStats.length),
                hoverOffset: 4,
                borderWidth: 0,
                spacing: 2,
                borderRadius: 4
              }
            ]
          };
        },
        error: (err) => console.error('Error fetching zone stats:', err)
      })
    );
  }

  getPurposePercentage(value?: number): number {
    if (!this.totalPurposeMissions || !value) return 0;
    return Math.round((value / this.totalPurposeMissions) * 100);
  }

  getZonePercentage(value?: number): number {
    if (!this.totalZoneMissions || !value) return 0;
    return Math.round((value / this.totalZoneMissions) * 100);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
