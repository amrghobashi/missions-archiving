import { Component } from '@angular/core';
import { MissionComponent } from "./mission/mission.component";
import { TabsModule } from 'primeng/tabs';
import { MissionService } from './mission/mission.service';
import { Mission } from '../../models/mission';
import { CommonModule } from '@angular/common';
import { MissionStaffComponent } from "./mission-staff/mission-staff.component";

@Component({
  selector: 'app-mission-container',
  standalone: true,
  imports: [TabsModule, MissionComponent, CommonModule, MissionStaffComponent],
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
            this.tabsHeader = 'مهمة رقم ' + mission.id + ' في ' + mission.zone_name + ' في الفترة من ' + mission.start_date + ' إلى ' + mission.end_date;
            setTimeout(() => {
              this.activeTabValue = '1'; // Set the active tab to the first tab
            }, 100);
          } else {
            this.mission = undefined
            this.tabsHeader = '';
            this.activeTabValue = '0'; // Reset to the default tab
          }
        });
    }
    
}
