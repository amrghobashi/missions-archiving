import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChartModule } from 'primeng/chart';
import { Subscription } from 'rxjs';
import { DashboardService } from '../dashboard.service';
import { PurposeStats } from '../../../models/dashboard';

@Component({
  selector: 'app-unit-visit',
  standalone: true,
  imports: [CommonModule, FormsModule, ChartModule],
  templateUrl: './unit-visit.component.html',
  styleUrl: './unit-visit.component.scss'
})
export class UnitVisitComponent implements OnInit, OnDestroy {
  subscription: Subscription = new Subscription();
  selectedUnit: string | null = null;
  visits: PurposeStats[] = [];
  loading = false;

  chartData: any;
  chartOptions: any;

  // readonly colors = [
  //   // '#012A4A',
  //   '#013A63',
  //   // '#01497C',
  //   '#014F86',
  //   // '#2A6F97',
  //   '#2C7DA0',
  //   // '#468FAF',
  //   '#61A5C2',
  //   // '#89C2D9',
  //   '#A9D6E5'
  // ];
  readonly colors = [
    // "#03045e", 
    "#023e8a", 
    "#0077b6", 
    "#0096c7",
    "#00b4d8",
    "#48cae4",
    "#90e0ef",
    "#ade8f4",
    // "#caf0f8"
  ];
  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.initChartOptions();

    this.subscription.add(
      this.dashboardService.selectedUnit.subscribe((data) => {
        if (data && data.code) {
          this.selectedUnit = data.name;
          this.getVisits(data.code);
        } else {
          this.selectedUnit = null;
          this.visits = [];
          this.chartData = null;
        }
      })
    );
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
              return items[0].label;
            },
            label: (context: any) => {
              const val = context.raw || 0;
              return [
                ` Visits: ${val}`,
                ` (Click to filter table below for this quarter)`
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
            color: '#475569',
            font: { size: 12, weight: '600' }
          }
        },
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1,
            precision: 0,
            color: '#64748b',
            font: { size: 12 }
          },
          grid: {
            color: 'rgba(148, 163, 184, 0.15)'
          },
          title: {
            display: true,
            text: 'Number of Visits',
            color: '#64748b',
            font: { size: 12, weight: '600' }
          }
        }
      }
    };
  }

  getVisits(id: string): void {
    this.loading = true;
    this.subscription.add(
      this.dashboardService.getUnitVisits(id).subscribe({
        next: (data) => {
          this.loading = false;
          this.visits = data || [];
          this.updateChart();
        },
        error: (err) => {
          this.loading = false;
          console.error('Error fetching unit visits:', err);
        }
      })
    );
  }

  private updateChart(): void {
    if (!this.visits || this.visits.length === 0) {
      this.chartData = null;
      return;
    }

    const bgColors = this.visits.map((_, i) => this.colors[i % this.colors.length]);

    this.chartData = {
      labels: this.visits.map((v) => v.name),
      datasets: [
        {
          label: 'Visits',
          data: this.visits.map((v) => v.value),
          backgroundColor: bgColors,
          borderRadius: 8,
          borderSkipped: false,
          maxBarThickness: 50
        }
      ]
    };
  }

  onChartSelect(event: any): void {
    if (!event || event.element === undefined) return;
    const idx = event.element.index;
    const selected = this.visits[idx];
    if (selected && selected.name) {
      this.dashboardService.selectedUnitByDate.next(selected.name);
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
