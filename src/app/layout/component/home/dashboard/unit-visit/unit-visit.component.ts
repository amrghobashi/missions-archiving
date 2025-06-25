import { Component, HostListener } from '@angular/core';
import { DashboardService } from '../dashboard.service';
import { LegendPosition, NgxChartsModule } from '@swimlane/ngx-charts';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ScaleType } from '@swimlane/ngx-charts';
import { Subscription } from 'rxjs';
import { PurposeStats } from '../../../models/dashboard';

@Component({
  selector: 'app-unit-visit',
  imports: [NgxChartsModule, CommonModule, FormsModule],
  templateUrl: './unit-visit.component.html',
  styleUrl: './unit-visit.component.scss'
})
export class UnitVisitComponent {
  subscription: Subscription = new Subscription();
  selectedUnit: string | null = null;
  visits: PurposeStats[] = [{
        "name": "September 2025",
        "value": 10
    },{
        "name": "September 2024",
        "value": 12
    },{
        "name": "September 2023",
        "value": 17
    },{
        "name": "September 2022",
        "value": 5
    },{
        "name": "September 2021",
        "value": 3
    },{
        "name": "September 2020",
        "value": 10
    },{
        "name": "September 2019",
        "value": 1
    },{
        "name": "September 2018",
        "value": 6
    },{
        "name": "September 2017",
        "value": 1
    },{
        "name": "September 2016",
        "value": 3
    },{
        "name": "September 2015",
        "value": 1
    }];
  colorScheme = {
    name: 'customScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#5AA454', '#C7B42C', '#AAAAAA']
  };
  // view: [number,number] = [1000, 400];


    view: [number,number] = [550, 360];

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Country';
  showYAxisLabel = true;
  yAxisLabel = 'Population';


  constructor(private dashboardService: DashboardService) {}
  ngOnInit() {
    this.setChartSize(window.innerWidth);
    this.subscription = this.dashboardService.selectedUnit.subscribe(data => {
      if (data) {
        console.log('Selected Unit:', data);
        this.selectedUnit = data.name;
        this.getVisits(data.code);
      } else {
        // this.visits = null; // Reset visits if no unit is selected
      }
    });
    // this.getVisits();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.setChartSize(event.target.innerWidth);
  }

  setChartSize(width: number): void {
    console.log('Setting chart size based on window width:', width);
    if (width > 1500) {
      this.view = [525, 360]; 
    }
    else if (width > 1300) {
      this.view = [500, 360];
    } else if (width > 1200) {
      this.view = [470, 340];
    }
     else {
      this.view = [600, 360];
    }
    console.log('Chart size set to:', this.view);
  }

  getVisits(id: string) {
    this.subscription = this.dashboardService.getUnitVisits(id).subscribe(data => {
      this.visits = data;
      console.log('Visits:', this.visits);
    });
  }
  onSelect(event: any) {
    console.log('Chart item selected', event.name);
    this.dashboardService.selectedUnitByDate.next(event.name);
  }

    ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
