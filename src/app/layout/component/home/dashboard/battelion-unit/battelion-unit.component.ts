import { Component, HostListener } from '@angular/core';
import { LegendPosition, NgxChartsModule } from '@swimlane/ngx-charts';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ScaleType } from '@swimlane/ngx-charts';
import { Subscription } from 'rxjs';
import { DashboardService } from './../dashboard.service';
import { Stats } from '../../../models/dashboard';

@Component({
  selector: 'app-battelion-unit',
  imports: [NgxChartsModule, CommonModule, FormsModule],
  templateUrl: './battelion-unit.component.html',
  styleUrl: './battelion-unit.component.scss'
})
export class BattelionUnitComponent {
  subscription: Subscription = new Subscription();
  visits = [];
  // visits = [{
  //       "name": "ك 11 حرس حدود بري",
  //       "series": [
  //           {
  //               "name": "الحيز البحري - (L0-03)",
  //               "value": 5
  //           },
  //           {
  //               "name": "الحيز البحري - (L0-01)",
  //               "value": 3
  //           }
  //       ]
  //   },
  //   {
  //       "name": "ك 12 حرس حدود بري",
  //       "series": [
  //           {
  //               "name": "ك 100 (الشهيد درويش) - (L0-05)",
  //               "value": 3
  //           },
  //           {
  //               "name": "تل المخروطي - (L0-01)",
  //               "value": 19
  //           }
  //       ]
  //   },
  //   {
  //       "name": "ك 13 حرس حدود بري",
  //       "series": [
  //           {
  //               "name": "ك 100 (الشهيد درويش) - (L0-05)",
  //               "value": 3
  //           },
  //           {
  //               "name": "تل المخروطي - (L0-01)",
  //               "value": 4
  //           }
  //       ]
  //   },
  //   {
  //       "name": "ك 14 حرس حدود بري",
  //       "series": [
  //           {
  //               "name": "ك 100 (الشهيد درويش) - (L0-05)",
  //               "value": 2
  //           },
  //           {
  //               "name": "تل المخروطي - (L0-01)",
  //               "value": 8
  //           },
  //           {
  //               "name": "ك 100 (الشهيد درويش) - (L0-05)",
  //               "value": 5
  //           },
  //           {
  //               "name": "تل المخروطي - (L0-01)",
  //               "value": 4
  //           }
  //       ]
  //   },
  //   {
  //       "name": "ك 15 حرس حدود بري",
  //       "series": [
  //           {
  //               "name": "ك 100 (الشهيد درويش) - (L0-05)",
  //               "value": 12
  //           },
  //           {
  //               "name": "تل المخروطي - (L0-01)",
  //               "value": 4
  //           }
  //       ]
  //   }
  // ];
  view: [number,number] = [550, 360];

  // options
  legendPosition: LegendPosition = LegendPosition.Below;
  showXAxis: boolean = true;
  showYAxis: boolean = true;
  gradient: boolean = false;
  showLegend: boolean = true;
  showXAxisLabel: boolean = false;
  xAxisLabel: string = 'الكتائب';
  showYAxisLabel: boolean = false;
  yAxisLabel: string = 'عدد الزيارات';
  animations: boolean = true;

  colorScheme = {
    name: 'customScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#b7e4c7', '#95d5b2', '#74c69d', '#2d6a4f', '#081c15', '#1b4332', '#52b788', '#40916c', '#d8f3dc']
  };

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.setChartSize(window.innerWidth);
    this.getBatUnitVisits();
  }

    @HostListener('window:resize', ['$event'])
    onResize(event: any): void {
      this.setChartSize(event.target.innerWidth);
    }
  
    setChartSize(width: number): void {
      console.log('Setting chart size based on window width:', width);
      if (width > 1500) {
        this.view = [525, 400]; 
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

  getBatUnitVisits() {
    this.subscription = this.dashboardService.getBatUnitVisit().subscribe(
      (data: any) => {
        this.visits = data;
        console.log('Bat Unit Visits:', this.visits);
      },
      (error: any) => {
        console.error('Error fetching Bat Unit Visits:', error);
      }   
    );
  }

  onSelect(event: any) {
    // event.name might be: "تل المخروطي - (L0-01)"
    const match = event.name.match(/\(([^)]+)\)$/);
    const code = match ? match[1] : '';
    console.log('Extracted code:', event);
    this.dashboardService.selectedUnit.next({'code': code, 'name': event.name, 'parent': event.series}); // Assuming selectedUnit is a BehaviorSubject or similar
    // You can now use `code` as needed
  }
}
