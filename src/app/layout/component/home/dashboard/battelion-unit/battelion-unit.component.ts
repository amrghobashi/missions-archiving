import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChartModule } from 'primeng/chart';
import { Subscription } from 'rxjs';
import { DashboardService } from '../dashboard.service';

interface BattalionData {
  name: string;
  totalVisits: number;
  series: { name: string; value: number }[];
}

@Component({
  selector: 'app-battelion-unit',
  standalone: true,
  imports: [CommonModule, FormsModule, ChartModule],
  templateUrl: './battelion-unit.component.html',
  styleUrl: './battelion-unit.component.scss'
})
export class BattelionUnitComponent implements OnInit, OnDestroy {
  subscription: Subscription = new Subscription();
  battalions: BattalionData[] = [];
  loading = false;

  chartData: any;
  chartOptions: any;

  // readonly colors = [
  //   // '#064E3B',
  //   '#065F46',
  //   // '#047857',
  //   '#059669',
  //   // '#10B981',
  //   '#22C58B',
  //   // '#34D399',
  //   '#4ADE80',
  //   // '#6EE7B7',
  //   '#A7F3D0'
  // ];

readonly colors = [
  // "#081c15",
  // "#1b4332",
  "#2d6a4f",
  "#40916c",
  "#52b788",
  "#74c69d",
  "#95d5b2",
  "#b7e4c7",
  "#d8f3dc"
];

constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.initChartOptions();
    this.getBatUnitVisits();
  }

  private initChartOptions(): void {
    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: 'rgba(15, 23, 42, 0.92)',
          titleFont: { size: 13, weight: 'bold' },
          bodyFont: { size: 12 },
          padding: 12,
          cornerRadius: 8,
          callbacks: {
            title: (items: any[]) => {
              if (!items.length) return '';
              const idx = items[0].dataIndex;
              return this.battalions[idx]?.name || '';
            },
            label: (context: any) => {
              const b = this.battalions[context.dataIndex];
              const total = context.raw || 0;
              const unitCount = b?.series?.length || 0;
              return [
                ` Total Visits: ${total}`,
                ` Monitored Units: ${unitCount}`,
                ` (Click to select this sector)`
              ];
            }
          }
        }
      },
      scales: {
        x: {
          grid: {
            display: false
          },
          ticks: {
            color: '#334155',
            font: {
              size: 11,
              weight: '600'
            },
            maxRotation: 35,
            minRotation: 15
          }
        },
        y: {
          beginAtZero: true,
          ticks: {
            precision: 0,
            color: '#64748b'
          },
          grid: {
            color: 'rgba(148, 163, 184, 0.15)'
          },
          title: {
            display: true,
            text: 'Total Visits Count',
            color: '#64748b',
            font: { size: 12, weight: '600' }
          }
        }
      }
    };
  }

  getBatUnitVisits(): void {
    this.loading = true;
    this.subscription.add(
      this.dashboardService.getBatUnitVisit().subscribe({
        next: (data: any[]) => {
          this.loading = false;
          if (!data || !Array.isArray(data)) return;

          // Map and calculate total visits per battalion, then sort descending
          this.battalions = data.map((b) => {
            const series = b.series || [];
            const total = series.reduce((sum: number, u: any) => sum + (u.value || 0), 0);
            return {
              name: b.name,
              totalVisits: total,
              series: series
            };
          }).sort((a, b) => b.totalVisits - a.totalVisits);

          this.updateChart();
        },
        error: (err) => {
          this.loading = false;
          console.error('Error fetching Bat Unit Visits:', err);
        }
      })
    );
  }

  private updateChart(): void {
    const bgColors = this.battalions.map((_, i) => this.colors[i % this.colors.length]);

    this.chartData = {
      labels: this.battalions.map((b) => b.name),
      datasets: [
        {
          label: 'Total Visits',
          data: this.battalions.map((b) => b.totalVisits),
          backgroundColor: bgColors,
          borderRadius: 8,
          borderSkipped: 'bottom',
          maxBarThickness: 45
        }
      ]
    };
  }

  onChartSelect(event: any): void {
    if (!event || event.element === undefined) return;
    const idx = event.element.index;
    const b = this.battalions[idx];
    if (!b || !b.series || b.series.length === 0) return;

    // Pick top visited unit in that battalion
    const topUnit = [...b.series].sort((x, y) => y.value - x.value)[0];
    const match = topUnit.name.match(/\(([^)]+)\)$/);
    const code = match ? match[1] : '';

    this.dashboardService.selectedUnit.next({
      code: code,
      name: topUnit.name,
      parent: b.name
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
