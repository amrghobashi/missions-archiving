import { Component } from '@angular/core';
import { MissionComponent } from "./mission/mission.component";
import { TabsModule } from 'primeng/tabs';
import { MissionService } from './mission/mission.service';
import { Mission } from '../../models/mission';
import { CommonModule } from '@angular/common';
import { MissionStaffComponent } from "./mission-staff/mission-staff.component";
import { MissionCarComponent } from "./mission-car/mission-car.component";
import { MissionVisitComponent } from './mission-visit/mission-visit.component';
import { MissionBattelionComponent } from './mission-battelion/mission-battelion.component';

@Component({
  selector: 'app-mission-container',
  standalone: true,
  imports: [TabsModule, MissionComponent, CommonModule, MissionStaffComponent,
    MissionCarComponent, MissionBattelionComponent, MissionVisitComponent],
  templateUrl: './mission-container.component.html',
  styleUrl: './mission-container.component.scss'
})
export class MissionContainerComponent {
    constructor(private missionService: MissionService ) { }
    mission: Mission | undefined;
    tabsHeader = '';
    activeTabValue: string = '0'
    ngOnInit() {
        this.missionService.selectedMission.subscribe((mission) => {
          if(mission) {
            this.mission = mission;
            const formatDate = (dateStr: string) => {
              if (!dateStr) return '';
              const d = new Date(dateStr);
              const day = String(d.getDate()).padStart(2, '0');
              const month = String(d.getMonth() + 1).padStart(2, '0');
              const year = String(d.getFullYear()).slice(-2);
              return `${day}-${month}-${year}`;
            };
            this.tabsHeader = 'مأمورية رقم ' + mission.id + ' في ' + mission.zone_name + ' في الفترة من ' + formatDate(mission.start_date) + ' إلى ' + formatDate(mission.end_date);
            setTimeout(() => {
              this.activeTabValue = '1'; // Set the active tab to the first tab
            }, 1000);
          } else {
            this.mission = undefined
            this.tabsHeader = '';
            this.activeTabValue = '0'; // Reset to the default tab
          }
        });
    }
    
}
